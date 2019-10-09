import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
import { withRouter } from 'react-router-dom';
import { geolocated } from "react-geolocated";
import { translate } from 'react-switch-lang';

const { FETCH_ITEMS } = queries;

export class MapContainer extends Component {
    displayMarkers(){
        return this.items.map((obj, index) => {
            return <Marker key={index} id={index} position={JSON.parse(obj.location)}
                onClick={() => this.props.history.push(`/items/${obj.id}`)}
                ></Marker>
        })
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
                    const coords = this.props.coords || { latitude: 38.9551308, longitude: -92.34679059999999 }
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