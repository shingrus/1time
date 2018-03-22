import React, {Component} from "react";
import {FormGroup, Button, ButtonToolbar, InputGroup, FormControl} from 'react-bootstrap';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import "./Container.css";

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

    }


    render() {
        return (
            <div className="Center">
                <FormGroup>
                    <InputGroup>
                        <InputGroup.Addon>Secret one-time link: </InputGroup.Addon>
                        <CopyToClipboard text={this.state.newLink}
                                         onCopy={() => this.setState({copied: true})}
                        >
                            <FormControl type="text"
                                         value={this.state.newLink}
                                         inputRef={input => this.textInput = input}
                                         readOnly/>
                        </CopyToClipboard>
                    </InputGroup>
                </FormGroup>
                <div className="center-block">
                <ButtonToolbar>
                    <Button
                        bsSize="large"
                        bsStyle="primary"
                        type="submit"

                        onClick={() => this.props.history.push('/')}
                    >Create new</Button>
                    <CopyToClipboard text={this.state.newLink}
                                     onCopy={() => this.setState({copied: true})}
                    >
                        <Button
                            bsStyle="success"
                            bsSize="large"
                        >{!this.state.copied ? "Copy to clipboard" : "Copied"}
                        </Button>
                    </CopyToClipboard>
                </ButtonToolbar></div>
                <p className="small centered"><br/>
                    This secret one-time link works only once. Once it's open the content will be
                    DELETED. The Message was encrypted, so it's impossible for us to read it.
                </p>
                {/*<Button bsStyle="info" onClick={() => this.props.history.push('/')}>New message</Button>*/}
            </div>
        )
    }
}
