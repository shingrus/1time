import React from "react";
import { Route, Switch } from "react-router-dom";
import NewMessage from "./containers/NewMessage";
import ShowNewLink from "./containers/ShowNewLink";
import ViewSecretMessage from "./containers/ViewSecretMessage"
import ViewError from './containers/ErrorComponent';


export default () =>
    <Switch>

        <Route path="/" exact component={NewMessage} />
        <Route path="/index.html" exact component={NewMessage} />
        <Route path="/new" ex    component={ShowNewLink} />
        <Route path="/v/(.*)"  component={ViewSecretMessage} />
        <Route component={ViewError} />
    </Switch>;