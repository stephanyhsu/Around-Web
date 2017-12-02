import React from 'react';
import { Register } from './Register';
import { Login } from './Login'
import { Route, Switch, Redirect } from 'react-router-dom';

export class Main extends React.Component {
    render() {
        return (
            <section className="main">
                <Switch>
                    <Route exact path="/" component={Login}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                    <Route component={Login}/>
                </Switch>
            </section>
        );
    }
}