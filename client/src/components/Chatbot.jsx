import React from 'react'
import { Link } from 'react-router-dom';
import { Query } from "react-apollo";
import queries from "../graphql/queries";
import { withRouter } from 'react-router-dom';


const { FETCH_ITEMS } = queries;

class Chatbot extends React.Component {
    constructor(props) {
        super(props);
        this.defaultState = {
            option: "",
            questionText: "",
            answer: "",
            waitingForAnswer: false
        };
        this.state = this.defaultState;
        this.nameHashes = {};
        this.ids = {};
        this.handleFirstOption = this.handleFirstOption.bind(this);
        this.handleSecionOption = this.handleSecionOption.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.update = this.update.bind(this);
        this.handleQreetingText = this.handleQreetingText.bind(this);
    }
    componentDidMount(){
        this.handleQreetingText();
    }
    update(field){
        return e => this.setState({[field]: e.target.value});
    }
    handleQreetingText(){
        let questionText;
        switch (this.state.option) {
            case "":
                questionText = "Greetings! How can I help you?\n" + "Type 1 to search an item\n" + "Type 2 to exit\n";
                break;
            case "1":
                questionText = "Please input the item name or some of the characters to search.";
                break;
            case "2":
                questionText = "Thanks for using our app. If you need anything, let me know.";
                break;
            default:
                questionText = "Unknown option, please select again."
                break;
        }
        this.setState({ questionText: questionText});
    }
    async handleFirstOption() {
        if(this.state.waitingForAnswer){
            await this.setState({waitingForAnswer: false, option: ""});
            this.handleQreetingText();
            document.getElementById("search-results").classList.toggle("hidden");
        }
        this.setState({ waitingForAnswer: true })
    }
    handleSecionOption(){
        alert("We are Plutus, thanks for using our app");
    }
    toggleInputFields(){
        document.getElementById("option").classList.toggle("hidden");
        document.getElementById("answer").classList.toggle("hidden");
    }
    submitForm(e){
        e.preventDefault();
        setTimeout(() => {
            switch (this.state.option) {
                case "1":
                    this.handleQreetingText();
                    this.handleFirstOption();
                    this.toggleInputFields();
                    break;
                case "2":
                    this.handleSecionOption();
                    break;
                default:
                    this.setState(this.defaultState);
                    document.getElementById("search-results").classList.add("hidden");
                    document.getElementById("option").classList.remove("hidden");
                    document.getElementById("answer").classList.add("hidden");
                    document.getElementById("option").value = "";
                    document.getElementById("answer").value = "";
                    this.handleQreetingText();
                    break;
            }
            document.getElementById("option").value = "";
            document.getElementById("answer").value = "";
        }, 1000);
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
        let searchResults = this.matches().map((result, i) => {
            const id = this.ids[result];
            return <li key={i} onClick={this.selectName} className={i === this.state.index ? "search-selected" : ""}><Link to={`/items/${id}`} id={`match-${i}`}>{result}</Link></li>
        });
        searchResults = <ul className="search-ul hidden" id="search-results">{searchResults}</ul>
        return (
            <Query query={FETCH_ITEMS}>
                {({ loading, error, data }) => {
                    if (loading) return "Loading...";
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


export default withRouter(Chatbot);