import React from 'react';
import {FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap'
import axios from 'axios/index';
import CryptoJS from 'crypto-js'
import {Constants} from '../utils/util';

import "./NewMessage.css";


export default class ViewSecretMessage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            secretMessage: "",
            secretKey: "",
            isWrongKey:false
        }
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };
    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({isLoading: true, isWrongKey:false});
        let _this = this;

        let arr = window.location.href.split("/");
        let link = arr[4];

        if (typeof(link) !== "undefined" && link.length > Constants.randomKeyLen) {

            let randomKey = link.substring(0, Constants.randomKeyLen);
            let id = link.substring(Constants.randomKeyLen);
            let secretKey = this.state.secretKey + randomKey;
            let hashedKey = CryptoJS.SHA256(secretKey).toString();
            let payload = {
                id: id,
                hashedKey: hashedKey
            };
            console.log(payload);
            axios.post(Constants.apiBaseUrl + 'get', payload)
                .then(function (response) {
                    if (response.data.status === "ok" &&
                        typeof (response.data.cryptedMessage) !== "undefined" &&
                        response.data.cryptedMessage.length > 0
                    ) {

                        let decrypteddata = CryptoJS.AES.decrypt(response.data.cryptedMessage, secretKey);
                        let decryptedMessage = decrypteddata.toString(CryptoJS.enc.Utf8);
                        console.log("Decrypted message: " + decryptedMessage);
                        _this.setState({isLoading:false, secretMessage: decryptedMessage})
                    } else if(response.data.status === "wrong key") {
                        console.log("Wrong key");
                        _this.setState({isLoading: false, isWrongKey:true});
                    }
                    else if(response.data.status === "no message") {
                        console.log("No message");
                        _this.setState({isLoading: false, isNoMessage       :true});
                    }
                    else {
                        console.log("Something went wrong");
                        //TODO show error
                        _this.setState({isLoading: false})
                    }

                }).catch(function (error) {
                console.log(error);
                _this.setState({isLoading: false})

            });


        } else {
            this.setState({isLoading: false});
        }


    };

    render() {
        return (
            <div className="Center">
                <form onSubmit={this.handleSubmit}>
                    {this.state.secretMessage.length === 0 &&
                    <FormGroup controlId="secretKey" bsSize="large">
                        <ControlLabel aria-describedby="keyHelp">Secret Key</ControlLabel>
                        <FormControl
                            placeholder="Secret Key"
                            value={this.state.secretKey}
                            onChange={this.handleChange}
                            type="text"
                        />
                    </FormGroup>
                    }
                    {this.state.secretMessage.length > 0 &&
                    <FormGroup controlId="secretMessage" bsSize="large">
                        <ControlLabel>One-time Message</ControlLabel>
                        <FormControl
                            autoFocus
                            componentClass="textarea"
                            value={this.state.secretMessage}
                            disabled="true"
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    }
                    {this.state.secretMessage.length === 0 &&
                    <Button
                        block
                        bsSize="large"
                        bsStyle="primary"
                        type="submit"
                        disabled={this.state.isLoading}
                    >
                        {!this.state.isLoading ? "Read the message" : "Loading..."}
                    </Button>
                    }
                    {this.state.secretMessage.length > 0 &&
                    <Button
                        block
                        bsSize="large"
                        bsStyle="primary"
                        type="submit"
                        onClick={() => this.props.history.push('/')}
                    >
                        Create New
                    </Button>
                    }

                </form>
            </div>
        );
    }

}