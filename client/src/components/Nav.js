
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
                        const id = localStorage.getItem("currentUser")
                        if (data.isLoggedIn) {
                            return (
                                <div className="loggedin-navbar">
                                    <Link to="/index"><img src="Logo5.png" alt="plutus-logo" className="plutus-logo-nav" /></Link>
                                        <div className="menu-wrap">
                                            <input type="checkbox" className="toggler" id="toggler"/>
                                                <div className="hamburger"><div></div></div>
                                                <div className="menu" >
                                                    <div>
                                                        <div>
                                                            <ul>
                                                        <li onClick={() => document.getElementById("toggler").click()}><Link to={`/users/${id}`}>Profile</Link></li>
                                                        <li onClick={() => document.getElementById("toggler").click()}><Link to={`/users/${id}/items`}>Items</Link></li>
                                                        <li onClick={() => document.getElementById("toggler").click()}><Link to={`/users/${id}/messages`}>Messages</Link></li>
                                                        <li onClick={() => document.getElementById("toggler").click()}><Link to={`/users/${id}/notifications`}>Notifications</Link></li>
                                                                <SearchForm />
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
                                    <div className="menu-wrap">
                                        <input type="checkbox" className="toggler" />
                                        <div className="hamburger"><div></div></div>
                                        <div className="menu">
                                            <div>
                                                <div>
                                                    <ul>
                                                        <li><a href={`/users/${id}`}>Profile</a></li>
                                                        <li><a href={`/users/${id}/items`}>Items</a></li>
                                                        <li><a href={`/users/${id}/messages`}>Messages</a></li>
                                                        <li><a href={`/users/${id}/notifications`}>Notifications</a></li>
                                                        <SearchForm />
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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