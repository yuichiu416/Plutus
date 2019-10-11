import React from 'react';
import { Query } from "react-apollo";
import queries from "../../graphql/queries";
import { Link } from "react-router-dom";
import { Image } from 'cloudinary-react';

import { translate } from 'react-switch-lang';

const { FETCH_ITEMS } = queries;

class ItemIndex extends React.Component {
    render() {
        const { t } = this.props;
        return (
            <Query query={FETCH_ITEMS}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;
                    if(data.items.length === 0)
                        return <h1>No items yet, <Link to="items/new">Create new item</Link></h1>
                    
                    return (
                        <div className="index-body">
                            <Link className="index-create-link" to="items/new"> {t("button.createNewItem")}</Link>
                            
                            <div className="index-wrapper">
                                {/* <div> */}
                                    {data.items.map((item, idx) => (
<<<<<<< HEAD
                                        <div key={`/${item.id}`} >
                                            <Link to={`/items/${item.id}`}>
                                            <li className="item-preview">
                                            {item.champions[0] ? <Image className="item-preview-image" cloudName='chinweenie' publicId={item.champions[0]} /> : <h3>{t("h3.noImageProvided")}</h3>}
                                            <p>{item.name}</p><br />
                                            <p>${item.current_price}</p><br/>
=======
                                        // <div>
                                            <Link to={`/items/${item.id}`} key={`/${item.id}`} >
                                            
                                            <li key={item.id} className="item-preview">
                                            <div className="index-img">
                                            <Image className="item-preview-image" cloudName='chinweenie' publicId={item.champions[0]} />
                                            </div>
                                            <div className="index-info">
                                                    <p className="link-style">&nbsp; &nbsp; {item.name}</p>
                                                    <p className="link-style"> &nbsp; &nbsp; &nbsp; ${item.current_price}</p>
                                            </div>
>>>>>>> 0c9bd3b3855d05614546a974ebf78bc431d6760c
                                            </li></Link>
                                        // </div>
                                    ))}
                                {/* </div> */}
                            </div>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default translate(ItemIndex);