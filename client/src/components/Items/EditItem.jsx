import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { UPDATE_ITEM } from "../../graphql/mutations";
import { Query } from "react-apollo";
import { withRouter } from 'react-router-dom';
import Queries from "../../graphql/queries";

const { FETCH_ITEMS, FETCH_ITEM, FETCH_CATEGORIES } = Queries;

class EditItem extends Component {
    constructor(props) {
        super(props);
        this.id = this.props.match.params.id;
        this.state = {
            message: "",
            name: "",
            description: "",
            starting_price: 0,
            minimum_price: 0,
            category: "",
            sold: false,
            appraised: false,
            champions: [],
            location: [],
            endTime: 3
        };
        this.itemDetails = this.setDefaultItemState();
        this.mapItemToState = this.mapItemToState.bind(this);
        this.updateCache = this.updateCache.bind(this);
        this.setEndTime = this.setEndTime.bind(this);
    }
    mapItemToState(item){
        this.setState({
            id: this.id,
            name: item.name,
            description: item.description,
            starting_price: item.starting_price,
            minimum_price: item.minimum_price,
            category: item.category.id,
            sold: item.sold,
            appraised: item.appraised,
            champions: item.champions,
            location: item.location,
            endTime: item.endTime
        });
    }
    setDefaultItemState(){
        return <Query query={FETCH_ITEMS}>
            {({ loading, error, data }) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;
                const item = data.items.find(obj => obj.id === this.id);
                if(item)
                    this.mapItemToState(item);
                return null;
            }}
        </Query>
    }

    update(field) {
        return e => this.setState({ [field]: e.target.value });
        // this.setState({ category: e.target.options[e.target.selectedIndex].value })
    }

    // we need to remember to update our cache directly with our new item
    updateCache(cache, { data }) {
        let items;
        try {
            items = cache.readQuery({ query: FETCH_ITEMS });
        } catch (err) {
            return;
        }
        if (items) {
            let itemArray = items.items;
            let item = data.updateItem;
            itemArray.find((obj, idx) => (obj.id === this.id ? itemArray[idx] = item : ""));
            cache.writeQuery({
                query: FETCH_ITEMS,
                data: { items: itemArray }
            });
        }
    }
    updateLocation(){
        return e => console.log("current location");
    }
    fetchCategories(){
        return <Query query={FETCH_CATEGORIES}>
            {({ loading, error, data }) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;
                return (
                    <select onChange={this.update("category")} value={this.state.category}>
                        {data.categories.map((category) => (
                            <option value={category.id} key={category.id}>
                            {category.name}
                            </option>
                        ))}
                    </select>
                );
            }}
        </Query>
    }
    handleSubmit(e, updateItem) {
        e.preventDefault();
        updateItem({
            variables: {
                id: this.id,
                message: this.state.message,
                name: this.state.name,
                description: this.state.description,
                starting_price: this.state.starting_price,
                minimum_price: this.state.minimum_price,
                category: this.state.category,
                sold: this.state.sold,
                appraised: this.state.appraised,
                champions: this.state.champions,
                location: this.state.location,
                endTime: this.state.endTime
            }
        }).then( response => {
            this.mapItemToState(response.data.updateItem);
            this.props.history.push(`/items/${this.id}`);
        }).catch(err => console.log(err));
    }
    setEndTime(e) {
        const val = parseFloat(e.target.value);
        if (isNaN(val))
            return;
        this.setState({ endTime: val * 60000 + new Date().getTime() })
    }
    displayEndTime(time){
        return (time - new Date().getTime()) / 60000;
    }
    render() {
        const categories = this.fetchCategories();
        return (
            <Mutation
                mutation={UPDATE_ITEM}
                // if we error out we can set the message here
                onError={err => this.setState({ message: err.message })}
                // we need to make sure we update our cache once our new item is created
                update={(cache, data) => this.updateCache(cache, data)}
                // when our query is complete we'll display a success message
                onCompleted={data => {
                    const { name } = data.updateItem;
                    this.setState({
                        message: `Item ${name} updated successfully`
                    });
                }}
            >
                {(updateItem, { data }) => (
                    <div>
                        {this.itemDetails}
                        <form onSubmit={e => this.handleSubmit(e, updateItem)}>
                            <input
                                onChange={this.update("name")}
                                value={this.state.name}
                                placeholder="Name"
                            />
                            <textarea
                                onChange={this.update("description")}
                                value={this.state.description}
                                placeholder="description"
                            />
                            {/* <input
                                onChange={this.updateImageURLs()}
                                value={this.state.champions}
                                placeholder="Upload image urls"
                            /> */}
                            <label>
                                Starting Price: 
                                <input
                                    onChange={this.update("starting_price")}
                                    value={this.state.starting_price}
                                    type="number"
                                />
                            </label>
                            <label>
                                Minimum Price:
                                <input
                                    onChange={this.update("minimum_price")}
                                    value={this.state.minimum_price}
                                    placeholder="Minimum Price"
                                    type="number"
                                />
                            </label>
                            {/* <input
                                onChange={this.updateLocation("location")}
                                value={this.state.location}
                                placeholder="Location"
                            /> */}
                            
                            <label>
                                Sold:
                                <input
                                    onChange={this.update("sold")}
                                    value={this.state.sold}
                                    placeholder="Sold"
                                />
                            </label>
                            <label>
                                Appraised: 
                                <input
                                    onChange={this.update("appraised")}
                                    value={this.state.appraised}
                                />
                            </label>
                            <br/>
                            <label>
                                End in
                                <input type="text" onChange={this.setEndTime}/>
                                minutes
                            </label>
                            <br/>
                            <label>
                                Category:
                                {categories}
                            </label>
                            <button type="submit">Update Item</button>
                        </form>
                        <p>{this.state.message}</p>
                    </div>
                )}
            </Mutation>
        );
    }
}

export default withRouter(EditItem);