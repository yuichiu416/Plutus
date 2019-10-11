//client/src/components/Login.js
import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import { LOGIN_USER } from "../graphql/mutations";
import { translate } from 'react-switch-lang';


class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    update(field) {
        return e => this.setState({ [field]: e.target.value });
    }

    updateCache(client, { data }) {
        // here we can write directly to our cache with our returned mutation data
        client.writeData({
            data: { 
                isLoggedIn: data.login.loggedIn,
                currentUser: data.login.id
             }
        });
    }
    handleSubmit(e, loginUser){
        e.preventDefault();
        loginUser({
            variables: {
                email: this.state.email,
                password: this.state.password
            }
        })
    }

    render(){
        const { t } = this.props;
        return (
            <body className="login-body">
            <Mutation
                mutation={LOGIN_USER}
                onCompleted={data => {
                    const { token, id } = data.login;
                    localStorage.setItem("currentUser", id);
                    localStorage.setItem("auth-token", token);
                    this.props.history.push("/");
                }}
                update={(client, data) => this.updateCache(client, data)}
            >
                {loginUser => (
                    <div className="create-form">
                        <form onSubmit={ e => this.handleSubmit(e, loginUser)} >
                            <fieldset>
                                <input
                                    type="email"
                                    value={this.state.email}
                                    onChange={this.update("email")}
                                    placeholder={t("label.email")}
                                    className="field1"
                                />
                                <input
                                    value={this.state.password}
                                    onChange={this.update("password")}
                                    type="password"
                                        placeholder={t("label.password")}
                                    className="field1"
                                />
                            </fieldset>
                            <button type="submit">{t("button.login")}</button>
                        </form>
                    </div>
                )}
            </Mutation>
            </body>
        );
    }
}

export default translate(Login);