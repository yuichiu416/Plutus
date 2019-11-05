import React, { Component } from 'react'
import { Query } from "react-apollo";
import queries from '../../graphql/queries';
import { Link } from 'react-router-dom';
import { translate } from 'react-switch-lang';

const { FETCH_MESSAGES } = queries;

class UserMessages extends Component {
    // constructor(props) {
    //     super(props)
    // }
    
    render() {
        const { t } = this.props;
        return (
            <Query query={FETCH_MESSAGES}>
                {({loading, error, data}) => {
                    if (loading) return <p>Loading...</p>
                    if (error) return <p>{error.message}</p>
                    const messages = data.messages.filter(message => message.receiver.id === this.props.user.id || message.sender.id === this.props.user.id);
                    const messagesLi = messages.map(message => {
                        return (
                            <div className="message-seller" key={message.id} >
                            <Link to={`/messages/${message.id}`}>
                                <li>
                                <h3>{message.title}</h3>
                                <p>{message.replies.length} {t("p.replies")}</p>
                                </li>
                            </Link>
                            </div>
                        )
                    })
                    return (
                        <div>
                            <ul className="user-messages-ul list-group">
                                {messagesLi}
                            </ul>
                        </div>
                    )
                }}
            </Query>
        )
    }
}

export default translate(UserMessages);