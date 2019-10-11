import React, { Component } from 'react'
import { Mutation } from "react-apollo";
import { UPDATE_ITEM } from "../../graphql/mutations";
import { withRouter } from 'react-router-dom';
import { translate } from 'react-switch-lang';
import Queries from "../../graphql/queries";

const { FETCH_ITEMS } = Queries;

class EditForm extends Component {
    constructor(props){
        super(props);
        this.state = props.item;
        this.updateCache = this.updateCache.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    update(field) {
        return e => this.setState({ [field]: e.target.value });
        // this.setState({ category: e.target.options[e.target.selectedIndex].value })
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
            let item = data.updateItem;
            itemArray.find((obj, idx) => (obj.id === this.state.id ? itemArray[idx] = item : ""));
            cache.writeQuery({
                query: FETCH_ITEMS,
                data: { items: itemArray }
            });
        }
    }
    handleSubmit(e, updateItem) {
        e.preventDefault();
        updateItem({
            variables: {
                id: this.state.id,
                name: this.state.name,
                description: this.state.description,
                minimum_price: this.state.minimum_price,
                category: this.state.category.id,
                sold: this.state.sold,
                appraised: this.state.appraised,
                champions: this.state.champions,
            }
        }).then(response => {
            this.setState(response.data.updateItem);
            this.props.history.push(`/items/${this.state.id}`);
        });
    }
    render() {
        const { t, categories } = this.props;
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
                {(updateItem) => (
                    <div className="create-form-body">
                        {/* <img src="watercolor.jpg" alt="watercolor" class="background-photo" /> */}
                        <div className="create-form">
                            <form onSubmit={e => this.handleSubmit(e, updateItem)}>
                                <fieldset>
                                    <input
                                        type="name"
                                        onChange={this.update("name")}
                                        value={this.state.name}
                                        placeholder={t("input.itemName")}
                                        className="field1"
                                    />
                                    <textarea
                                        onChange={this.update("description")}
                                        value={this.state.description}
                                        placeholder={t("input.description")}
                                        className="field2"
                                    />

                                    <label className="top-label">
                                        {t("label.startingPrice")}
                                        <input
                                            type="number"
                                            className="field1"
                                            onChange={this.update("starting_price")}
                                            value={this.state.starting_price}
                                        />
                                    </label>
                                    <label className="top-label">
                                        {t("label.minimumPrice")}
                                        <input
                                            type="number"
                                            className="field1"
                                            onChange={this.update("minimum_price")}
                                            value={this.state.minimum_price}
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
                                        value={this.state.sold}
                                        // placeholder="Sold"
                                    />
                                </label> */}
                                    <label className="buttom-label">
                                        {t("label.appraised")} &nbsp;
                                    <input
                                            type="text"
                                            className="bottom-entry"
                                            onChange={this.update("appraised")}
                                            value={this.state.appraised}
                                        />
                                    </label>
                                </fieldset>
                                <button type="submit">{t("button.updateItem")}</button>
                            </form>
                            <p>{this.state.message}</p>
                        </div>
                    </div>
                )}
            </Mutation>
        )
    }
}

export default withRouter(translate(EditForm));