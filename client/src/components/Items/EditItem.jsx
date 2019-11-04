import React, { Component } from "react";
import { Query } from "react-apollo";
import { withRouter } from 'react-router-dom';
import Queries from "../../graphql/queries";
import EditForm from './EditForm';


const { FETCH_ITEMS, FETCH_CATEGORIES } = Queries;

class EditItem extends Component {
    constructor(props) {
        super(props);
        this.id = this.props.match.params.id;
        this.state = {
            message: "",
            name: "",
            description: "",
            starting_price: "",
            minimum_price: "",
            category: "",
            sold: false,
            appraised: false,
            champions: [],
            endTime: new Date().getTime() + 180000
        };
    }
  
    update(field) {
        return e => this.setState({ [field]: e.target.value });
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

    render() {
        const categories = this.fetchCategories();
        return <Query query={FETCH_ITEMS}>
            {({ loading, error, data }) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;
                const item = data.items.find(obj => obj.id === this.id);
                return <EditForm item={item} categories={categories}/>
            }}
        </Query>

    }
}

export default withRouter(EditItem);