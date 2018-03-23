import React from 'react';
import { Button} from 'react-bootstrap'

import "./Container.css";


export default class ViewError extends React.Component {
    render() {
        return (<div className="Center">
            <p className="large" color="red">
                Page not found.
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
        </div>)
    }
}