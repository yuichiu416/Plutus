import React, { Component } from 'react'
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import queries from "../../graphql/queries";
const { FETCH_MESSAGES } = queries;

class MessagesIndex extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Query query={FETCH_MESSAGES}>
                {({loading, error, data}) => {
                    if (loading) return <p>Loading...</p>
                    if (error) return <p>{error}</p>
                    const messages = data.messages.map(message => {
                        return (
                            <Link to={`/messages/${message.id}`}>
                                <li key={message.id}>
                                    <h3>{message.title}</h3>
                                    <p>Sent by {message.sender.name}</p>
                                    <p>{message.replies.length} replies</p>
                                </li>
                            </Link>
                        )
                    })

                    return (
                        <ul>
                            {messages}
                        </ul>
                    )
                }}
            </Query>
        )
    }
}

export default MessagesIndex

