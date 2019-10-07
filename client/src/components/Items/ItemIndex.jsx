import React from 'react';
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
import { Link } from "react-router-dom";
const { FETCH_ITEMS } = queries;

class ItemIndex extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <Query query={FETCH_ITEMS}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;
                    if(data.items.length === 0)
                        return <h1>No items yet</h1>
                    return (
                        <ul>
                            {data.items.map((item, idx) => (
                                <Link to={`/items/${item.id}`} key={`/${item.id}`} ><li key={item.id}>{item.name}: {item.description}</li></Link>
                            ))}
                        </ul>
                    );
                }}
            </Query>
        );
    }
}

export default ItemIndex;