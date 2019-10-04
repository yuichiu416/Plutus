import React from 'react';
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
const { FETCH_ITEMS } = queries;

class ItemShow extends React.Component {

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
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default ItemShow;