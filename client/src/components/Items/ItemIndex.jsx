import React from 'react';
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
import { Link } from "react-router-dom";
const { FETCH_ITEMS } = queries;

class ItemIndex extends React.Component {
    render() {
        return (
            <Query query={FETCH_ITEMS}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;
                    debugger
                    return (
                        <ul>
                            {data.items.map((item, idx) => (
                                <Link to={`/${item.id}`} key={`/${item.id}`} ><li key={item.id}>{item.name}: {item.description}</li></Link>
                            ))}
                        </ul>
                    );
                }}
            </Query>
        );
    }
}

export default ItemIndex;