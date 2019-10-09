import React from 'react'
import { Link } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import { Query } from "react-apollo";
import queries from "../graphql/queries";
import { withRouter } from 'react-router-dom';
import { translate } from 'react-switch-lang';


const { FETCH_ITEMS } = queries;

class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputVal: "",
            index: 0,
        };
        this.update = this.update.bind(this);
        this.handleBoldText = this.handleBoldText.bind(this);
        this.nameHashes = {};
        this.ids = {};
    }
    update(event) {
        event.preventDefault();
        this.setState({
            inputVal: event.currentTarget.value.toLowerCase(),
        });
    }

    matches() {
        const matches = [];
        if (this.state.inputVal.length === 0)
            return [];
        const input = this.state.inputVal.replace(/\s/g, '').toLowerCase();
        if (input === "*all*") {
            return Object.keys(this.nameHashes);
        }
        Object.keys(this.nameHashes).forEach(name => {
            for (let i = 0; i < input.length; i++) {
                if (!this.nameHashes[name][input[i]])
                    return [];
            }
            matches.push(name);
        });
        return matches;
    }

    handleBoldText(str) {
        const handled = [];
        const input = this.state.inputVal;
        if (input === "*all*")
            return str;
        for (let i = 0; i < str.length; i++) {
            if (this.state.inputVal.toLowerCase().includes(str[i].toLowerCase()))
                handled.push(`<strong>${str[i]}</strong>`);
            else
                handled.push(str[i]);
        }
        return ReactHtmlParser(handled.join(""));
    }

    render() {
        const { t } = this.props;
        let searchResults = this.matches().map((result, i) => {
            const handledResult = this.handleBoldText(result);
            const id = this.ids[result];
            return <li key={i} onClick={this.selectName} className={i === this.state.index ? "search-selected" : ""}><Link to={`/items/${id}`} id={`match-${i}`}>{handledResult}</Link></li>
        });
        searchResults = <ul className="search-ul">{searchResults}</ul>
        return (
            <Query query={FETCH_ITEMS}>
                {({ loading, error, data }) => {
                    if (loading) return t("p.loading");
                    if (error) return `Error! ${error.message}`;
                    if (data.items.length === 0)
                        return t("h1.noItems")
                    data.items.forEach(item => {
                        this.nameHashes[item.name] = JSON.parse(item.nameHash);
                        this.ids[item.name] = item.id;
                    })
                    return (
                        <div class="search-div" >
                            <form className="search-form" id="search-form">
                                <input className="search-input search-dropdown" id="searchBar" type="text" onChange={this.update} placeholder={t("input.searchForItems")}  value={this.state.inputVal} />
                                {searchResults}
                            </form>
                        </div>
                    );
                }}
            </Query>
        )
    }
}


export default translate(withRouter(SearchForm));