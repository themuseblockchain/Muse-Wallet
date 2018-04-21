import React, {Component, PropTypes} from 'react'
import { hashHistory  } from 'react-router'

import {isLoggedIn} from '../helpers/Authentication.jsx'
import {getUserInformation} from '../helpers/Authentication.jsx'

import muse from 'museblockchain-js';

class ClaimStake extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            claim_wif: ''
        };

        this.changeWIF = this.changeWIF.bind(this);

        this.callbackClaimStake = this.callbackClaimStake.bind(this);
        this.claimStake = this.claimStake.bind(this);
    }



    componentWillMount() {
        if(!isLoggedIn()) {
            hashHistory.push('/login');
        }
    }

    callbackClaimStake(code, message, result){

        switch(code)
        {
          case -3 :
          alert("Sorry, Unable to process. The key may be invalid.")
          this.setState({loading: false});
          break;

          case -2 :
          alert("Sorry, Unable to process. No balance was found on that key.")
          this.setState({loading: false});
          break;

          case 0 :
          alert("Claim of stake was successful.");
          this.setState({loading: false});
          hashHistory.push('/wallet');
          break;

          default:
          alert("Sorry, Unable to process. The key may be invalid.")
          this.setState({loading: false});
          break;
        }
    }

    changeWIF(e) {
        let wif = e.target.value;
        this.setState({ claim_wif: wif });
    };

    claimStake() {
        if(this.state.claim_wif == ""){
            alert("Please input the WIF to claim");
            return false;
        }

        this.setState({loading: true});

        let username = window.localStorage.getItem('username');

        muse.claimBalance(username, this.state.claim_wif, this.callbackClaimStake);
    }


    render() {
        return (
            <div className="wallet-container margin-top-50 margin-bottom-65 tabs-wrapper">
                <h3><p>Claim of Stake</p></h3>

                <h5>
                    <p>Enter the Owner Private Key / WIF of your old Muse account<br/>  and/or<br/>
                        Enter the Private Key of the Bitcoin address from which you participated in the pre-sale
                    </p>
                </h5>

                <div className="form-group margin-top-50">
                    <label for="claim-key" >WIF</label>
                    <input className="form-control" type="text" id="claim-key" placeholder="Please input the WIF to claim" onChange={this.changeWIF} />
                </div>

                <div className="form-group margin-top-50">
                    <button type="button" className="btn btn-primary" onClick={this.claimStake}>CLAIM STAKE</button>
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

export default ClaimStake;
