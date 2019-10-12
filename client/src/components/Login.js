//client/src/components/Login.js
import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import { LOGIN_USER } from "../graphql/mutations";
import { translate } from 'react-switch-lang';
import { Link } from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDemo = this.handleDemo.bind(this);
        this.handleDemoPassword = this.handleDemoPassword.bind(this);
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

    handleDemo(e) {
        e.preventDefault();
        this.setState({
            username: "",
            email: "",
            password: ""
        });
        const email = 'demo@plutus.com'.split('');
        this.handleDemoUsername(email);
    }
    handleDemoUsername(email) {
        setTimeout(() => {
            this.setState({ email: this.state.email + email.shift() }, () => {
                if (email.length === 0) {
                    const password = '123123'.split('');
                    this.handleDemoPassword(password);
                } else {
                    this.handleDemoUsername(email);
                }
            });
        }, 150);
    }
    handleDemoPassword(password) {
        setTimeout(() => {
            this.setState({ password: this.state.password + password.shift() }, () => {
                if (password.length === 0) {
                    this.loginUser({
                        variables: {
                            email: this.state.email,
                            password: this.state.password
                        }
                    })
                } else {
                    this.handleDemoPassword(password);
                }
            });
        }, 150);
    }
    handleSubmit(e){
        e.preventDefault();
        this.loginUser({
            variables: {
                email: this.state.email,
                password: this.state.password
            }
        })
    }

    render(){
        const { t } = this.props;
        return (
            <div className="login-body">
            <Mutation
                mutation={LOGIN_USER}
                onCompleted={data => {
                    const { token, id } = data.login;
                    localStorage.setItem("currentUser", id);
                    localStorage.setItem("auth-token", token);
                }}
                update={(client, data) => this.updateCache(client, data)}
            >
                {loginUser => {
                    this.loginUser = loginUser;
                
                    return <div className="create-form">
                        <form onSubmit={this.handleSubmit} >
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
                            <Link to="/index" ><button type="submit">{t("button.login")}</button></Link>
                            <Link to="/index" ><button onClick={this.handleDemo}>{t("button.demo")}</button></Link>
                            
                        </form>
                    </div>
                }}
            </Mutation>
            </div>
        );
    }
}

export default translate(Login);