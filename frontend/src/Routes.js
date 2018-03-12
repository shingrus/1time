import React from "react";
import { Route, Switch } from "react-router-dom";
import NewMessage from "./containers/NewMessage";
import ShowNewLink from "./containers/ShowNewLink";
// import AppliedRouter from "./components/AppliedRouter"


export default () =>
    <Switch>

        <Route path="/" exact component={NewMessage} />
        <Route path="/new"  component={ShowNewLink} />



    </Switch>;