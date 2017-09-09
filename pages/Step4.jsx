'use strict';

import React, { Component } from 'react';

export default class Step4 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      savedToCloud: props.getStore().savedToCloud
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  // not required as this component has no forms or user entry
  // isValidated() {}

  render() {
    return (
      <div className="step step6">
        <div className="row margin-top-50">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12 control-label">
                {
                  (this.state.savedToCloud)
                  ?
                    <div>
                      <h1>Thanks!</h1>
                      <h2>We are creating your account now...</h2>
                    </div>
                  :
                    <h1>Your account has been created successfully! <br/> You can login <a href='/#/'>here</a></h1>
                }
              </label>
              </div>
          </form>
        </div>
      </div>
    )
  }
}
