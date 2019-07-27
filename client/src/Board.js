import React, { Component } from 'react';

const URL_BASE = 'http://localhost:3000/';

class Board extends React.Component {
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
                isLoading: false
            }))
            .catch(console.error);
    }

    render() {
        if (this.state.isLoading) {
            return <h1>Loading...</h1>;
        } else {
            return(
                <div className="w-25 mx-auto card">
                    <div className="card-body">
                        <img className="w-50 mx-auto"
                             src={ this.state.hits.img }
                        >
                        </img>
                        <p>{ this.state.hits.name }</p>
                    </div>
                </div>

            );
        }

    }
}

class Card extends React.Component {

}

export default Board;
