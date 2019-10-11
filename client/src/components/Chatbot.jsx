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
            message: "",
            waitingForAnswer: false,
            chatHistory: []
        };
        this.state = this.defaultState;
        this.nameHashes = {};
        this.ids = {};
        this.selectLanguageByInput = this.selectLanguageByInput.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.updateMsg = this.updateMsg.bind(this);
        this.handleGreetingText = this.handleGreetingText.bind(this);
        this.openForm = this.openForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.handleOption1 = this.handleOption1.bind(this);
    }

    updateMsg(e){
        const val = e.target.value;
        if(this.state.waitingForAnswer)
            this.setState({ message: val })
        else
            this.setState({ message: val, option: val })
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
        this.state.chatHistory.push(questionText);
    }
    selectLanguageByInput(input){
        switch(input){
            case "Chinese":
                setLanguage("zh");
                break;
            case "English":
                setLanguage("en");
                break;
            default:
                break;
        }
    }

    handleSwitchLanguageText(){
        const { t } = this.props;
        this.state.chatHistory.push(t("p.option.language") + this.state.message);
    }

    handleOption1() {
        this.setState({waitingForAnswer: false});
        const { t } = this.props
        let results = "The items based on your input are:\n";
        const matches = this.matches();
        if(matches.length === 0)
            return this.state.chatHistory.push(t("text.noResultsFound"));
        matches.forEach((title, idx) => results += (idx + 1) + ". " + title + " ");
        this.state.chatHistory.push(results);
    }

    submitForm(e){
        e.preventDefault();
        // setTimeout(() => {   // set a thinking time of the chatbog
        const val = this.state.message;
        this.state.chatHistory.push(val);
            switch (this.state.option) {
                case "1":
                    if(this.state.waitingForAnswer){
                        this.handleOption1();
                        this.setState({ option: "", message: "" });
                    } else{
                        this.handleGreetingText();
                        this.setState({waitingForAnswer: true});
                    }
                    break;
                case "2":
                    if (this.state.waitingForAnswer) {
                        this.handleSwitchLanguageText();
                        this.selectLanguageByInput(this.state.message);
                        this.setState({option: "", message: ""});
                    } else {
                        this.handleGreetingText();
                        this.setState({ waitingForAnswer: true });
                    }
                    break;
                default:
                    this.setState(this.defaultState);
                    document.getElementById("search-results").classList.add("hidden");
                    this.handleGreetingText();
                    break;
            }

        document.getElementById("message").value = "";
        // }, 1000);
    }
    matches() {
        const matches = [];
        if (this.state.message.length === 0)
            return [];
        const input = this.state.message.replace(/\s/g, '').toLowerCase();
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
    openForm() {
        const { t } = this.props;
        document.getElementById("chatbot").classList.remove("hidden");
        document.getElementById("open-chat-btn").classList.add("hidden");
        const histroy = this.state.chatHistory;
        if(histroy.length % 2 === 0){   
            this.state.chatHistory.push(t("p.option.greeting") + " " + t("p.option.empty"));
            this.setState({chatHistory: this.state.chatHistory});
        }
    }

    closeForm() {
        document.getElementById("open-chat-btn").classList.remove("hidden");
        document.getElementById("chatbot").classList.add("hidden");
        this.setState({ option: "", message: ""});
    }
    
    render() {
        const { t } = this.props;
        let searchResults = this.matches().map((result, i) => {
            const id = this.ids[result];
            return <li key={i} onClick={this.selectName} className={i === this.state.index ? "search-selected" : ""}><Link to={`/items/${id}`} id={`match-${i}`}>{result}</Link></li>
        });
        searchResults = <ul className="search-ul hidden" id="search-results">{searchResults}</ul>
        const histroy = this.state.chatHistory.map((msg, idx) => {
            if(msg === "")
                return null;
            else if(idx % 2 === 0)
                return <li key={idx} className="from-bot"><p>{msg}</p></li>
            else
                return <li key={idx} className="from-user"><p>{msg}</p></li>

        })
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
                        <div className="chat-popup">
                            <button className="open-button" id="open-chat-btn" onClick={this.openForm}>{t("button.chat")}</button>
                            <form onSubmit={this.submitForm} action="/action_page.php" id="chatbot" className="form-container hidden">
                            <ul className="chat-histroy">{histroy}</ul>
                            <input type="text" className="message-input" id="message" placeholder={t("label.message")} onChange={this.updateMsg}/>
                                <button type="submit" className="btn" id="submit" value="Send"><span>{t("button.send")}</span></button>
                                <button type="button" className="btn cancel" onClick={this.closeForm}><span>{t("button.close")}</span></button>
                            </form>
                            <div>
                                {searchResults}
                            </div>
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