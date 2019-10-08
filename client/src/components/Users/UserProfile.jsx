import React, { Component } from 'react'
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
import { Mutation } from "react-apollo";
import UserDetail from './UserDetail';
import UserItems from './UserItems';
import UserMessages from './UserMessages';
import './UserProfile.css';
const { FETCH_USERS } = queries; 

export default class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.openTab = this.openTab.bind(this);
    }

    openTab(field){
        return e => {
            const nonActiveAnchors = document.getElementsByClassName("user-tab");
            for (let i = 0; i < nonActiveAnchors.length; i++){
                if (!nonActiveAnchors[i].classList.contains("hidden")){
                    nonActiveAnchors[i].classList.toggle("hidden");
                }
            }
            debugger
            const activeAnchor = document.getElementsByClassName(field)[0];
            debugger
            activeAnchor.classList.toggle("hidden");
        }
    }

    showDetail(e){
        e.preventDefault();
        const lis = document.getElementsByClassName("nav-link");
        for( let i = 0; i < lis.length; i++){
            if (lis[i].classList.contains("active")){
                lis[i].classList.toggle("active");
            };
        };
        e.target.classList.toggle("active");
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
                                    <a class="nav-link active" data-toggle="tab" onClick={this.openTab("user-detail")}>Setting</a>
                                </li>
                                <li className="nav-item">
                                    <a class="nav-link" data-toggle="tab" onClick={this.openTab("user-items")}>Items</a>
                                </li>
                                <li className="nav-item">
                                    <a class="nav-link" data-toggle="tab" onClick={this.openTab("user-messages")}>Messages</a>
                                </li>
                            </ul>
                            
                            
                            <div className="user-tab user-detail">
                                <UserDetail user={user} />
                            </div>
                            <div className="user-tab user-items hidden">
                                <UserItems/>
                            </div>
                            <div className="user-tab user-messages hidden">
                                <UserMessages/>
                            </div>
                        </div>
                    )
                }}
            </Query>
            
        )
    }
}
