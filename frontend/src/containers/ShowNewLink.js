import React, {Component} from "react";
import {FormGroup, Button, InputGroup, FormControl} from 'react-bootstrap';

export default class ShowNewLink extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newLink: "",
            copied: false
        }
        if (typeof(props.location) !== "undefined" && typeof(props.location.state) !== "undefined" && typeof(props.location.state.newLink) !== "undefined") {
            //do something
            this.state.newLink = props.location.state.newLink;
        }

        console.log("load show new link: " + this.state.newLink)
    }

    copyLink = () => {

        this.textInput.select()
        try {
            successful = document.execCommand('copy');
            if (successful) {
                this.setState({copied: true})
            }



        } catch (err) {
            console.log('Oops, unable to copy');
        }


    }

    render() {
        return (

            <div>
                <p>
                    One-Time Message has been seaved.
                    Now you can share this one-time link:
                </p>
                <FormGroup>
                    <InputGroup>

                        <InputGroup.Addon>Secret link: </InputGroup.Addon>
                        <FormControl type="text" value={this.state.newLink} inputRef={input => this.textInput = input}
                                     readOnly/>
                    </InputGroup>

                </FormGroup>
                <p>
                    <Button bsStyle="primary" onClick={this.copyLink}>{!this.state.copied ? "Copy" : "Copied"}</Button>
                    <Button bsStyle="info" onClick={() => this.props.history.push('/')}>New message</Button>
                </p>
            </div>
        )
    }
}