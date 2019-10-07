import React from 'react';
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
import Editor from 'react-medium-editor';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Image } from 'cloudinary-react';

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
    countDown(endTime){
        // Update the count down every 1 second
        var x = setInterval(() => {

            // Get today's date and time
            var now = new Date().getTime();
            // Find the distance between now and the count down date
            var distance = endTime - now;
            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="timer"
            const timer = document.getElementById("timer");
            if(!timer)
                return;
            timer.innerHTML = "Auction is due in: " + days + "d " + hours + "h "
                + minutes + "m " + seconds + "s ";

            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(x);
                timer.innerHTML = "Auction is EXPIRED";
            }
        }, 1000);
    }
    
    render() {
        const { username } = this.state;
        return (
            <Query query={FETCH_ITEMS}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;
                    const item = data.items.find(obj => obj.id === this.props.match.params.id);
                    const countdownMinutes = item.endTime || 3;
                    this.countDown(countdownMinutes);
                    const images = item.champions.map(champion => {
                        return <li>
                            <Image cloudName='chinweenie' publicId={champion}/>
                        </li>
                    })
                    return (
                        <div>
                            <h1>The item name is: {item.name}</h1>
                            <p>{item.description}</p>
                            <h3 id="timer"></h3>
                            <ul>
                                {images}
                            </ul>
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
                            <Link to={`${this.props.match.params.id}/edit`} > Edit Item</Link>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default withRouter(ItemShow);