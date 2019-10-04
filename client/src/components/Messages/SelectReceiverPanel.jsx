import Queries from '../../graphql/queries';
const { FETCH_USERS } = Queries;
import { Query } from 'react-apollo';
import React from 'react'

class SelectReceiverPanel extends React.Component {
    render() {
        return (
            <div>
                <ul>
                    {/* <Query query={FETCH_USERS}>
                        {({loading, error, data}) => {
                            return data.users.map({id, name, email} => {

                            })
                        }}
                    </Query> */}
                </ul>
                
            </div>
        )
    }
}
