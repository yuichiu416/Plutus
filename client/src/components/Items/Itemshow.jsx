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

const { FETCH_ITEMS } = queries;

class ItemShow extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            currentUsers: [],
            userActivity: [],
            username: null,
            text: '',
            endpoint: window.location.origin.replace(/^http/, 'ws').replace(/3000/, "5000"),
            currentPrice: null,
            mybid: 0,
            sold: ""
        };
        this.update = this.update.bind(this);
        this.send = this.send.bind(this);
        this.handlebid = this.handlebid.bind(this);
        this.id = this.props.match.params.id;
        this.currentPrice = 0;
        this.countDown = this.countDown.bind(this);
        this.timer = [];
    }
    componentWillUnmount() {
        this.timer.forEach(id => clearInterval(id))
    }
    componentDidMount(){
        const socket = socketIOClient(this.state.endpoint);
        socket.on('bid', (currentPrice) => {
                this.setState({ currentPrice: currentPrice });
            });
    }
    send(){
        if(parseInt(this.currentPrice) >= parseInt(this.state.mybid)){
            alert("Bid too low, please make a higher bid");
            return false;
        }
        if(this.item.endTime - new Date().getTime() <= 0){
            alert("Sorry, the auction for this item is ended.");
            return false;
        }
        const socket = socketIOClient(this.state.endpoint);
        socket.emit('bid', this.state.mybid);
        const input = document.getElementById("mybid-input");
        if(input)
            input.value = "";
        return true;
    }

    update(field) {
        return e => this.setState({ [field]: e.target.value });
    }
    
    countDown(){
        const { t } = this.props;

        var distance = this.endTime - new Date().getTime();
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

        if (distance < 0) {
            timer.innerHTML = t("label.auctionEnded");
            this.props.client.mutate({
                mutation: TOGGLE_SOLD,
                variables: { id: this.props.match.params.id }
            });
        }
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
        if(!this.send())
            return;
        makeBid({
            variables: {
                id: this.id,
                current_price: parseInt(this.state.mybid)
            }
        }).then( response => {
            this.setState({ currentPrice: response.data.makeBid.current_price})
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
                    this.item = data.items.find(obj => obj.id === this.props.match.params.id);
                    this.endTime = this.item.endTime || 0;
                    this.currentPrice = Math.max(this.item.starting_price, this.item.current_price);
                    const images = this.item.champions.map(champion => {
                        return <div className="box-images" key={champion}>
                            <Image className="box-image" cloudName='chinweenie' publicId={champion}/>
                        </div>
                    });
                    if(!this.item.seller)
                        return <h1>No seller information, please contact customer service</h1>
                    this.timer.push(setInterval(this.countDown, 1000));
                    return (
                        <div className="item-show-body">
                        <div className="item-show-wrapper">
                            {/* <div className="box-header"> */}
                                <h1 className="box-header"> &nbsp; &nbsp; {this.item.name}</h1>
                            {/* </div> */}
                            {/* <div className="box-content"> */}
                                <p className="box-content">{this.item.description}</p>
                            {/* </div> */}
                            <div className="box-images">
                                    {images}
                            </div>
                            {/* <div className="box-bid"> */}
                                <div className="nested-timer" id="timer"></div>
                                <br/>
                                    <label className="nested-current-price">
                                    <br/>
                                    {t("label.currentPrice")} {this.state.currentPrice || this.currentPrice}
                                </label>
                                <br />
                           {/* </div> */}
                                <div className="nested-bid-form">  
                                <Mutation
                                    mutation={MAKE_BID}
                                    // if we error out we can set the message here
                                    onError={err => this.setState({ message: err.message })}
                                    // we need to make sure we update our cache once our new item is created
                                    update={(cache, data) => this.updateCache(cache, data)}
                                    // when our query is complete we'll display a success message
                                    onCompleted={data => {
                                        this.setState({
                                            message: t("text.madeBidSuccessfully")
                                        });
                                    }}
                                >
                                    {(makeBid) => {
                                            return <form  onSubmit={e => this.handlebid(e, makeBid)}>
                                                {t("label.sendYourBidHere")}
                                                    <br />
                                                    <input type="text" onChange={this.update("mybid")} id="mybid-input" />
                                                    <br/>
                                                    <button type="submit" >{t("button.bid")}</button>
                                                </form>
                                    }}
                                </Mutation>
                            </div>
                            <div className="seller-info">
                                <h4>Seller info</h4>
                                <p>{this.item.seller.name}</p>
                                <p>{this.item.seller.email}</p>
                                <Link to={`/users/${this.item.seller.id}`}><h5>Contact seller</h5></Link>
                            </div>
                            <Link to={`${this.props.match.params.id}/edit`} className="box-edit-link">{t("button.editItem")}</Link>
                            <Map/>
                            <div className="footer"></div>
                        </div>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default withApollo(translate(geolocated()(withRouter(ItemShow))));