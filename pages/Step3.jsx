'use strict';

import React, { Component } from 'react';
import { hashHistory  } from 'react-router'
import PropTypes from 'prop-types';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import Joi from 'joi';
import muse from 'muse-js';
import axios from 'axios';
import config from '../config.json';

import randomString from 'random-string';

class Step3 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account_name: props.getStore().account_name,
      //account_pwd: props.getStore().account_pwd,
    };

    this.validatorTypes = {
      account_name: Joi.string().min(3).required().label("ACCOUNT NAME"),
      account_pwd: Joi.string().required().label("ACCOUNT PASSWORD"),
      account_pwd_confirm: Joi.string().required().valid(Joi.ref('account_pwd')).options({
        language:{
          any:{
            allowOnly: ' do not match'
          }
        }
      }).label("CONFIRM PASSWORD")
    };

    this.getValidatorData = this.getValidatorData.bind(this);
    this.renderHelpText = this.renderHelpText.bind(this);
    this.isValidated = this.isValidated.bind(this);
    this.callbackCreateAccount = this.callbackCreateAccount.bind(this);

    this.generateNewPassword = this.generateNewPassword.bind(this);
  }

  callbackCreateAccount(response) {
    /*if(response != 0)
      this.props.jumpToStep(2);

    if(response == -2){
      alert("Account Already Exists. Please try again.");
    }else if(response == -1){
      alert("Unable to create account");
    }*/

    if(response.statusText == "OK"){
      this.props.updateStore({
        savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
      });
      alert("Your account has been created successfully. Please try to login.");
      hashHistory.push('/login');
    } else{
      this.props.jumpToStep(2);
      alert("Unable to create account");
    }
  }

  isValidated() {
    return new Promise((resolve, reject) => {
      this.props.validate((error) => {
        if (error) {
          reject(); // form contains errors
          return;
        }

        //if (this.props.getStore().emailEmergency != this.getValidatorData().emailEmergency) { // only update store of something changed
          this.props.updateStore(
            this.getValidatorData());

          this.props.updateStore({
            savedToCloud: true // use this to notify step4 that some changes took place and prompt the user to save again
          });  // Update store here (this is just an example, in reality you will do it via redux or flux)
        //}

        resolve(); // form is valid, fire action

        var key_to_use = muse.auth.getPrivateKeys(this.props.getStore().account_name, this.props.getStore().account_pwd, ["owner", "active", "basic", "memo"]);
        //muse.createAccountWithKeys(this.props.getStore().account_name, key_to_use.ownerPubkey, key_to_use.activePubkey, key_to_use.basicPubkey, key_to_use.memoPubkey, this.callbackCreateAccount);
        axios.post(config['api-address'] + 'create_account', {
          account_name: this.props.getStore().account_name,
          owner_pub_key: key_to_use.ownerPubkey,
          active_pub_key: key_to_use.activePubkey,
          basic_pub_key: key_to_use.basicPubkey,
          memo_pub_key:  key_to_use.memoPubkey
        })
        .then(this.callbackCreateAccount)
        .catch(function (error) {
          
        });
      });
    });
  }

  getValidatorData() {
    return {
      account_name: this.refs.account_name.value,
      account_pwd: this.refs.account_pwd.value,
      account_pwd_confirm: this.refs.account_pwd_confirm.value
    }
  };

  onChange(e) {
      let newState = {};
      newState[e.target.name] = e.target.value;
      this.setState(newState);
  }

  renderHelpText(message, id) {
      return (<div className="val-err-tooltip" key={id}><span>{message}</span></div>);
  };

  generateNewPassword() {
      var new_pwd = randomString({length: 52, numeric: true, letters: true, special: true, exclude: ['`', '"', "'", ',']});
      this.setState({account_pwd: new_pwd});
  }

  render() {
    // explicit class assigning based on validation
    let notValidClasses = {};
    notValidClasses.accountNameCls = this.props.isValid('account_name') ?
        'no-error col-md-12' : 'has-error col-md-12';

    return (
        <div className="step step3">
            <div className="row">
                <form id="Form" className="form-horizontal col-md-12">
                  
                  <div className="form-group col-md-12 content form-block-holder margin-top-50 text-center">
                    <h5><a href="/#/terms-cond" className="badge badge-pill badge-default"><span >Terms & Cond > </span></a></h5>
                  </div>

                  <div className="form-group col-md-12 content form-block-holder ">
                    <label className="control-label1 col-md-12">
                        ACCOUNT NAME
                    </label>
                    <div className={notValidClasses.accountNameCls}>
                        <input
                            ref="account_name"
                            name="account_name"
                            autoComplete="off"
                            type="text"
                            className="form-control"
                            placeholder=""
                            required
                            defaultValue={this.state.account_name}
                            onBlur={this.props.handleValidation('account_name')}
                            onChange={this.onChange.bind(this)}
                        />

                        {this.props.getValidationMessages('account_name').map(this.renderHelpText)}
                    </div>
                  </div>
                  <div className="form-group col-md-12 content form-block-holder">
                    <label className="control-label1 col-md-12">
                        GENERATED PASSWORD
                    </label>
                    <div className={notValidClasses.accountNameCls}>
                        <input
                            ref="account_pwd"
                            name="account_pwd"
                            autoComplete="off"
                            type="text"
                            className="form-control"
                            placeholder=""
                            required
                            defaultValue=""
                            value={this.state.account_pwd}
                            onBlur={this.props.handleValidation('account_pwd')}
                            onChange={this.onChange.bind(this)}
                        />

                        {this.props.getValidationMessages('account_pwd').map(this.renderHelpText)}
                    </div>
                    <div className="text-center"><strong>BACK IT UP BY STORING IN YOUR PASSWORD MANAGER OR A TEXT FILE</strong></div>

                    <div className="margin-top-20 text-center">
                        <button type="button" className="btn btn-secondary" onClick={this.generateNewPassword}>CLICK TO GENERATE PASSWORD</button>
                    </div>
                  </div>

                  <div className="form-group col-md-12 content form-block-holder">
                    <label className="control-label1 col-md-12">
                        RE-ENTER GENERATED PASSWORD
                    </label>
                    <div className={notValidClasses.accountNameCls}>
                        <input
                            ref="account_pwd_confirm"
                            name="account_pwd_confirm"
                            autoComplete="off"
                            type="text"
                            className="form-control"
                            placeholder=""
                            required
                            defaultValue=""
                            onBlur={this.props.handleValidation('account_pwd_confirm')}
                            onChange={this.onChange.bind(this)}
                        />

                        {this.props.getValidationMessages('account_pwd_confirm').map(this.renderHelpText)}
                    </div>
                  </div>

                  <div className="form-group col-md-12 content margin-top-50">
                    <label className="col-md-12">
                      <input type="checkbox" name="terms1" />
                      &nbsp;&nbsp;I UNDERSTAND THIS WALLET HOSTER CANNOT RECOVER LOST PASSWORDS
                    </label>
                  </div>

                  <div className="form-group col-md-12 content">
                    <label className="col-md-12">
                      <input type="checkbox" name="terms2" />
                      &nbsp;&nbsp;I HAVE SECURELY SAVED MY GENERATED PASSWORD
                    </label>

                  </div>
                </form>
            </div>
        </div>
    )
  }
}

Step3.propTypes = {
  errors: PropTypes.object,
  validate: PropTypes.func,
  isValid: PropTypes.func,
  handleValidation: PropTypes.func,
  getValidationMessages: PropTypes.func,
  clearValidations: PropTypes.func,
  getStore: PropTypes.func,
  updateStore: PropTypes.func
};

export default validation(strategy)(Step3);
