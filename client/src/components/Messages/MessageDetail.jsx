import React, { Component } from 'react'
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
const { FETCH_MESSAGE } = queries;

export default class MessageDetail extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    
    render() {
        return (
            <Query query={FETCH_MESSAGE} variables={{id: this.props.matahc.params.messageId}}>
                {({loading, error, data}) => {
                    if (loading) return <p>Loading...</p>
                    if (error) return <p>{error}</p>
                    const { id, title, body, sender, replies } = data;
                    return (
                        <h1>{title}</h1>
                        <p>{body}</p>
                    )
                }}
            </Query>
                
        )
    }
}
