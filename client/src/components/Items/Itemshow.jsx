import React from 'react';
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Image } from 'cloudinary-react';
import socketIOClient from "socket.io-client";
import Map from './MapContainer';
import { geolocated } from "react-geolocated";

const { FETCH_ITEMS } = queries;

class ItemShow extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            currentUsers: [],
            userActivity: [],
            username: null,
            text: '',
            endpoint: "localhost:5000",
            announce: ""
        };
        this.update = this.update.bind(this);
    }
    send = () => {
        const socket = socketIOClient(this.state.endpoint);
        socket.emit('send announce', this.state.announce);
        const input = document.getElementById("announce-input");
        if(input)
            input.value = "";
    }
    update(field) {
        return e => this.setState({ [field]: e.target.value });
    }
    componentDidMount = () => {
        const socket = socketIOClient(this.state.endpoint);
        setInterval(this.send(), 1000)
        socket.on('send announce', (announce) => {
            this.setState({ announce: announce })
        });
    }
    countDown(endTime){
        const that = this;
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
            if (that.timer || distance < 0) {
                clearInterval(x);
                timer.innerHTML = "Auction is EXPIRED";
            }
        }, 1000);
    }
    
    render() {
        // const { username } = this.state;
        return (
            <Query query={FETCH_ITEMS}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;
                    if (data.items.length === 0)
                        return <h1>No items yet, <Link to="/items/new" > Create one</Link></h1>
                    const item = data.items.find(obj => obj.id === this.props.match.params.id);
                    const countdownMinutes = item.endTime || 3;
                    this.countDown(countdownMinutes);
                    const images = item.champions.map(champion => {
                        return <li key={champion}>
                            <Image cloudName='chinweenie' publicId={champion}/>
                        </li>
                    });
                    return (
                        <div>
                            <Link to="/">Home</Link>
                            <h1>The item name is: {item.name}</h1>
                            <p>{item.description}</p>
                            <p id="timer"></p>
                            <ul>
                                {images}
                            </ul>
                            <label>
                                Send your messages here:
                                <input type="text" onChange={this.update("announce")} id="announce-input"/>
                                <button onClick={this.send}>Send</button>
                            </label>
                            <Link to={`${this.props.match.params.id}/edit`} > Edit Item</Link>
                            <label>
                                Announce: {this.state.announce}
                            </label>
                            <Map />
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default geolocated()(withRouter(ItemShow));