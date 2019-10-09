import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
import { withRouter } from 'react-router-dom';
import { geolocated } from "react-geolocated";

const { FETCH_ITEMS } = queries;

export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.stores = {};
    }

    displayMarkers = () => {
        return Object.values(this.stores).map((store, index) => {
            return <Marker key={index} id={index} position={{
                        lat: store.lat,
                        lng: store.lon
                     }}
                onClick={() => this.props.history.push(`/items/${store.id}`)}></Marker>
        })
    }

    render() {
        const mapStyles = {
            width: '100%',
            height: '100%',
        };
        return (
            <Query query={FETCH_ITEMS}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;
                    if (data.items.length === 0)
                        return <h1>No items yet</h1>
                    data.items.forEach(item => {
                        this.stores[item.name] = JSON.parse(item.location);
                        this.stores[item.name].id = item.id;
                    })
                    return (
                        <Map
                            google={this.props.google}
                            zoom={12}
                            style={mapStyles}
                            initialCenter={{ lat: this.props.coords.latitude, lng: this.props.coords.longitude }}
                        >
                            {this.displayMarkers()}
                        </Map>
                    );
                }}
            </Query>
        );
    }
}
export default 
    geolocated()(withRouter(GoogleApiWrapper({
        apiKey: 'AIzaSyDM9z1mv9d6Smdi3Z3vdDlUdabGYObzSvo'
    })(MapContainer)));