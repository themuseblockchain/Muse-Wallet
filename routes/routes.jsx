import React from 'react'
import {Router, Route, Link, browserHistory, IndexRoute, hashHistory} from 'react-router'

import LandingLayout from '../layouts/LandingLayout.jsx'

import Login from '../pages/Login.jsx'
import Wallet from '../pages/Wallet.jsx'
import Register from '../pages/Register.jsx'
import ClaimStake from '../pages/ClaimStake.jsx'
import VoteWitness from '../pages/VoteWitness.jsx'


export default (
    <Route path="/" component={LandingLayout}>
        <IndexRoute component={Login}/>
        <Route path="/login" component={Login}/>
        <Route path="/wallet" component={Wallet}/>
        <Route path="/claim-stake" component={ClaimStake}/>
        <Route path="/vote-witness" component={VoteWitness}/>
        <Route path="/register" component={Register}/>
        
    </Route>
);
