import React from 'react'
import {Switch, Route, Redirect} from 'react-router'

import Home from '../components/home/Home'
import UserCrud from '../components/user/UserCrud'
import Map from "../components/map/Map";
import Users from "../components/users/Users";

export default props =>
    <Switch>
        <Route exact path={'/'} component={Home} />
        <Route path={'/user'} component={UserCrud} />
        <Route path={'/user/:userId'} component={UserCrud} />
        <Route path={'/users'} component={Users} />
        <Route path={'/location'} component={Map} />
        <Redirect from={'*'} to={'/'} />
    </Switch>
