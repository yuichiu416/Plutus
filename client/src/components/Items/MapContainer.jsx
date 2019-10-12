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
    componentDidMount(){
        this.setMapStyle();
        window.addEventListener('resize', () => {
            if(window.innerWidth > 800)
                document.getElementById("map").parentElement.style.gridRow = "6";
            else
                document.getElementById("map").parentElement.style.gridRow = "8";
        });
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

    setMapStyle() {
        const map = document.getElementById("map");
        if (!map)
            return;
        map.firstElementChild.style.width = "80%";
        map.firstElementChild.style.height = "50%";
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
                    const { t } = this.props
                    if(!coords){
                        coords = this.props.coords;
                        return <h1>{t("h1.noLocationInfomation")}</h1>
                    }
                    return (
                        <div id="map">
                            <Map
                                google={this.props.google}
                                zoom={12}
                                initialCenter={{ lat: coords.latitude, lng: coords.longitude }}
                            >
                                {this.displayMarkers()}
                            </Map>
                        </div>
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