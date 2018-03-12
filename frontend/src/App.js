import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
// import {Link} from "react-router-dom";
// import {Navbar} from "react-bootstrap";
import Routes from "./Routes"
// import { withRouter } from 'react-router'


import './App.css';

class App extends Component {

    render() {

        return (
            <div className="App container">
                {/*<Navbar fluid collapseOnSelect>*/}
                    {/*<Navbar.Header>*/}
                        {/*<Navbar.Brand>*/}
                            {/*<Link to="/">1Time</Link>*/}
                        {/*</Navbar.Brand>*/}
                        {/*<Navbar.Toggle/>*/}
                    {/*</Navbar.Header>*/}
                {/*</Navbar>*/}
                <Routes />
            </div>
        );
    }
}

export default withRouter(App);
