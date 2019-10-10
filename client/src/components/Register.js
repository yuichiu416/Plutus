//client/src/components/Register.js
import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import { REGISTER_USER } from "../graphql/mutations";

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            email: "",
            password: ""
        };
    }

    update(field) {
        return e => this.setState({ [field]: e.target.value });
    }

    updateCache(client, { data }) {
        console.log(data);
        // here we can write directly to our cache with our returned mutation data
        client.writeData({
            data: { 
                isLoggedIn: data.register.loggedIn,
                currentUser: data.register.id
             }
        });
    }

    render() {
        return (
            <body className="register-body">
            <Mutation
                mutation={REGISTER_USER}
                onCompleted={data => {
                    const { token, id } = data.register;
                    localStorage.setItem("currentUser", id);
                    localStorage.setItem("auth-token", token);
                    this.props.history.push("/");
                }}
                update={(client, data) => this.updateCache(client, data)}
            >
                {registerUser => (
                // <body className="register-body">
                    <div className="create-form">
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                registerUser({
                                    variables: {
                                        name: this.state.name,
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
                                type="name"
                                value={this.state.name}
                                onChange={this.update("name")}
                                placeholder="Name"
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
                            <button type="submit">Sign up</button>
                        </form>
                    </div>
                // </body>
                )}
            </Mutation>
            </body>
        );
    }
}

export default Register;