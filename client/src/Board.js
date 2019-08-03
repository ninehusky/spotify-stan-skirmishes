import React, { Component } from 'react';

const URL_BASE = 'http://localhost:3000/';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hits: null,
            isLoading: true,
        };
    }
    
    componentDidMount() {
        fetch(URL_BASE + 'getartist?artist=kanye')
            .then(response => response.json())
            .then(data => this.setState({
                hits: data,
                isLoading: false,
                hidden: true, // we finna use this later
            }))
            .catch(console.error);
    }

    render() {
        if (this.state.isLoading) {
            return <h1>Loading...</h1>;
        } else {
            return(
                <Card artistData={ this.state.hits }/>
            );
        }
    }
}

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.artistData,
        }
    }

    render() {
        return(
            <div className="w-25 mx-auto card">
                <div className="card-body">
                    <img className="w-50 mx-auto"
                         src={ this.state.data.img }
                    >
                    </img>
                    <p>{ this.state.data.name }</p>
                    <div className="container">
                        <p>Is this it?</p>
                        <button className="btn btn-primary">Yes</button>
                        <button className="btn btn-secondary">Nope</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Board;
