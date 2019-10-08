import React, { Component } from 'react'
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
import { Mutation } from "react-apollo";
import UserDetail from './UserDetail';
const { FETCH_USERS } = queries; 

export default class UserProfile extends React.Component {
    render() {
        return (
            <Query query={FETCH_USERS}>
                {({loading, error, data}) => {
                    if (loading) return <p>Loading...</p>
                    if (error) return <p>{error.message}</p>
                    const user = data.users.find(user => user.id === this.props.match.params.userId);
                    return (
                        <div>
                            <link rel="stylesheet" href="https://bootswatch.com/4/minty/bootstrap.min.css" />
                            <UserDetail user={user} />
                        </div>
                    )
                }}
            </Query>
            
        )
    }
}
