import React, {Component} from "react";
import {FormGroup, Button, InputGroup, FormControl} from 'react-bootstrap';
import {
    EmailShareButton, TelegramShareButton, WhatsappShareButton,
    EmailIcon, TelegramIcon, WhatsappIcon
} from 'react-share'
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

        // console.log("load show new link: " + this.state.newLink)
    }

    copyLink = () => {
        //https://stackoverflow.com/a/41267511/5803103
        if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
            let el = this.textInput;
            let editable = el.contentEditable;
            let readOnly = el.readOnly;
            el.contentEditable = true;
            el.readOnly = false;
            let range = document.createRange();
            range.selectNodeContents(el);
            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            el.setSelectionRange(0, 999999);
            el.contentEditable = editable;
            el.readOnly = readOnly;
        } else {
            this.textInput.select();
        }

        document.execCommand('copy');
        this.setState({copied: true});
        this.textInput.blur();


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
                                     onFocus={() => {
                                         this.copyLink()
                                     }}
                                     readOnly/>
                    </InputGroup>
                </FormGroup>
                {!navigator.userAgent.match(/ipad|ipod|iphone/i) ?
                <div className="outer-row">
                    <WhatsappShareButton url={this.state.newLink} className="inner">
                        <WhatsappIcon size={34}/></WhatsappShareButton>
                    <TelegramShareButton url={this.state.newLink} className="inner">
                        <TelegramIcon size={34}/>
                    </TelegramShareButton>

                    <EmailShareButton url={this.state.newLink} className="inner"><EmailIcon
                        size={34}/></EmailShareButton>
                </div> : null

                }
                <Button className={navigator.userAgent.match(/ipad|ipod|iphone/i)?"center-block":"inner"}
                        bsStyle="primary"
                        bsSize="large"
                        onClick={this.copyLink}>{!this.state.copied ? "Copy to clipboard" : "Copied"}
                </Button>

                <p className="small centered"><br/>
                    This secret one-time link works only once. Once it's open the content will be
                    DELETED. The Message was encrypted, so it's impossible for us to read it.
                </p>
                {/*<Button bsStyle="info" onClick={() => this.props.history.push('/')}>New message</Button>*/}
            </div>
        )
    }
}
