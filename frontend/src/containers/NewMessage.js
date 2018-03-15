import React, {Component} from "react";
import {Button, FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import axios from "axios"
import CryptoJS from 'crypto-js'
import {getRandomString, Constants} from '../utils/util';


import "./Container.css";

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

        let randomKey = getRandomString(Constants.randomKeyLen);
        let secretMessage =  this.state.secretMessage;

        let secretKey = this.state.secretKey + randomKey;

        let encryptedMessage = CryptoJS.AES.encrypt(secretMessage, secretKey);
        let hashedKey = CryptoJS.SHA256(secretKey);

        let payload = {
            secretMessage: encryptedMessage.toString(),
            hashedKey: hashedKey.toString(),
        };
        console.log("payload:" + hashedKey);
        axios.post(Constants.apiBaseUrl + 'saveSecret', payload)
            .then(function (response) {
                console.log(response);
                if (response.data.status === "ok") {
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
                    //TODO show error
                    _this.setState({isLoading: false});
                }
            })
            .catch(function (error) {
                _this.setState({isLoading: false});
                console.log(error);
            });
    }


    render() {
        return (
            <div className="Left">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="secretMessage" bsSize="large">
                        <ControlLabel>One-time Message</ControlLabel>
                        <FormControl
                            autoFocus
                            componentClass="textarea"
                            placeholder="All content will be encrypted with uniq key. We don't have any access to this content on server side!"
                            rows={4}
                            value={this.state.secretMessage}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="secretKey" bsSize="large">
                        <ControlLabel aria-describedby="keyHelp">Secret Key</ControlLabel>
                        <p className="small">You can specify a secret key. If anybody get the one-time link, he needs to know this additional secret key.</p>
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
                    <p className="small">Paste private text like passwords, one-time tokens or any sensitive data, get one-time link and send it to trusted user. When a user openes the link the content will be destroyed. It's absolutely private. We don't have access to the stored data, because it's encrypted on the client side with one-time password. Data available only for 7 days.</p>
                </form>
            </div>
        );
    }
}