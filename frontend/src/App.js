import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import Routes from "./Routes"



import './App.css';

class App extends Component {

    render() {

        return (
            <div className="App container">
                <Routes />
            </div>
        );
    }
}

export default withRouter(App);
