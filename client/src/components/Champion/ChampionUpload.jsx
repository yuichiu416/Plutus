import React, { Component } from 'react'
import axios from 'axios';
import { Mutation } from "react-apollo";
import { CREATE_CHAMPION } from '../../graphql/mutations';

class ChampionUpload extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: '',
            message: ''
        }
        this.files = [];
        this.onDrop = this.onDrop.bind(this);
        this.update = this.update.bind(this);
    }

    handleSubmit(e, createChampion){
        e.preventDefault();
        const { name } = this.state;
        for (let i = 0; i < this.files.length; i++){
            const formData = new FormData();
            formData.append('file', this.files[i]);
            formData.append('name', name);
            formData.append('upload_preset', 'ml_default');
            axios.post(
                'https://api.cloudinary.com/v1_1/chinweenie/image/upload',
                formData
            ).then(response => {
                return createChampion({
                    variables: {
                        name,
                        publicId: response.data.public_id
                    }
                }).then(champion => {

                })
            });
        }
        
    }

    onDrop(e){
        e.preventDefault();
        const files = Array.from(e.target.files);
        for (let i = 0; i < files.length; i++){
            this.files.push(files[i]);
        }
    }

    update(e){
        e.preventDefault();
        this.setState({name: e.target.value});
    }
    
    render() {
      
        return (
            <Mutation
                mutation={CREATE_CHAMPION}
                onError={err => this.setState({ message: err.message })}
            >
                {createChampion => (
                    <form onSubmit={(e) => this.handleSubmit(e, createChampion)}>
                        <div>
                            <input
                                type="text"
                                placeholder="Name"
                                value={this.state.name}
                                onChange={this.update} />

                            <input type="file" multiple onChange={this.onDrop}/>
                            <button>Submit</button>
                        </div>
                    </form>
                )}
            </Mutation>
            
        )
    }
}
export default ChampionUpload;