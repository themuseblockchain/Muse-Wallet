import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import { hashHistory  } from 'react-router'

import {isLoggedIn} from '../../helpers/Authentication.jsx'
import {getUserInformation} from '../../helpers/Authentication.jsx'

import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';


// Header component
export default class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {visible: 'slidepanel', isOpen: false, isOpenRightsidebar: false};

        this.slideToggle = this.slideToggle.bind(this);
        this.logOut = this.logOut.bind(this);
        this.logOutM = this.logOutM.bind(this);
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.toggleRightsidebar = this.toggleRightsidebar.bind(this);
        this.gotoPage = this.gotoPage.bind(this);
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside.bind(this), true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside.bind(this), true);
    }

    handleClickOutside(event) {
        const domNode = ReactDOM.findDOMNode(this);

        if ((!domNode || !domNode.contains(event.target))) {
            this.setState({
                isOpenRightsidebar : false
            });
        }
    }

    gotoPage(url){
        this.setState({
            isOpenRightsidebar : false
        });
        if(url == '/wallet')
            this.props.updateLayoutStates({change_pwd: true})
        
        var current_url = this.props.location.pathname;
        
        hashHistory.push(url);        
    }

    logOut() {
        window.localStorage.setItem('is_logged_in', false);
        document.cookie = 'username=' + '';
        document.cookie = 'password=' + '';

        hashHistory.push('/login');
    }

    logOutM() {
        window.localStorage.setItem('is_logged_in', false);
        document.cookie = 'username=' + '';
        document.cookie = 'password=' + '';

        this.setState({ visible: this.state.visible == 'slidepanel'? 'slidepanel visible' : 'slidepanel' });

        hashHistory.push('/login');
    }

    slideToggle() {
        this.setState({ visible: this.state.visible == 'slidepanel'? 'slidepanel visible' : 'slidepanel' });
    }

    toggleNavbar() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    toggleRightsidebar() {
        this.setState({
            isOpenRightsidebar: !this.state.isOpenRightsidebar
        });
    }

    render() {
        return (
            <div>
                <Navbar color="inverse" inverse toggleable>
                    <NavbarToggler right onClick={this.toggleNavbar} />
                    <NavbarBrand href="/#/">
                        <div className="logo">
                            <img src="assets/img/logo.png" height="auto" width="60"/>
                            <span>MUSE beta</span>

                            {isLoggedIn() ? <span className="login-btn account-btn cursor-pointer"> &nbsp;&nbsp;|&nbsp;&nbsp; @{getUserInformation()} &nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:void(0)" onClick={this.gotoPage.bind(this, '/postcontent')}>Post Content</a></span> : null}
                        </div>
                    </NavbarBrand>

                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            {isLoggedIn() ? 
                            <NavItem>
                                <NavLink href="javascript:void(0)" onClick={this.logOut}>Logout</NavLink>
                            </NavItem>
                            : null}
                        </Nav>
                        <a onClick={this.toggleRightsidebar} className="header-custom-toogle" href="javascript:void(0)"><span className="navbar-toggler-icon"></span></a>
                    </Collapse>
                </Navbar>

                <div className={`rightsidebar-panel right ${this.state.isOpenRightsidebar ? 'visible' : ''}`}>
                    <button type="button" className="close close-button" aria-label="Close" onClick={this.toggleRightsidebar}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <ul>
                        <li><a href="http://museblockchain.com/" target="_blank">About MUSE</a></li>
                        <li><a href="http://museblockchain.com/faq.html" target="_blank">FAQ</a></li>
                        <li><a href="javascript:void(0)">Buy MUSE (coming soon)</a></li>
                        <li><a href="javascript:void(0)">Internal Market (coming soon)</a></li>
                        <li><a href="javascript:void(0)" onClick={this.gotoPage.bind(this, '/wallet')}>Change Account Password</a></li>
                        <li><a href="javascript:void(0)">Stolen Accounts Recovery (coming soon)</a></li>
                        <li><a href="javascript:void(0)" onClick={this.gotoPage.bind(this, '/vote-witness')}>Vote for Witnesses</a></li>
                        <li><a href="javascript:void(0)" onClick={this.gotoPage.bind(this, '/claim-stake')}>Claim Stake</a></li>
                        <li><a href="https://join.slack.com/t/musecommunity/shared_invite/MjIwMDM5OTY3OTg3LTE1MDE1MjcxODQtYjMzNzAwODMxYQ" target="_blank">Muse community Slack - Chat</a></li>
                    </ul>
                </div>

            </div>
        );
    }
}