import React, { Component } from 'react'
import { Query } from "react-apollo";
import queries from '../../graphql/queries';
import { translate } from 'react-switch-lang';

const { FETCH_NOTIFICATIONS } = queries;

class UserNotification extends React.Component {
    constructor(props) {
        super(props);
        this.toggleRead = this.toggleRead.bind(this);
    }

    toggleRead(e){
        e.preventDefault();
        e.target.parentElement.classList.toggle("unread");
    }

    render() {

        return (
            <Query query={FETCH_NOTIFICATIONS}>
                {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>
                    if (error) return <p>{error.message}</p>
                    const distinctArray = [];
                    const notifications = data.notifications.filter(notification => notification.user === this.props.user.id);
                    const hashWithBody = {};
                    notifications.forEach(notification => hashWithBody[notification.id] = notification.body);
                    const uniqueNotifications = [];
                    Object.values(hashWithBody).forEach((notificationBody, i) => {
                        if (distinctArray.indexOf(notificationBody) < 0){
                            distinctArray.push(notificationBody);
                            uniqueNotifications.push(notifications[i]);
                        }
                    })
                    if (uniqueNotifications.length === 0) return <p>No notifications yet</p>
                    const notificationsLi = uniqueNotifications.map(notification => {
                        if (notification.read) {
                            return <li key={notification.id} className="user-notification-li">
                                <p>{notification.body}</p>
                            </li>
                        } else {
                            return <li key={notification.id} className="user-notification-li unread" onClick={this.toggleRead}>
                                <p>{notification.body}</p>
                            </li>
                        }

                    })
                    return (
                        <ul className="user-notifications-ul">
                            {notificationsLi}
                        </ul>
                    )
                }}
            </Query>
        )
    }
}

export default translate(UserNotification);