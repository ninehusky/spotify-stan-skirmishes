import React, { Component } from 'react';

const URL_BASE = 'http://localhost:3000/';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artistData: null,
            isLoading: true,
            choiceMade: false,
        };
    }
    
    artistSearch = (artist) => {
        // probably should scan to see if string is empty
        fetch(URL_BASE + 'getartist?artist=' + artist)
            .then(response => response.json())
            .then(data => this.setState({
                artistData: data,
                isLoading: false,
            }))
            .catch(console.error);
    }

    makeChoice = (choice) => {
        this.setState({
            isLoading: !choice, // if user chose 'yes', we are no longer loading.
            choiceMade: choice, // if user chose 'yes', the choice has been made.
        });
    }

    render() {
        if (this.state.isLoading) {
            return <SearchCard artistSearch={this.artistSearch}/>;
        } else if (this.state.choiceMade) {
            return <GameBoard artistData={ this.state.artistData }/>;
        } else {
            return(
                <ArtistCard artistData={ this.state.artistData }
                            makeChoice={ this.makeChoice }/>
            );
        }
    }
}

class GameBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artistData: this.props.artistData,
            isLoading: true,
        };
    }

    componentDidMount() {
        fetch(URL_BASE + 'getsongs?artist=' + this.state.artistData.id)
            .then((data) => data.json())
            .then((data) => this.parseSongData(data))
            .catch(console.error);
    }

    parseSongData(data) {
        this.setState({
            isLoading: false,
            songData: data,
        });
    }

    render() {
        if (this.state.isLoading) {
            return <h1>Loading...</h1>;
        } else {
            console.log(this.state.songData);
            return(
                <div id="gameboard">
                {
                    this.state.songData.map((album, i) => {
                        return <p key={i}>{album.name}</p>;
                    })
                }
                </div>
            );
        }
    }
}

class SearchCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: "",
        }
    }
    
    artistSearch = () => {
        let artist = this.state.inputValue;
        this.props.artistSearch(artist);
    }

    updateInputValue = (evt) => {
        this.setState({
            inputValue: evt.target.value,
        });
    }

    render() {
        return(
            <div className="input-group">
                <input type="text" placeholder="Artist name"
                       value={ this.state.inputValue }
                       onChange={evt => this.updateInputValue(evt)}/>
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary"
                            type="button"
                            onClick={ this.artistSearch }>
                        lets go baby
                    </button>
                </div>
            </div>
        );
    }
}

class ArtistCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.artistData,
        }
    }

    // this should maybe be like handleClick(), maybe i should make that for all objects
    confirmChoice = (evt) => {
        let id = evt.target.id;
        if (id === "yes") { // holy 
            id = true;
        } else {
            id = false;
        }
        this.props.makeChoice(id);
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
                    <p>Is this it?</p>
                    <div className="container w-75" id="button-holder">
                        <button id="yes" className="btn btn-primary"
                                onClick={ this.confirmChoice }>
                                    Yes
                        </button>
                        <button id="no" className="btn btn-secondary"
                                onClick={ this.confirmChoice }>
                                Nope
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Board;
