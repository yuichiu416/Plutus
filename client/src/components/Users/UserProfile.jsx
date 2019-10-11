import React, { Component } from 'react'
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
import UserDetail from './UserDetail';
import UserItems from './UserItems';
import UserMessages from './UserMessages';
import UserNotification from './UserNotification';
import { translate } from 'react-switch-lang';


// import { Mutation } from "react-apollo";
const { FETCH_USERS } = queries; 

class UserProfile extends Component {
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
            const activeAnchor = document.getElementsByClassName(field)[0];
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
        const { t } = this.props;
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
                                    <p class="nav-link active" data-toggle="tab" onClick={this.openTab("user-detail")}>{t("p.setting")}</p>
                                </li>
                                <li className="nav-item">
                                    <p class="nav-link" data-toggle="tab" onClick={this.openTab("user-items")}>{t("p.items")}</p>
                                </li>
                                <li className="nav-item">
                                    <p class="nav-link" data-toggle="tab" onClick={this.openTab("user-messages")}>{t("p.messages")}</p>
                                </li>
                                <li className="nav-item">
                                    <p class="nav-link" data-toggle="tab" onClick={this.openTab("user-notifications")}>{t("p.notifications")}</p>
                                </li>
                            </ul>
                            
                            
                            <div className="user-tab user-detail">
                                <UserDetail user={user} />
                            </div>
                            <div className="user-tab user-items hidden">
                                <UserItems user={user}/>
                            </div>
                            <div className="user-tab user-messages hidden">
                                <UserMessages user={user}/>
                            </div>
                            <div className="user-tab user-notifications hidden">
                                <UserNotification user={user}/>
                            </div>
                        </div>
                    )
                }}
            </Query>
            
        )
    }
}

export default translate(UserProfile);