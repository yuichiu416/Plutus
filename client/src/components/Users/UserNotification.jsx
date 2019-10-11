import React, { Component } from 'react'
import { Query, withApollo } from "react-apollo";
import queries from '../../graphql/queries';
import { translate } from 'react-switch-lang';
import { UPDATE_NOTIFICATION_STATUS } from '../../graphql/mutations';

const { FETCH_NOTIFICATIONS } = queries;

class UserNotification extends Component {
    constructor(props) {
        super(props);
        this.toggleRead = this.toggleRead.bind(this);
    }

    toggleRead(e, id){
        e.preventDefault();
        e.target.parentElement.classList.toggle("unread");
        this.props.client.mutate({
            mutation: UPDATE_NOTIFICATION_STATUS,
            variables: { id: id}
        }).then(response => console.log(response));
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
                            return <li key={notification.id} className="user-notification-li unread" onClick={(e) => this.toggleRead(e, notification.id)}>
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

export default withApollo(translate(UserNotification));