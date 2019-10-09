import React, { Component } from 'react'
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
import { Mutation } from "react-apollo";
import { ADD_REPLY } from '../../graphql/mutations';
import './MessageDetail.css';
import { translate } from 'react-switch-lang';

const { FETCH_MESSAGE } = queries;

class MessageDetail extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            id: this.props.match.params.messageId,
            body: "",   
            message: ""      
        }
        this.update = this.update.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.updateCache = this.updateCache.bind(this);
    }

    handleSubmit(e, addReply){
        e.preventDefault();
        const variables = {
            id: this.state.id,
            body: this.state.body
        };
        addReply({
            variables
        }).then(response => {
            this.setState({
                body: "",
                message: ""
            })
        })
    }
    
    update(e){
        e.preventDefault();
        this.setState({body: e.target.value});
    }

    // updateCache(cache, {addReply}){
    //     debugger
    //     let message;
    //     try {
    //         message = cache.readQuery({ query: FETCH_MESSAGE, variables: {id: this.props.match.params.messageId} });
    //     } catch (error) {
    //         return;
    //     }
    //     debugger
    //     if (message){
    //         let repliesArray = message.message.replies;
    //         debugger
    //         cache.writeQuery({
    //             query: FETCH_MESSAGE,
    //             variables: this.props.match.params.messageId,
    //             data: { message: repliesArray.concat(addReply) }
    //         });
    //         debugger
    //     }
    // }
    
    render() {
        const { t } = this.props;
        return (
            <Query query={FETCH_MESSAGE} variables={{id: this.props.match.params.messageId}}>
                {({loading, error, data}) => {
                    if (loading) return <p>Loading...</p>
                    if (error) return <p>{error.message}</p>
                    const { title, body, sender, replies } = data.message;
                    let repliesLi;
                    if (replies.length === 0){
                        repliesLi = <p>No replies yet</p>
                    } else {
                        repliesLi = replies.map(reply => {
                            if (reply.sender.id === localStorage.getItem("currentUser")) {
                                return (
                                    <li key={reply.id} className="left-message">
                                        <div className="arrow-left"></div>
                                        <h3>{reply.sender.name}</h3>
                                        <p>{reply.body}</p>
                                    </li>
                                )
                            } else {
                                return (
                                    <li key={reply.id} className="right-message">
                                        <div className="arrow-right"></div>
                                        <h3>{reply.sender.name}</h3>
                                        <p>{reply.body}</p>
                                    </li>
                                )
                            }
                        })
                    }
                    
                    return (
                        <div className="message-detail">
                            <h1>{title}</h1>
                            <h3>{t("h3.sentBy")} {sender.name}</h3>
                            <p>{body}</p>
                            <h2>{t("h2.replies")}</h2>
                            <ul className="replies-ul" >
                                {repliesLi}
                            </ul>
                            <Mutation
                                mutation={ADD_REPLY}
                                onError={err => this.setState({message: err.message})}
                                onCompleted={data => {
                                    this.setState({message: "Reply has been sent"})
                                }}
                                refetchQueries={() => {
                                    return [{
                                        query: FETCH_MESSAGE,
                                        variables: {id: this.props.match.params.messageId}
                                    }]
                                }}
                                // update={(cache, data) => this.updateCache(cache, data)}
                            >
                                {(addReply, data) => (
                                    <form onSubmit={(e) => this.handleSubmit(e, addReply)}>
                                        <textarea value={this.state.body} onChange={this.update} cols="30" rows="10"></textarea>
                                        <button>{t("button.reply")}</button>
                                    </form>
                                )}
                            </Mutation>
                        </div>
                    )
                }}
            </Query>
                
        )
    }
}
export default translate(MessageDetail);