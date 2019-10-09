import React, { Component } from "react";
import { Mutation } from "react-apollo";
import axios from 'axios';
import { CREATE_ITEM } from "../../graphql/mutations";
import { Query } from "react-apollo";
import Queries from "../../graphql/queries";
import { withRouter } from 'react-router-dom';
import { geolocated } from "react-geolocated";

const { FETCH_ITEMS, FETCH_CATEGORIES } = Queries;

class CreateItem extends Component {
    constructor(props) {
        super(props);
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
            endTime: new Date().getTime() + 180000
        };
        this.files = [];
        this.onDrop = this.onDrop.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setEndTime = this.setEndTime.bind(this);
    }

    onDrop(e) {
        e.preventDefault();
        const files = Array.from(e.target.files);
        for (let i = 0; i < files.length; i++) {
            this.files.push(files[i]);
        }
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
            let newItem = data.newItem;
            cache.writeQuery({
                query: FETCH_ITEMS,
                data: { items: itemArray.concat(newItem) }
            });
        }
    }
    
    fetchCategories(){
        return <Query query={FETCH_CATEGORIES}>
            {({ loading, error, data }) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;
                return (
                    <select className="category" onChange={this.update("category")} value={this.state.category || "default"}>
                    <option value="default" disabled>--Please Select--</option>
                        {data.categories.map((category) => (
                            <option value={category.id} key={category.id}>{category.name}</option>
                        ))}
                    </select>
                );
            }}
        </Query>
    }

    async updateImageURLs() {
        const publicIdsArray = [];

        for (let i = 0; i < this.files.length; i++) {
            const formData = new FormData();
            formData.append('file', this.files[i]);
            formData.append('upload_preset', 'ml_default');
            const champion = await axios.post(
                'https://api.cloudinary.com/v1_1/chinweenie/image/upload',
                formData
            )
            
            publicIdsArray.push(champion.data.public_id);
        }
        return publicIdsArray;
    }
    setEndTime(e) {
        const val = parseFloat(e.target.value);
        if (isNaN(val)) {
            return;
        }
        this.setState({ endTime: val * 60000 + new Date().getTime() });
    }

    handleSubmit(e, newItem) {
        e.preventDefault();
        const coords = this.props.coords;
        const location = JSON.stringify({
            lat: coords.latitude,
            lon: coords.longitude
        });
        this.updateImageURLs().then(champions => {
            
            newItem({
                variables: {
                    name: this.state.name,
                    description: this.state.description,
                    starting_price: parseFloat(this.state.starting_price),
                    minimum_price: parseFloat(this.state.minimum_price),
                    category: this.state.category,
                    sold: this.state.sold,
                    appraised: this.state.appraised,
                    location: location,
                    champions: champions
                }
            }).then(response => {
                this.setState({
                    message: "",
                    name: "",
                    description: "",
                    starting_price: 0,
                    minimum_price: 0,
                    category: "",
                    sold: false,
                    appraised: false,
                    champions: [],
                    endTime: 3
                });
                this.files = [];
                this.props.history.push(`/`);
            })
        })
    }
      
    render() {
        const categories = this.fetchCategories();
        return (
            <Mutation
                mutation={CREATE_ITEM}
                // if we error out we can set the message here
                onError={err => this.setState({ message: err.message })}
                // we need to make sure we update our cache once our new item is created
                update={(cache, data) => this.updateCache(cache, data)}
                // when our query is complete we'll display a success message
                onCompleted={data => {
                    const { name } = data.newItem;
                    this.setState({
                        message: `New item ${name} created successfully`
                    });
                }}
            >
                {(newItem) => {
                    return <body className="create-form-body">
                      
                        {/* <img src="watercolor.jpg" alt="watercolor" class="background-photo" /> */}
                        <div className="create-form">
                        <form onSubmit={e => this.handleSubmit(e, newItem)}>
                            <fieldset>
                            <input
                                type="name"
                                onChange={this.update("name")}
                                value={this.state.name}
                                placeholder="Item Name"
                                className="field1"
                            />
                            <textarea
                                onChange={this.update("description")}
                                value={this.state.description}
                                placeholder="Description"
                                className="field2"
                            />

                            <label className="top-label">
                                Starting Price:
                                <input
                                    type="number"
                                    className="field1"
                                    onChange={this.update("starting_price")}
                                    value={this.state.starting_price}
                                />
                            
                            </label>
                            <label className="top-label">
                                Minimum Price:
                                <input
                                    type="number"
                                    className="field1"
                                    onChange={this.update("minimum_price")}
                                    value={this.state.minimum_price}
                                    placeholder="Minimum Price"
                                />
                            </label>

                            <label className="top-label">
                                Category: 
                                {categories}
                            </label>
                            <br/>
                            <label className="top-label">
                                Upload Images: &nbsp;
                                    
                                <input type="file" multiple onChange={this.onDrop} />
                            </label>
                            <br/>
                            
                            {/* <label name="buttom-label">
                                Sold:
                                <input
                                    name="bottom-entry"
                                    onChange={this.update("sold")}
                                    value={this.state.sold}
                                    // placeholder="Sold"
                                />
                            </label> */}
                            <label className="buttom-label">
                                Appraised: &nbsp;
                                <input
                                    type="text"
                                    className="bottom-entry"
                                    onChange={this.update("appraised")}
                                    value={this.state.appraised}
                                />
                            </label>
                            
                            <label className="bottom-label">
                                End in &nbsp;
                                <input type="text" className="bottom-entry" onChange={this.setEndTime}/>
                                &nbsp; minutes
                            </label>
                            
                            
                            </fieldset>
                            <button type="submit">Create Item</button>
                        </form>
                        <p>{this.state.message}</p>
                    </div>
                    </body>
                }}
            </Mutation>
        );
    }
}

export default geolocated()(withRouter(CreateItem));