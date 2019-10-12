
import React from 'react';
import { Query, ApolloConsumer } from "react-apollo";
import Queries from "../graphql/queries";
import { Link, withRouter } from 'react-router-dom';
import SearchForm from './SearchForm';
import { translate } from 'react-switch-lang';


const { IS_LOGGED_IN } = Queries;

const Nav = props => {
    const { t } = props;
    return (
        <ApolloConsumer>
            {client => (
                <Query query={IS_LOGGED_IN}>
                    {({ data }) => {
                        if (data.isLoggedIn) {
                            return (
                                <div className="loggedin-navbar">
                                    <Link to="/index"><img src="Logo5.png" alt="plutus-logo" className="plutus-logo-nav" /></Link>
                                    <SearchForm />
                                    <ul className="profile-dropdown-main" id="profile-dropdown-main">
                                        <li><img src="" className="" alt="" /></li>
                                        <ul className="profile-dropdown-menu" id="profile-dropdown-menu">
                                            <li className="profile-dropdown-header">
                                                <img src="" className="" alt="" />
                                            </li>
                                            <li><Link to={`/users/:id`}>Profile</Link></li>
                                        <li><Link to="/messages">Messages</Link></li>
                                        </ul>
                                    </ul>
                                    <div className="nav-logout-div">
                                        <div className="box-lgout">
                                            <div className="logout-btn">
                                                <span
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        localStorage.removeItem("auth-token");
                                                        localStorage.removeItem("currentUser");
                                                        client.writeData({ data: { isLoggedIn: false, currentUser: null } });
                                                        props.history.push("/index");
                                                    }}
                                                >{t("button.logout")}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="nav-shadow"></div>
                                </div>
                            ) 
                        } else {
                            return (
                                <div className="loggedout-navbar">
                                    <Link to="/index"><img src="Logo5.png" alt="plutus-logo" className="plutus-logo-nav" /></Link>
                                    <div className="nav-button-duo">
                                        <Link to="/login" className="nav-button">{t("button.login")}</Link>
                                        <Link to="/register" className="nav-button">{t("button.signup")}</Link>
                                    </div>
                                    <div className="nav-shadow"></div>
                                </div>
                            );
                        }
                    }}
                </Query>
            )}
        </ApolloConsumer>
    );
};

export default translate(withRouter(Nav));