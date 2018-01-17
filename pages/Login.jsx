import React, {Component, PropTypes} from 'react'
import { hashHistory  } from 'react-router'
import {isLoggedIn} from '../helpers/Authentication.jsx'
import crypto from 'crypto-js'
import muse from 'museblockchain-js'
import localConfig from '../config.json'
muse.configure(localConfig);

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            loading: false
        };

        this.changeUsername = this.changeUsername.bind(this);
        this.changePassword = this.changePassword.bind(this);

        this.doLogin = this.doLogin.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);

        this.callback_on_response = this.callback_on_response.bind(this);
    }

    componentWillMount() {
        if(isLoggedIn()) {
            hashHistory.push('/wallet');
        }

        if(this.getCookie('username') && this.getCookie('password')) {
            muse.login(this.getCookie('username'), this.getCookie('password'), this.callback_on_response);
        }
    }

    getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    changeUsername(e) {
        let username = e.target.value;
        this.setState({ username: username });

        window.localStorage.setItem("username", username);
    };

    changePassword(e) {
          let password = crypto.AES.encrypt(e.target.value, this.state.username);
          this.setState({ password: password });
          window.localStorage.setItem("password", password);
          //console.log(password);
    };

    callback_on_response(code, message) {
        //console.log(code);
        //console.log(message);

        this.setState({loading: false});

        if(code == 1){
            window.localStorage.setItem('is_logged_in', true);

            hashHistory.push('/wallet');
        } else if(code == -2){
            alert("User not Found");
            return;
        } else if(code == -1){
            alert("Invalid password or WIF");
            return;
        }
    };

    doLogin() {

        if(this.state.username == ""){
            alert("Please input the User name");
            return false;
        }

        if(this.state.password == ""){
            alert("Please input the Password");
            return false;
        }

        this.setState({loading: true});

        if(this.state.remember_me) {
            document.cookie = 'username=' + this.state.username;
            document.cookie = 'password=' + this.state.password ;
        }
        var bytes  = crypto.AES.decrypt(this.state.password.toString(), this.state.username);
        var plaintext = bytes.toString(crypto.enc.Utf8);
        muse.login(this.state.username, plaintext, this.callback_on_response);

    };



    handleKeyPress(target) {
        if(target.charCode==13){
            this.doLogin();
        }
    }

    goRegister(){
        hashHistory.push('/register');
    }

    render() {
        return (
            <div className="login-container margin-top-100 margin-bottom-50">
                <h3 className="text-center margin-bottom-50 page-title">Returning Users: Login</h3>
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <form>

                            <div className="form-group">
                                <input type="text" className="form-control" onChange={this.changeUsername} placeholder="Enter your username" onKeyPress={this.handleKeyPress}/>
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control" onChange={this.changePassword}  placeholder="Password or WIF" onKeyPress={this.handleKeyPress}/>
                            </div>
                            <div className="form-group">
                                <button type="button" className="btn btn-success pull-left" onClick={this.doLogin}>LOGIN</button>
                                <button type="button" className="btn btn-primary pull-right" onClick={this.goRegister}>Register</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className={`loader-wrapper ${this.state.loading ? 'visible' : 'hidden'}`}></div>
                <div className={`loader-container ${this.state.loading ? 'visible' : 'hidden'}`}>
                    <div className="loader-cell">
                        <i className="fa fa-refresh fa-spin fa-5x fa-fw"></i>
                    </div>
                </div>

            </div>
        )
    }
}

export default Login;
