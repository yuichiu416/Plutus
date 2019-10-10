import React from 'react';
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Image } from 'cloudinary-react';
import socketIOClient from "socket.io-client";
import Map from './MapContainer';
import { geolocated } from "react-geolocated";
import { translate } from 'react-switch-lang';
import { Mutation } from "react-apollo";
import { MAKE_BID, TOGGLE_SOLD } from '../../graphql/mutations';
import { withApollo } from 'react-apollo';
import CreateMessage from '../Messages/CreateMessage';

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
            currentPrice: null,
            mybid: 0,
            sold: ""
        };
        this.update = this.update.bind(this);
        this.send = this.send.bind(this);
        this.handlebid = this.handlebid.bind(this);
        this.id = this.props.match.params.id;
        this.currentPrice = 0;
    }
    send(){
        console.log(this.state.mybid);
        if(parseFloat(this.state.currentPrice) >= parseFloat(this.state.mybid))
            return alert("Bid too low, please make a higher bid");

        const socket = socketIOClient(this.state.endpoint);
        socket.emit('bid', this.state.mybid);
        const input = document.getElementById("mybid-input");
        if(input)
            input.value = "";
    }
    componentDidMount(){
        const socket = socketIOClient(this.state.endpoint);
        socket.on('bid', (currentPrice) => {
                this.setState({ currentPrice: currentPrice })
            });
    }

    

    update(field) {
        return e => this.setState({ [field]: e.target.value });
    }
    countDown(endTime){
        const that = this;
        const { t } = this.props;
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
            timer.innerHTML = t("label.auctionIsDueIn") + days + "d " + hours + "h "
                + minutes + "m " + seconds + "s ";

            if (that.timer || distance < 0) {
                clearInterval(x);
                timer.innerHTML = t("label.auctionEnded");
                this.props.client.mutate({
                    mutation: TOGGLE_SOLD,
                    variables: { id: this.props.match.params.id }
                });
            }
        }, 1000);
    }

    
    updateCache(cache, { data }) {
        let items;
        try {
            items = cache.readQuery({ query: FETCH_ITEMS });
        } catch (err) {
            return;
        }
        if (items) {
            let itemArray = items.items;
            let item = data.makeBid;
            itemArray.find((obj, idx) => (obj.id === this.id ? itemArray[idx] = item : ""));
            cache.writeQuery({
                query: FETCH_ITEMS,
                data: { items: itemArray }
            });
        }
    }
    handlebid(e, makeBid){
        e.preventDefault();
        makeBid({
            variables: {
                id: this.id,
                current_price: parseFloat(this.state.mybid),
                highestBidder: localStorage.getItem("currentUser")
            }
        }).then( response => {
            this.setState({ currentPrice: response.data.current_price})
        }).catch( err => console.log(err));
        document.getElementById("mybid-input").value="";
    }
    
    render() {
        const { t } = this.props;
        
        return (
            <Query query={FETCH_ITEMS}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;
                    if (data.items.length === 0)
                        return <h1>No items yet, <Link to="/items/new" > {t("button.createNewItem")}</Link></h1>
                    const item = data.items.find(obj => obj.id === this.props.match.params.id);
                    const countdownMinutes = item.endTime || 0;
                    this.countDown(countdownMinutes);
                    this.currentPrice = Math.max(item.starting_price, item.current_price);
                    const images = item.champions.map(champion => {
                        return <li key={champion}>
                            <Image className="box-image" cloudName='chinweenie' publicId={champion}/>
                        </li>
                    });
                    return (
                        <body className="item-show-body">
                        <div className="item-show-wrapper">
                            {/* <Link to="/">Home</Link> */} 
                            <div className="box-header">
                                <h1 className="box-header">{t("h1.itemName")} {item.name}</h1>
                            </div>
                            <div className="box-content">
                                <p className="box-content">{item.description}</p>
                            </div>
                            <div className="box-images">
                                <ul>
                                    {images}
                                </ul>
                            </div>
                            <div className="box-bid">
                                <p id="timer"></p>
                                <br />
                                <label>
                                    <br/>
                                    {t("label.currentPrice")} {this.state.currentPrice || this.currentPrice}
                                </label>
                                <br />
                            {/* </div>
                            <div> */}
                                <Mutation
                                    mutation={MAKE_BID}
                                    // if we error out we can set the message here
                                    onError={err => this.setState({ message: err.message })}
                                    // we need to make sure we update our cache once our new item is created
                                    update={(cache, data) => this.updateCache(cache, data)}
                                    // when our query is complete we'll display a success message
                                    onCompleted={data => {
                                        this.setState({
                                            message: `Made bid created successfully`
                                        });
                                    }}
                                >
                                    {(makeBid) => {
                                            return <form className="box-bid-form" onSubmit={e => this.handlebid(e, makeBid)}>
                                            {t("label.sendYourBidHere")}
                                            <br />
                                            <input type="text" onChange={this.update("mybid")} id="mybid-input" />
                                            <br/>
                                            <button type="submit" onClick={this.send}>{t("button.bid")}</button>
                                        </form>
                                    }}
                                </Mutation>
                            </div>
                            <Link to={`${this.props.match.params.id}/edit`} >{t("button.editItem")}</Link>
                            
                                <Map className="box-map"/>
                        </div>
                        </body>
                    );
                }}
            </Query>
        );
    }
}

export default withApollo(translate(geolocated()(withRouter(ItemShow))));