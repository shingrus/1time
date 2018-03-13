import React, {Component} from "react";
import {FormGroup, Button, InputGroup, FormControl} from 'react-bootstrap';

import "./NewMessage.css";

export default class ShowNewLink extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newLink: "",
            copied: false
        };
        if (typeof(props.location) !== "undefined" && typeof(props.location.state) !== "undefined" && typeof(props.location.state.randomString) !== "undefined") {

            let arr = window.location.href.split("/");
            let host = arr[0] + "//" + arr[2];
            this.state.newLink = host + "/v/" + props.location.state.randomString + props.location.state.newId;
        }

        console.log("load show new link: " + this.state.newLink)
    }

    copyLink = () => {

        this.textInput.select();
        try {
            let successful = document.execCommand('copy');
            if (successful) {
                this.setState({copied: true})
            }

        } catch (err) {
            console.log('Oops, unable to copy');
        }


    };

    render() {
        return (

            <div className="Center">


                <FormGroup>
                    <InputGroup>
                        <InputGroup.Addon>Secret one-time link: </InputGroup.Addon>
                        <FormControl type="text"
                                     value={this.state.newLink}
                                     inputRef={input => this.textInput = input}
                                     readOnly/>
                    </InputGroup>

                </FormGroup>
                <div className="Center">
                    <Button className="text-center"
                            bsStyle="primary"
                            bsSize="large"
                            onClick={this.copyLink}>{!this.state.copied ? "Copy" : "Copied"}
                    </Button>
                </div>
                <p className="small centered"><br/>
                    This is the private one-time link. It could be opened only ones. Once it's open the content will be
                    DELETED. The Message was encrypted, so it's impossible for us to read it.
                </p>
                {/*<Button bsStyle="info" onClick={() => this.props.history.push('/')}>New message</Button>*/}
            </div>
        )
    }
}