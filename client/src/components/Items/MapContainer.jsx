import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
import { withRouter } from 'react-router-dom';
import { geolocated } from "react-geolocated";
import { translate } from 'react-switch-lang';

const { FETCH_ITEMS } = queries;

export class MapContainer extends Component {
    constructor(props){
        super(props);
        this.handleCurrentItem = this.handleCurrentItem.bind(this);
    }
    displayMarkers(){
        return this.items.map((obj, index) => {
            let location = JSON.parse(obj.location);
            location = {lat: location.latitude, lng: location.longitude}
            return <Marker key={index} id={index} position={location}
                onClick={() => this.props.history.push(`/items/${obj.id}`)}
                ></Marker>
        })
    }
    handleCurrentItem(items){
        for(let i = 0; i < items.length; i++){
            if(items[i].id === this.props.match.params.id){
                this.item = items[i]
                this.coords = JSON.parse(items[i].location);
            }
        }
    }

    render() {
        return (
            <Query query={FETCH_ITEMS}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;
                    if (data.items.length === 0)
                        return <h1>No items yet</h1>
                    this.items = data.items;
                    this.handleCurrentItem(data.items);
                    let coords = this.coords
                    if(!coords){
                        alert("The item doesn't have location information, initializing map with your location instead");
                        coords = this.props.coords;
                        return <h1>Loading...</h1>
                    }
                    console.log(coords);
                    return (
                        <Map
                            google={this.props.google}
                            zoom={12}
                            initialCenter={{ lat: coords.latitude, lng: coords.longitude }}
                        >
                            {this.displayMarkers()}
                        </Map>
                    );
                }}
            </Query>
        );
    }
}
export default translate(geolocated()(
    withRouter(GoogleApiWrapper({
    apiKey: 'AIzaSyDM9z1mv9d6Smdi3Z3vdDlUdabGYObzSvo'
})(MapContainer))));