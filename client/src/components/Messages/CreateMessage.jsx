import React from 'react'
import { Mutation } from "react-apollo";
import { CREATE_MESSAGE } from '../../graphql/mutations';


class CreateMessage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            title: "",
            body: "",
            message: ""
        }
    }

    update(field){
        return e => {
            this.setState({[field]: e.target.value});
        }
    }

    handleSubmit(e, newMessage){
        e.preventDefault();
        newMessage({
            variables: {
                title: this.state.title,
                body: this.state.body
            }
        })
    }


    render() {
        return (
            <Mutation
                mutation={CREATE_MESSAGE}
                onError={err => this.setState({message: err.message})}
                onCompleted={data => {
                    this,this.setState({message: "The message has been sent"}); 
                }}>
                    {(newMessage, { data }) => {
                        <div>
                            <form onSubmit={e => this.handleSubmit(e, newMessage)}>
                                <input 
                                    type="text" 
                                    value={this.state.title} 
                                    onChange={this.update("title")}
                                    placeholder="Title"/>
                                
                                <input 
                                    type="text" 
                                    value={this.state.body}
                                    onChange={this.update("body")}
                                    placeholder="Type your message here"/>

                                
                            </form>
                        </div>
                    }}
            </Mutation>
        )
    }
}
