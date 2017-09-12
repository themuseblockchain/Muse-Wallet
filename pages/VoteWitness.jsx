import React, {Component, PropTypes} from 'react'
import { hashHistory  } from 'react-router'

import {isLoggedIn} from '../helpers/Authentication.jsx'
import {getUserInformation} from '../helpers/Authentication.jsx'

import muse from 'museblockchain-js';

class VoteWitness extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            witness_name: '',
            witnessVotes: [],
            witnessByVotes: []
        };

        this.changeWitnessName = this.changeWitnessName.bind(this);

        this.callbackUserInfo = this.callbackUserInfo.bind(this);
        this.callbackWitnessbyVotes = this.callbackWitnessbyVotes.bind(this);
        this.callbackWitnessVote = this.callbackWitnessVote.bind(this);

        this.witnessVote = this.witnessVote.bind(this);

        this.witnessUnVoteOne = this.witnessUnVoteOne.bind(this);
        this.witnessVoteOne = this.witnessVoteOne.bind(this);
    }

    componentWillMount() {
        if(!isLoggedIn()) {
            hashHistory.push('/login');
        }

        let username = window.localStorage.getItem('username');
        let userInfo = muse.accountInfo(username, this.callbackUserInfo);

        muse.witnessesByVote(50, null, this.callbackWitnessbyVotes)
        //muse.witnessInfo(username, this.callbackWitnessbyVotes)
    }

    callbackWitnessbyVotes(code, message, data){
        console.log(message);
        console.log(data);
        this.setState({witnessByVotes: data });
    }

    callbackWitnessVote(code, message){
        console.log(code);
        console.log(message);
        if(code == 1){
            window.location.reload();
        } else {
            alert("Unable to vote. please try again");
        }
        this.setState({loading: false });
    }

    callbackUserInfo(res, message, data) {
        console.log(data);
        this.setState({witnessVotes: data.witnessVotes });
    }

    changeWitnessName(e) {
        let witnessName = e.target.value;
        this.setState({ witness_name: witnessName });
    };

    witnessVote() {
        if(this.state.witness_name == ""){
            alert("Please input the Witness name to vote");
            return false;
        }

        this.setState({loading: true});

        let username = window.localStorage.getItem('username');
        let password = window.localStorage.getItem('password');

        muse.witnessVote(username, password, this.state.witness_name, 1, this.callbackWitnessVote);
    }

    witnessVoteOne(witness_name){
        this.setState({loading: true});
        console.log(witness_name);

        let username = window.localStorage.getItem('username');
        let password = window.localStorage.getItem('password');

        muse.witnessVote(username, password, witness_name, 1, this.callbackWitnessVote);
    }

    witnessUnVoteOne(witness_name){
        this.setState({loading: true});

        let username = window.localStorage.getItem('username');
        let password = window.localStorage.getItem('password');

        muse.witnessVote(username, password, witness_name, 0, this.callbackWitnessVote);
    }


    render() {
        let account_witness_votes = this.state.witnessVotes;
        let that = this;
        return (
            <div className="wallet-container margin-top-50 margin-bottom-65 tabs-wrapper">
                <h3>Witness Voting</h3>
                <h6>As a MUSE holder you get 30 witness votes, use them wisely.</h6>
                <h6>You have   {30 - this.state.witnessVotes.length}   witness votes left.</h6>
                <div className="margin-top-50">
                    
                    <table className="table table-hover table-striped">
                        <thead>
                            <td></td>
                            <td></td>
                            <td>Witness</td>
                            <td>Last Minted Block</td>
                            <td>Information</td>
                        </thead>
                        <tbody>
                            {this.state.witnessByVotes.map(function (i, ind) {
                                let button = null;
                                if(account_witness_votes.indexOf(i.owner) > -1){
                                    button = <button className="btn btn-success btn-sm" onClick={that.witnessUnVoteOne.bind(this, i.owner)}><i className="fa fa-thumbs-up"></i></button>;
                                } else {
                                    button = <button className="btn btn-outline-primary btn-sm" onClick={that.witnessVoteOne.bind(this, i.owner)}><i className="fa fa-thumbs-up"></i></button>;
                                }
                                return (
                                    <tr>
                                        <td>{ind+1}</td>
                                        <td>{button}</td>
                                        <td width="50%">{i.owner}</td>
                                        <td>{i.last_confirmed_block_num}</td>
                                        <td><a href={i.url} target="_blank">{i.url}</a></td>

                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="margin-top-50">
                    <p>If you whould like to vote for a witness outside of the top 50, enter the account name below to cast a vote.</p>
                    <div className="col-lg-6">
                        <div className="input-group">
                            <span className="input-group-addon">@</span>
                            <input type="text" className="form-control" aria-label="Text input with checkbox" onChange={this.changeWitnessName} />
                            <span className="input-group-btn">
                                <button className="btn btn-primary" type="button" onClick={this.witnessVote} >VOTE</button>
                            </span>
                        </div>
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

export default VoteWitness;