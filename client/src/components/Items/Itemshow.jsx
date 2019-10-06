import React from 'react';
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

const { FETCH_ITEMS } = queries;

class ItemShow extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <Query query={FETCH_ITEMS}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;
                    const item = data.items.find(obj => obj.id === this.props.match.params.id);
                    return (
                        <div>
                            <h1>The item name is: {item.name}</h1>
                            <p>{item.description}</p>
                            <Link to={`${this.props.match.params.id}/edit`} > Edit Item</Link>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default withRouter(ItemShow);