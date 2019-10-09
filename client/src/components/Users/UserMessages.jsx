import React, { Component } from 'react'
import { Query } from "react-apollo";
import queries from '../../graphql/queries';
import { Link } from 'react-router-dom';
const { FETCH_MESSAGES } = queries;

export default class UserMessages extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <Query query={FETCH_MESSAGES}>
                {({loading, error, data}) => {
                    if (loading) return <p>Loading...</p>
                    if (error) return <p>{error.message}</p>
                    const messages = data.messages.filter(message => message.sender.id === this.props.user.id);
                    const messagesLi = messages.map(message => {
                        return (
                            <Link to={`/messages/${message.id}`}>
                                <li key={message.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <h3>{message.title}</h3>
                                <p>{message.replies.length} replie(s)</p>
                                </li>
                            </Link>
                            
                        )
                    })
                    return (
                        <div>
                            
                            <ul className="user-messages-ul list-group">
                                {messagesLi}
                            </ul>
                        </div>
                    )
                }}
            </Query>
        )
    }
}
