import React from 'react'
import { Query } from 'react-apollo';
import { Mutation } from "react-apollo";
import { CREATE_MESSAGE } from '../../graphql/mutations';
import Queries from '../../graphql/queries';
const { FETCH_USERS } = Queries;

class CreateMessage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            title: "",
            body: "",
            receiver: "",
            message: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    update(field){
        return e => {
            this.setState({[field]: e.target.value});
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
        })
    }


    render() {
        return (
            <Mutation
                mutation={CREATE_MESSAGE}
                onError={err => this.setState({message: err.message})}
                onCompleted={data => {
                    this.setState({message: "The message has been sent"}); 
                }}>
                    {(newMessage, { data }) => {
                        return <div>
                            <form onSubmit={e => this.handleSubmit(e, newMessage)}>
                                <input 
                                    type="text" 
                                    value={this.state.title} 
                                    onChange={this.update("title")}
                                    placeholder="Title"/>
                                
                                <input 
                                    type="text" 
                                    value={this.state.body}
                                    onChange={this.update("body")}
                                    placeholder="Type your message here"/>

                              
                                <div>
                                    <select value={this.state.receiver} onChange={this.update("receiver")}>
                                        <option value="" disabled>--Please Select--</option>
                                        <Query query={FETCH_USERS}>
                                            {({ loading, error, data }) => {
                                                if (loading) return <p>Loading...</p>
                                                if (error) return <p>{error}</p>
                                                return data.users.map(({ id, name, email }) => {
                                                    return <option value={id}>
                                                        {name}
                                                    </option>
                                                })
                                            }}
                                        </Query>
                                    </select>
                                </div>
                                <button>Send</button>
                            </form>
                        </div>
                    }}
            </Mutation>
        )
    }
}

export default CreateMessage;