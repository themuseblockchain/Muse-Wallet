import React from 'react'
import ReactDOM from 'react-dom'
import Popup from 'react-popup'
import { Router, Route, Link, browserHistory, IndexRoute, hashHistory  } from 'react-router'

import routes from './routes/routes.jsx'


let rootElement = document.getElementById('app')
let popupElement = document.getElementById('popup_container')

ReactDOM.render(
    <Router history={hashHistory} routes={routes}>
    </Router>,
  rootElement
)

ReactDOM.render(
	<Popup />,
	popupElement
)