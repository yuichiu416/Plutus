import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { UPDATE_ITEM } from "../../graphql/mutations";
import { Query } from "react-apollo";
import { withRouter } from 'react-router-dom';
import Queries from "../../graphql/queries";
import { translate } from 'react-switch-lang';


const { FETCH_ITEMS, FETCH_CATEGORIES } = Queries;

class EditItem extends Component {
    constructor(props) {
        super(props);
        this.id = this.props.match.params.id;
        this.state = {
            message: "",
        };
        this.updateCache = this.updateCache.bind(this);
    }
    setDefaultItemState(){
        return 
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
    render() {
        const categories = this.fetchCategories();
        const setDefaultItem = this.setDefaultItemState();
        const { t } = this.props;
        return (
            <Query query={FETCH_ITEMS}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;
                    const item = data.items.find(obj => obj.id === this.id);
                    if (item)
                        this.item = item;
                    console.log(item);
                    return <Mutation
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
                        {(updateItem) => (
                            <div className="create-form-body">
                                {setDefaultItem}
                                {/* <img src="watercolor.jpg" alt="watercolor" class="background-photo" /> */}
                                <div className="create-form">
                                    <form onSubmit={e => this.handleSubmit(e, updateItem)}>
                                        <fieldset>
                                            <input
                                                type="name"
                                                onChange={this.update("name")}
                                                value={this.item.name}
                                                placeholder={t("input.itemName")}
                                                className="field1"
                                            />
                                            <textarea
                                                onChange={this.update("description")}
                                                value={this.item.description}
                                                placeholder={t("input.description")}
                                                className="field2"
                                            />

                                            <label className="top-label">
                                                {t("label.startingPrice")}
                                                <input
                                                    type="number"
                                                    className="field1"
                                                    onChange={this.update("starting_price")}
                                                    value={this.item.starting_price}
                                                />
                                            </label>
                                            <label className="top-label">
                                                {t("label.minimumPrice")}
                                                <input
                                                    type="number"
                                                    className="field1"
                                                    onChange={this.update("minimum_price")}
                                                    value={this.item.minimum_price}
                                                />
                                            </label>
                                            <label className="top-label">
                                                {t("label.category")}
                                                {categories}
                                            </label>
                                            <br />
                                            <label className="top-label">
                                                {t("input.uploadImages")} &nbsp;
                                    <input type="file" multiple onChange={this.onDrop} />
                                            </label>
                                            <br />

                                            {/* <label name="buttom-label">
                                    Sold:
                                    <input
                                        name="bottom-entry"
                                        onChange={this.update("sold")}
                                        value={this.item.sold}
                                        // placeholder="Sold"
                                    />
                                </label> */}
                                            <label className="buttom-label">
                                                {t("label.appraised")} &nbsp;
                                    <input
                                                    type="text"
                                                    className="bottom-entry"
                                                    onChange={this.update("appraised")}
                                                    value={this.item.appraised}
                                                />
                                            </label>
                                            <label className="bottom-label">
                                                {t("label.endIn")} &nbsp;
                                    <input type="text" className="bottom-entry" onChange={this.setEndTime} />
                                                &nbsp; {t("label.minutes")}
                                            </label>
                                        </fieldset>
                                        <button type="submit">{t("button.updateItem")}</button>
                                    </form>
                                    <p>{this.state.message}</p>
                                </div>
                            </div>
                        )}
                    </Mutation>
                }}
            </Query>

            
        );
    }
}

export default translate(withRouter(EditItem));