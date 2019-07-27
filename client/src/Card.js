import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const URL_BASE = 'http://localhost:3000';

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        };
    }

   componentDidMount() {
        fetch(URL_BASE + '?getartist&artist=kanye')
            .then(response => response.json())
            .then(data => this.setState({ artist: data }))
            .catch(console.error);

    } 

    render() {
        return(
            <div className="card">
                <div className="card-body">
                    ayoooooo
                </div>
            </div>
        );
    }
}

export default Card;
