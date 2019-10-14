//client/src/components/Register.js
import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import { REGISTER_USER } from "../graphql/mutations";
import { translate } from 'react-switch-lang';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
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
                isLoggedIn: data.register.loggedIn,
                currentUser: data.register.id
             }
        });
    }
    handleSubmit(e, registerUser){
        e.preventDefault();
        registerUser({
            variables: {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            }
        });
        this.props.history.push("/index");
    }

    render() {
        const { t } = this.props;
        return (
            <div className="register-body">
                <Mutation
                    mutation={REGISTER_USER}
                    onCompleted={data => {
                        const { token, id } = data.register;
                        localStorage.setItem("currentUser", id);
                        localStorage.setItem("auth-token", token);
                        this.props.history.push("/index");
                    }}
                    update={(client, data) => this.updateCache(client, data)}
                >
                    {registerUser => (
                        <div className="create-form">
                            <form onSubmit={e => this.handleSubmit(e, registerUser)}>
                                <fieldset>
                                    <input
                                        type="email"
                                        value={this.state.email}
                                        onChange={this.update("email")}
                                        placeholder={t("label.email")}
                                        className="field1"
                                    />
                                    <input
                                        type="name"
                                        value={this.state.name}
                                        onChange={this.update("name")}
                                        placeholder={t("label.name")}
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
                                <button type="submit">{t("button.signup")}</button>
                            </form>
                        </div>
                    )}
                </Mutation>
            </div>
        );
    }
}

export default translate(Register);