import React, {Component} from "react";
import {Button, FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import axios from "axios"
import CryptoJS from 'crypto-js'
import {getRandomString, Constants} from '../utils/util';


import "./NewMessage.css";

export default class NewMessage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            secretMessage: "",
            secretKey: "",
            isLoading: false,
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
    };

    handleSubmit(event) {
        event.preventDefault();
        this.setState({isLoading: true}); //block button
        let _this = this;


        let apiBaseUrl = "http://localhost:8080/api/";
        let randomKey = getRandomString(Constants.randomKeyLen);
        let secretMessage =  this.state.secretMessage;

        let secretKey = this.state.secretKey + randomKey;

        let encryptedMessage = CryptoJS.AES.encrypt(secretMessage, secretKey);
        let hashedKey = CryptoJS.SHA256(secretKey);


        // let decrypteddata = CryptoJS.AES.decrypt(encryptedMessage.toString(), sekretKey)
        // let decryptedMessage = decrypteddata.toString(CryptoJS.enc.Utf8);


        let payload = {
            secretMessage: encryptedMessage.toString(),
            hashedKey: hashedKey.toString(),
        };
        console.log("payload:" + hashedKey);
        axios.post(apiBaseUrl + 'saveSecret', payload)
            .then(function (response) {
                console.log(response);
                if (response.data.status === "ok") {
                    let newLink = response.data.newId;
                    console.log("got: " + newLink + ", random: " + randomKey);
                    //navigate to view
                    let state = {
                        randomString: randomKey,
                        newId: response.data.newId
                    };
                    _this.props.history.push(
                        {
                            pathname: "/new",
                            state: state
                        }
                    );

                }
                else {
                    console.log("Something went wrong");
                    //TODO show error
                    _this.setState({isLoading: false})
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
                        disabled={!this.validateForm() || this.state.isLoading}
                        type="submit"
                    >
                        {!this.state.isLoading ? "Encrypt and store" : "Loading..."}
                    </Button>
                </form>
            </div>
        );
    }
}