import React, { Component } from 'react'
import { Query } from "react-apollo";
import queries from '../../graphql/queries';
const { FETCH_NOTIFICATIONS } = queries;

export default class UserNotifications extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Query query={FETCH_NOTIFICATIONS}>
                {({ loading, error, data }) => {
                    debugger
                    if (loading) return <p>Loading...</p>
                    if (error) return <p>{error.message}</p>
                    const notifications = data.notifications.filter(notification => notification.user.id === this.props.user.id);
                    if (notifications.length === 0) return <p>No notifications yet</p>
                    const notificationsLi = notifications.map(notification => {
                        if (notification.read) {
                            return <li key={notification.id} className="user-notification-li read">
                                <p>{notification.body}</p>
                            </li>
                        } else {
                            return <li key={notification.id} className="user-notification-li unread">
                                <p>{notification.body}</p>
                            </li>
                        }

                    })
                    return (
                        <ul>
                            {notificationsLi}
                        </ul>
                    )
                }}
            </Query>
        )
    }
}
