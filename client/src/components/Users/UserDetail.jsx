import React, { Component } from 'react'
import { Mutation } from "react-apollo";
import { UPDATE_USER } from '../../graphql/mutations';
// import queries from '../../graphql/queries';

// const { FETCH_USERS } = queries;

export default class UserDetail extends Component {
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
        return (
            <Mutation mutation={UPDATE_USER}>
                {(updateUser, data) => {
                    return <div>
                        <link rel="stylesheet" href="https://bootswatch.com/4/minty/bootstrap.min.css" />
                        <form onSubmit={(e) => this.handleSubmit(e, updateUser)}>
                            <fieldset>
                                <div className="form-group">
                                  <label htmlFor="exampleInputEmail1">Email address</label>
                                  <input onChange={this.update("email")} value={this.state.email} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                                  <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="exampleInputName">Name</label>
                                    <input onChange={this.update("name")} value={this.state.name} type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" placeholder="Enter name" />
                                </div>

                            <button type="submit" className="btn btn-primary">Submit</button>
                            </fieldset>
                        </form>
                    </div>
                }}
            </Mutation>
        )
    }
}
