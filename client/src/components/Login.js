//client/src/components/Login.js
import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import { LOGIN_USER } from "../graphql/mutations";


class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        };
    }

    update(field) {
        return e => this.setState({ [field]: e.target.value });
    }

    updateCache(client, { data }) {
        // here we can write directly to our cache with our returned mutation data
        client.writeData({
            data: { isLoggedIn: data.login.loggedIn }
        });
    }

    render() {
        return (
            <Mutation
                mutation={LOGIN_USER}
                onCompleted={data => {
                    const { token } = data.login;
                    localStorage.setItem("auth-token", token);
                    this.props.history.push("/");
                }}
                update={(client, data) => this.updateCache(client, data)}
            >
                {loginUser => (
                    <div className="create-form">
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                loginUser({
                                    variables: {
                                        email: this.state.email,
                                        password: this.state.password
                                    }
                                });
                            }}
                        >
                            <fieldset>
                                <input
                                    type="email"
                                    value={this.state.email}
                                    onChange={this.update("email")}
                                    placeholder="Email"
                                    className="field1"
                                />
                                <input
                                    value={this.state.password}
                                    onChange={this.update("password")}
                                    type="password"
                                    placeholder="Password"
                                    className="field1"
                                />
                            </fieldset>
                            <button type="submit">Log In</button>
                        </form>
                    </div>
                )}
            </Mutation>
        );
    }
}

export default Login;