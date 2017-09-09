'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import Joi from 'joi';

export default class Step2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: props.getStore().phone,
    };

    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms

    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  isValidated() {
    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator
    let isDataValid = false;

    // if full validation passes then save to store and pass as valid
    if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] === true })) {
        if (this.props.getStore().phone != userInput.phone || this.props.getStore().gender != userInput.gender) { // only update store of something changed
          this.props.updateStore({
            phone: userInput.phone,
            savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
          });  // Update store here (this is just an example, in reality you will do it via redux or flux)
        }

        isDataValid = true;
    }
    else {
        // if anything fails then update the UI validation state but NOT the UI Data State
        this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
    }

    return isDataValid;
  }

  validationCheck() {
    if (!this._validateOnDemand)
      return;

    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator

    this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
  }

   _validateData(data) {
    return  {
      phoneVal: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(data.phone), // required: regex w3c uses in html5
    }
  }

  _validationErrors(val) {
    const errMsgs = {
      phoneValMsg: val.phoneVal ? '' : 'A valid phone is required'
    }
    return errMsgs;
  }

  _grabUserInput() {
    return {
      phone: this.refs.phone.value
    };
  }

  render() {
    // explicit class assigning based on validation
    let notValidClasses = {};

    if (typeof this.state.phoneVal == 'undefined' || this.state.phoneVal) {
        notValidClasses.phoneCls = 'no-error col-md-12';
    }
    else {
       notValidClasses.phoneCls = 'has-error col-md-12';
       notValidClasses.phoneValGrpCls = 'val-err-tooltip';
    }

    return (
        <div className="step step2">
            <div className="margin-top-50">
                <form id="Form" className="form-horizontal">
                  <div className="col-md-12">
                      <h3>Please provide your phone number to continue the registration process</h3>
                  </div>
                  <div className="content">
                    <div className="col-md-12 text-muted">
                      Phone verification helps with preventing spam.<br/>
                      Your phone number will not be used for any other purpose other than phone verification and account recovery.
                    </div>
                  </div>
                  
                  <div className="form-group col-md-12 content form-block-holder margin-top-50">
                    <label className="control-label1 col-md-12">
                        PHONE NUMBER
                    </label>
                    <div className={notValidClasses.phoneCls}>
                        <input
                            ref="phone"
                            name="phone"
                            autoComplete="off"
                            type="phone"
                            className="form-control"
                            placeholder=""
                            required
                            defaultValue={this.state.phone}
                            onBlur={this.validationCheck}
                        />

                        <div className={notValidClasses.phoneValGrpCls}>{this.state.phoneValMsg}</div>
                    </div>
                  </div>
                </form>
            </div>
        </div>
    )
  }
}