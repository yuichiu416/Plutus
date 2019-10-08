import React, { Component } from 'react'
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
import { Mutation } from "react-apollo";
import UserDetail from './UserDetail';
const { FETCH_USERS } = queries; 

export default class UserProfile extends React.Component {
    constructor(props) {
        super(props)
    }

    showDetail(e){
        e.preventDefault();
        const lis = document.getElementsByClassName("nav-link");
        for( let i = 0; i < lis.length; i++){
            if (lis[i].classList.contains("active")){
                lis[i].classList.toggle("active");
            };
        };
        debugger
        e.target.classList.toggle("active")
    }
    
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
                            <ul className="nav nav-tabs" onClick={this.showDetail}>
                                <li className="nav-item">
                                    <a class="nav-link active" data-toggle="tab">Setting</a>
                                </li>
                                <li className="nav-item">
                                    <a class="nav-link" data-toggle="tab">Items</a>
                                </li>
                                <li className="nav-item">
                                    <a class="nav-link" data-toggle="tab">Messages</a>
                                </li>
                            </ul>
                            
                            
                            
                            <UserDetail user={user} />
                        </div>
                    )
                }}
            </Query>
            
        )
    }
}
