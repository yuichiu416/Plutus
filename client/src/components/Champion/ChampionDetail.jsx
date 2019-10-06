import React from 'react'
import { Image } from 'cloudinary-react';
import { Query } from 'react-apollo';
import Queries from '../../graphql/queries';
const { FETCH_CHAMPIONS } = Queries;

class ChampionDetail extends React.Component{
    render(){
        return (
            <Query query={FETCH_CHAMPIONS}>
                {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>
                    if (error) return <p>{error}</p>
                    if (data.champions.length === 0) return <p>No image yet.</p>
                    
                    return data.champions.map(champion => {
                            return (
                                <div>
                                    <h1>{champion.name}</h1>
                                    <Image cloudName='chinweenie' publicId={champion.publicId} />
                                </div>
                            )
                        })
                    }

                }
            </Query>
        )
    }
    
}

export default ChampionDetail;