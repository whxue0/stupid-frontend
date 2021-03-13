import React from 'react'
import ReactDOM from 'react-dom'

import {HashRouter, Route, Switch} from 'react-router-dom'
import {Provider} from 'react-redux'

import store from './redux/store'
import Register from './containers/Register/Register'
import Login from './containers/Login/Login'
import Main from './containers/Main/Main'

import './asserts/css/style.css'

ReactDOM.render(
    <Provider store = {store}>
        <HashRouter>
            <Switch>
                <Route path = '/register' component={Register}></Route>
                <Route path = '/login' component={Login}></Route>
                <Route component={Main}></Route>
            </Switch>
        </HashRouter>
    </Provider>
    ,
    document.getElementById('root')
)