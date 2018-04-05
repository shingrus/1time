import React from 'react';
import {FormGroup, ControlLabel, FormControl, Button, Panel} from 'react-bootstrap'
import axios from 'axios/index';
import CryptoJS from 'crypto-js'
import {Constants} from '../utils/util';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import "./Container.css";


export default class ViewSecretMessage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            secretMessage: "",
            secretKey: "",
            needSecretKey: "",
            isWrongKey: false,
            isNoMessage: false,
        }
    }


    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };
    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({isLoading: true, isWrongKey: false});
        let _this = this;

        let arr = window.location.href.split("#");
        let link = "";
        if (arr.length ===   2 ) {//we have new type of link
         link = arr[1]
        }
        else {
            arr = window.location.href.split("/");
            link = arr[4];
        }




        if (typeof(link) !== "undefined" && link.length > Constants.randomKeyLen) {

            let randomKey = link.substring(0, Constants.randomKeyLen);
            let id = link.substring(Constants.randomKeyLen);
            let secretKey = this.state.secretKey + randomKey;
            let hashedKey = CryptoJS.SHA256(secretKey).toString();
            let payload = {
                id: id,
                hashedKey: hashedKey
            };
            axios.post(Constants.apiBaseUrl + 'get', payload)
                .then(function (response) {
                    if (response.data.status === "ok" &&
                        typeof (response.data.cryptedMessage) !== "undefined" &&
                        response.data.cryptedMessage.length > 0
                    ) {
                        let decrypteddata = CryptoJS.AES.decrypt(response.data.cryptedMessage, secretKey);
                        let decryptedMessage = decrypteddata.toString(CryptoJS.enc.Utf8);
                        // console.log("Decrypted message: " + decryptedMessage);
                        _this.setState({isLoading: false, secretMessage: decryptedMessage})
                    } else if (response.data.status === "wrong key") {
                        console.log("Wrong key");
                        _this.setState({isLoading: false, isWrongKey: true, needSecretKey: true,});
                    }
                    else if (response.data.status === "no message") {
                        // console.log("No message");
                        _this.setState({isLoading: false, isNoMessage: true});
                    }
                    else {
                        // console.log("Something went wrong");
                        //TODO show error
                        _this.setState({isLoading: false})
                    }

                }).catch(function (error) {
                console.log(error);
                _this.setState({isLoading: false})

            });


        } else {
            this.setState({isLoading: false, isNoMessage:true});
        }


    };

    render() {
        return (
            <div className="Left">
                {this.state.secretMessage.length === 0 && !this.state.isNoMessage &&
                <p>You are about to read the secret message. Once you read it will be destroyed.</p>
                }
                <form onSubmit={this.handleSubmit}>
                    {this.state.secretMessage.length === 0 && !this.state.isNoMessage && this.state.needSecretKey &&
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
                    <Panel>
                        <Panel.Heading>
                            <Panel.Title componentClass="h3">One-time message:</Panel.Title>
                        </Panel.Heading>
                        <Panel.Body><pre >{this.state.secretMessage}</pre></Panel.Body>
                        <Panel.Heading>
                            <Panel.Title componentClass="h3">
                                <CopyToClipboard
                                    text={this.state.secretMessage}
                                                     onCopy={() => this.setState({copied: true})} >
                                <Button
                                    bsSize="small"
                                    bsStyle="success"
                                    className="center-block"
                                    type="submit"
                                >{!this.state.copied ? "Copy to clipboard" : "Copied"}</Button></CopyToClipboard>
                            </Panel.Title>
                        </Panel.Heading>
                    </Panel>
                    }
                    {this.state.secretMessage.length === 0 && !this.state.isNoMessage &&
                    <div className="Center">
                        <Button
                            bsSize="large"
                            bsStyle="success"
                            className="center-block"
                            type="submit"
                            disabled={this.state.isLoading}
                        >
                            {!this.state.isLoading ? "Read the message" : "Loading..."}
                        </Button>
                    </div>
                    }
                    {(this.state.secretMessage.length > 0 || this.state.isNoMessage) &&
                    <div className="Center">
                        <p className="small">
                            Message was destroyed.
                        </p>
                        <Button
                            bsSize="large"
                            bsStyle="primary"
                            className="center-block"
                            type="submit"
                            onClick={() => this.props.history.push('/')}
                        >
                            Create New
                        </Button>
                    </div>
                    }
                </form>

            </div>
        );
    }

}