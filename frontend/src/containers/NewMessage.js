import React, {Component} from "react";
import {Button, FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import axios from "axios"

import "./NewMessage.css";

export default class NewMessage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            secretMessage: "",
            secretKey: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    validateForm() {
        return this.state.secretMessage.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        let _this = this;


        apiBaseUrl = "http://localhost:8080/api/";
        payload = {
            "secretMessage": this.state.secretMessage,
            "secretKey": this.state.secretKey
        }
        axios.post(apiBaseUrl + 'saveSecret', payload)
            .then(function (response) {
                console.log(response);
                if (response.data.status === "ok") {
                    newLink = response.data.newLink;
                    console.log("got: "+newLink);
                    //navigate to view
                    _this.props.history.push(
                        {
                            pathname: "/new",
                            state: response.data
                        }
                    );

                }
                else {
                    console.log("Username does not exists");
                    // alert("Username does not exist");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }



    render() {
        return (
            <div className="NewMessage">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="secretMessage" bsSize="large">
                        <ControlLabel>One-time Message</ControlLabel>
                        <FormControl
                            autoFocus
                            componentClass="textarea"
                            value={this.state.secretMessage}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="secretKey" bsSize="large">
                        <ControlLabel aria-describedby="keyHelp">Secret Key</ControlLabel>
                        <FormControl
                            placeholder="Secret Key"
                            value={this.state.secretKey}
                            onChange={this.handleChange}
                            type="text"
                        />
                    </FormGroup>


                    <Button
                        block
                        bsSize="large"
                        bsStyle="primary"
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        Encrypt and store
                    </Button>
                </form>
            </div>
        );
    }
}