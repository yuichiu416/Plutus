import React from 'react'
import { Link } from 'react-router-dom';
import { Query } from "react-apollo";
import queries from "../graphql/queries";
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
    setTranslations,
    setDefaultLanguage,
    setLanguageCookie,
    setLanguage,
    translate,
} from 'react-switch-lang';

import en from '../translations/en.json';
import zh from '../translations/zh.json';

setTranslations({ en, zh });
setDefaultLanguage('en');
setLanguageCookie();

const { FETCH_ITEMS } = queries;

class Chatbot extends React.Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            option: "",
            questionText: "",
            answer: "",
            waitingForAnswer: false,
            language: "en",
        };
        this.state = this.defaultState;
        this.nameHashes = {};
        this.ids = {};
        this.handleFirstOption = this.handleFirstOption.bind(this);
        this.selectLanguageByInput = this.selectLanguageByInput.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.update = this.update.bind(this);
        this.handleGreetingText = this.handleGreetingText.bind(this);

    }
    componentDidMount(){
        this.handleGreetingText();
    }
    update(field){
        return e => this.setState({[field]: e.target.value});
    }
    handleGreetingText(){
        let questionText;
        const { t } = this.props;
        switch (this.state.option) {
            case "":
                questionText = t("p.option.empty");
                break;
            case "1":
                questionText = t("p.option.first");
                break;
            case "2":
                questionText = t("p.option.second");
                break;
            default:
                questionText = t("p.option.default");
                break;
        }
        this.setState({ questionText: questionText});
    }
    async handleFirstOption() {
        if(this.state.waitingForAnswer){
            await this.setState({waitingForAnswer: false, option: ""});
            this.handleGreetingText();
            document.getElementById("search-results").classList.toggle("hidden");
        }
        this.setState({ waitingForAnswer: true })
    }
    async handleSecondOption() {
        if (this.state.waitingForAnswer) {
            await this.setState({ waitingForAnswer: false, option: "" });
            this.handleGreetingText();
        }
        this.setState({ waitingForAnswer: true })
    }
    selectLanguageByInput(input){
        console.log(input);
        switch(input){
            case "Chinese":
                setLanguage("zh");
                console.log("change to Chinese");
                break;
            case "English":
                console.log("change to english");
                setLanguage("en");
                break;
            default:
                break;
        }
    }
    toggleInputFields(){
        document.getElementById("option").classList.toggle("hidden");
        document.getElementById("answer").classList.toggle("hidden");
    }
    handleSwitchLanguageText(){
        const { t } = this.props;
        this.setState({ questionText: t("p.option.language") });
    }
    submitForm(e){
        e.preventDefault();
        // setTimeout(() => {   // set a thinking time of the chatbog
            switch (this.state.option) {
                case "1":
                    this.handleGreetingText();
                    this.handleFirstOption();
                    this.toggleInputFields();
                    break;
                case "2":
                    this.handleSwitchLanguageText();
                    this.handleSecondOption();
                    this.toggleInputFields();
                    this.selectLanguageByInput(this.state.answer);
                    this.handleSwitchLanguageText(); // after we changed the input, need to change the language
                    break;
                default:
                    this.setState(this.defaultState);
                    document.getElementById("search-results").classList.add("hidden");
                    document.getElementById("option").classList.remove("hidden");
                    document.getElementById("answer").classList.add("hidden");
                    document.getElementById("option").value = "";
                    document.getElementById("answer").value = "";
                    this.handleGreetingText();
                    break;
            }
            document.getElementById("option").value = "";
            document.getElementById("answer").value = "";
        // }, 1000);
    }
    matches() {
        const matches = [];
        if (this.state.answer.length === 0)
            return [];
        const input = this.state.answer.replace(/\s/g, '').toLowerCase();
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
    render() {
        const { t } = this.props;
        let searchResults = this.matches().map((result, i) => {
            const id = this.ids[result];
            return <li key={i} onClick={this.selectName} className={i === this.state.index ? "search-selected" : ""}><Link to={`/items/${id}`} id={`match-${i}`}>{result}</Link></li>
        });
        searchResults = <ul className="search-ul hidden" id="search-results">{searchResults}</ul>
        return (
            <Query query={FETCH_ITEMS}>
                {({ loading, error, data }) => {
                    if (loading) return t("p.loading");
                    if (error) return `Error! ${error.message}`;
                    if (data.items.length === 0)
                        return <h1>No items yet</h1>
                    data.items.forEach(item => {
                        this.nameHashes[item.name] = JSON.parse(item.nameHash);
                        this.ids[item.name] = item.id;
                    })
                    return (
                        <div id="chatbot">
                            <label>
                                {this.state.questionText}
                                <form onSubmit={this.submitForm}>
                                    <input type="text" id="option" placeholder="option" onChange={this.update("option")} />
                                    <input type="text" id="answer" placeholder="answer" onChange={this.update("answer")} className="hidden" />
                                    <input type="submit" id="submit" value="Send" />
                                </form>
                                <div>
                                    {searchResults}
                                </div>
                            </label>
                        </div>
                    );
                }}
            </Query>
        )
    }
}


Chatbot.propTypes = {
    t: PropTypes.func.isRequired,
};
export default translate(withRouter(Chatbot));