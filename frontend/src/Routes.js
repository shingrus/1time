import React from "react";
import { Route, Switch } from "react-router-dom";
import NewMessage from "./containers/NewMessage";
import ShowNewLink from "./containers/ShowNewLink";
import ViewSecretMessage from "./containers/ViewSecretMessage"


export default () =>
    <Switch>

        <Route path="/" exact component={NewMessage} />
        <Route path="/new"  component={ShowNewLink} />
        <Route path="/v/"  component={ViewSecretMessage} />



    </Switch>;