import React from 'react';
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
import Editor from 'react-medium-editor';
import { w3cwebsocket as W3CWebSocket } from "websocket";
const { FETCH_ITEMS } = queries;
const client = new W3CWebSocket('ws://127.0.0.1:8000');
const contentDefaultMessage = "Start writing your document here";

class ItemShow extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            currentUsers: [],
            userActivity: [],
            username: null,
            text: ''
        };
    }
    logInUser = () => {
        const username = this.username.value;
        if (username.trim()) {
            const data = {
                username
            };
            this.setState({
                ...data
            }, () => {
                client.send(JSON.stringify({
                    ...data,
                    type: "userevent"
                }));
            });
        }
    }
    
    onEditorStateChange = (text) => {
        client.send(JSON.stringify({
            type: "contentchange",
            username: this.state.username,
            content: text
        }));
    };

    componentWillMount() {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            const stateToChange = {};
            if (dataFromServer.type === "userevent") {
                stateToChange.currentUsers = Object.values(dataFromServer.data.users);
            } else if (dataFromServer.type === "contentchange") {
                stateToChange.text = dataFromServer.data.editorContent || contentDefaultMessage;
            }
            stateToChange.userActivity = dataFromServer.data.userActivity;
            this.setState({
                ...stateToChange
            });
        };
    }

    showLoginSection = () => (
        <div className="account">
            <div className="account__wrapper">
                <div className="account__card">
                    <div className="account__profile">
                        <p className="account__name">Hello, user!</p>
                        <p className="account__sub">Join to edit the document</p>
                    </div>
                    <input name="username" ref={(input) => { this.username = input; }} className="form-control" />
                    <button type="button" onClick={() => this.logInUser()} className="btn btn-primary account__btn">Join</button>
                </div>
            </div>
        </div>
    )
    showEditorSection = () => (
        <div className="main-content">
            <div className="history-holder">
                <ul>
                    {this.state.userActivity.map((activity, index) => <li key={`activity-${index}`}>{activity}</li>)}
                </ul>
            </div>
        </div>
    )
    render() {
        const { username } = this.state;
        return (
            <Query query={FETCH_ITEMS}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;
                    const item = data.items.find(obj => obj.id === this.props.match.params.id);
                    return (
                        <div>
                            <h1>The item name is: {item.name}</h1>
                            <p>{item.description}</p>
                            <Editor
                                options={{
                                    placeholder: {
                                        text: this.state.text ? contentDefaultMessage : ""
                                    }
                                }}
                                className="body-editor"
                                text={this.state.text}
                                onChange={this.onEditorStateChange}
                            />
                            {username ? this.showEditorSection() : this.showLoginSection()}
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default ItemShow;