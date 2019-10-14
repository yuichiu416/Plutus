import React from 'react'
// import { Query } from 'react-apollo';
import { Mutation } from "react-apollo";
import { CREATE_MESSAGE } from '../../graphql/mutations';
import Queries from '../../graphql/queries';
// import Queries from '../../graphql/queries';
import { translate } from 'react-switch-lang';
import './CreateMessage.css';
// const { FETCH_USERS } = Queries;
const { FETCH_MESSAGES } = Queries;

class CreateMessage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            title: "",
            body: "",
            receiver: this.props.userId,
            message: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateCache = this.updateCache.bind(this);
    }

    update(field){
        return e => {
            this.setState({[field]: e.target.value});
        }
    }

    updateCache(cache, { data }){
        let messages;
        try {
            messages = cache.readQuery({ query: FETCH_MESSAGES })
        } catch (error) {
            return;
        }
        if (messages){
            let messagesArray = messages.messages;
            let newMessage = data.newMessage;
            cache.writeQuery({
                query: FETCH_MESSAGES,
                data: { messages: messagesArray.concat(newMessage) }
            })
        }
    }

    handleSubmit(e, newMessage){
        e.preventDefault();
        newMessage({
            variables: {
                title: this.state.title,
                body: this.state.body,
                receiver: this.state.receiver,
            }
        }).then(response => {
            console.log(response);
            this.setState({
                title: "",
                body:"",
                message: ""
            });
        })
    }

    render() {
        const { t } = this.props;
        return (
            <Mutation
                mutation={CREATE_MESSAGE}
                onError={err => this.setState({message: err.message})}
                update={(cache, data) => this.updateCache(cache, data)}
                onCompleted={data => {
                    this.setState({message: "The message has been sent"}); 
                }}
                >
                    {(newMessage, { data }) => {
                        return <div className="create-form">
                            <fieldset>
                            <form onSubmit={e => this.handleSubmit(e, newMessage)} className="create-message-form">
                                <input 
                                    type="name" 
                                    value={this.state.title} 
                                    onChange={this.update("title")}
                                    placeholder="Message title"
                                    className="field1"/>
                                    
                                <br/>
                                <textarea 
                                    value={this.state.body}
                                    onChange={this.update("body")}
                                    placeholder="Type your message here"/>

                              
                                {/* <div>
                                    <select value={this.state.receiver} onChange={this.update("receiver")}>
                                        <option value="" disabled>{t("option.pleaseSelect")}</option>
                                        <Query query={FETCH_USERS}>
                                            {({ loading, error, data }) => {
                                                if (loading) return <p>{t("p.loading")}</p>
                                                if (error) return <p>{error}</p>
                                                return data.users.map(({ id, name, email }) => {
                                                    return <option value={id}>
                                                        {name}
                                                    </option>
                                                })
                                            }}
                                        </Query>
                                    </select>
                                </div> */}
                                
                                
                                <button className="message-button">{t("button.send")}</button>
                            </form>
                            </fieldset>
                            {this.state.message}
                        </div>
                    }}
            </Mutation>
        )
    }
}

export default translate(CreateMessage);