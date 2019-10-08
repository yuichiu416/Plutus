import React, { Component } from 'react'
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
import { Mutation } from "react-apollo";
import { ADD_REPLY } from '../../graphql/mutations';
const { FETCH_MESSAGE } = queries;

export default class MessageDetail extends React.Component {
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
        return (
            <Query query={FETCH_MESSAGE} variables={{id: this.props.match.params.messageId}}>
                {({loading, error, data}) => {
                    if (loading) return <p>Loading...</p>
                    if (error) return <p>{error.message}</p>
                    const { title, body, sender, replies } = data.message;
                    const repliesLi = replies.map(reply => (
                        <li key={reply.id}>
                            <h3>Sent by {reply.sender.name}</h3>
                            <p>{reply.body}</p>
                        </li>
                    ))
                    return (
                        <div>
                            <h1>{title}</h1>
                            <h3>Sent by {sender.name}</h3>
                            <p>{body}</p>
                            <ul>
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
                                        <button>Reply</button>
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
