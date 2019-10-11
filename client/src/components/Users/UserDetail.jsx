import React, { Component } from 'react'
import { Mutation } from "react-apollo";
import { UPDATE_USER } from '../../graphql/mutations';
import { translate } from 'react-switch-lang';

// import queries from '../../graphql/queries';

// const { FETCH_USERS } = queries;

class UserDetail extends Component {
    constructor(props) {
        super(props)  
        this.state = this.props.user;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.update = this.update.bind(this);
    };

    handleSubmit(e, updateUser){
        e.preventDefault();
        const variables = {
            id: this.state.id,
            name: this.state.name,
            email: this.state.email
        }
        updateUser({
            variables
        }).then(response => {
            console.log(response.data);
        })
    };

    update(field){
        return e => {
            this.setState({[field]: e.target.value});
        }
    };

    
    render() {
        const { t } = this.props;
        return (
            <Mutation mutation={UPDATE_USER}>
                {(updateUser, data) => {
                    return <div>
                        <link rel="stylesheet" href="https://bootswatch.com/4/minty/bootstrap.min.css" />
                        <form onSubmit={(e) => this.handleSubmit(e, updateUser)}>
                            <fieldset>
                                <div className="form-group">
                                  <label htmlFor="exampleInputEmail1">{t("label.emailAddress")}</label>
                                  <input onChange={this.update("email")} value={this.state.email} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                                    <small id="emailHelp" className="form-text text-muted">{t("text.weWillNeverShareYourEmailWithAnyoneElse")}</small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="exampleInputName">{t("label.name")}</label>
                                    <input onChange={this.update("name")} value={this.state.name} type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" placeholder="Enter name" />
                                </div>

                            <button type="submit" className="btn btn-primary">{t("button.submit")}</button>
                            </fieldset>
                        </form>
                    </div>
                }}
            </Mutation>
        )
    }
}

export default translate(UserDetail);