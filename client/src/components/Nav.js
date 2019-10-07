// components/Nav.js
import React from 'react';
import { Query, ApolloConsumer } from "react-apollo";
import Queries from "../graphql/queries";
import { Link, withRouter } from 'react-router-dom';
const { IS_LOGGED_IN } = Queries;

const Nav = props => {
    return (
        <ApolloConsumer>
            {client => (
                <Query query={IS_LOGGED_IN}>
                    {({ data }) => {
                        if (data.isLoggedIn) {
                            return (
                                <div class="loggedin-navbar">
                                    <img src="Logo5.png" alt="plutus-logo" class="plutus-logo-nav"/>
                                <div class="nav-logout-div">
                                    <button
                                        class="nav-logout-button"
                                        onClick={e => {
                                            e.preventDefault();
                                            localStorage.removeItem("auth-token");
                                            client.writeData({ data: { isLoggedIn: false } });
                                            props.history.push("/");
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                                </div>
                            );
                        } else {
                            return (
                                <div class="loggedout-navbar">
                                    <img src="Logo5.png" alt="plutus-logo-nav" class="plutus-logo-nav" />
                                    <div class="nav-button-duo">
                                        <Link to="/login" class="nav-button">Login</Link>
                                        <Link to="/register" class="nav-button">Sign Up</Link>
                                    </div>
                                    <div class="nav-shadow"></div>
                                </div>
                                
                            );
                        }
                    }}
                </Query>
            )}
        </ApolloConsumer>
    );
};

export default withRouter(Nav);