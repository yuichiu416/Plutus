import React, { Component } from 'react'
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import queries from "../../graphql/queries";
import { translate } from 'react-switch-lang';

const { FETCH_MESSAGES } = queries;

class MessagesIndex extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        const { t } = this.props;
        return (
            <Query query={FETCH_MESSAGES}>
                {({loading, error, data}) => {
                    if (loading) return <p>{t("p.loading")}</p>
                    if (error) return <p>{error}</p>
                    const messages = data.messages.map(message => {
                        return (
                            <Link to={`/messages/${message.id}`} key={message.id}>
                                <li >
                                    <h3>{message.title}</h3>
                                    <p>{t("p.sentBy")} {message.sender.name}</p>
                                    <p>{message.replies.length} {t("p.replies")}</p>
                                </li>
                            </Link>
                        )
                    })

                    return (
                        <ul>
                            {messages}
                        </ul>
                    )
                }}
            </Query>
        )
    }
}

export default translate(MessagesIndex);

