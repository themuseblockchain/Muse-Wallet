import React, {Component, PropTypes} from 'react'
import { hashHistory  } from 'react-router'

import {isLoggedIn} from '../helpers/Authentication.jsx'
import {getUserInformation} from '../helpers/Authentication.jsx'
import crypto from 'crypto-js'

import muse from 'museblockchain-js';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import randomString from 'random-string';

class Wallet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            walletInfo: [],
            accountInfo: [],
            dropdownOpen: false,
            dropdownOpenVM: false,
            dropdownOpenMD: false,
            modalTransfer: false,
            modalTransferVesting: false,
            modalWithdrawVesting: false,
            toAccount: "",
            amount: "",
            memo: "",
            loading: false,
            isBasicPrivKeyShow: false,
            isActivePrivKeyShow: false,
            isOwnerPrivKeyShow: false,
            isMemoPrivKeyShow: false,
            keyInfo: [],
            walletHistory: [],
            newRandPassword: '',
            inputCurrentPassword: '',
            inputConfirmPassword: '',
            defaultTabInd: 0
        };

        this.callbackUserInfo = this.callbackUserInfo.bind(this);
        this.callbackFullUserInfo = this.callbackFullUserInfo.bind(this);
        this.callbackTransferFunds = this.callbackTransferFunds.bind(this);
        this.callbackTransferVestingFunds = this.callbackTransferVestingFunds.bind(this);
        this.callbackWithdrawVesting = this.callbackWithdrawVesting.bind(this);
        this.callbackWalletHistory = this.callbackWalletHistory.bind(this);
        this.callbackUpdatePassword = this.callbackUpdatePassword.bind(this);

        this.toggle = this.toggle.bind(this);
        this.toggleVM = this.toggleVM.bind(this);
        this.toggleMD = this.toggleMD.bind(this);

        this.transferFct = this.transferFct.bind(this);
        this.transferToVestFct = this.transferToVestFct.bind(this);
        this.withdrawVestingFct = this.withdrawVestingFct.bind(this);

        this.toggleModalTransfer = this.toggleModalTransfer.bind(this);
        this.toggleModalTransferVesting = this.toggleModalTransferVesting.bind(this);
        this.toggleModalWithdrawVesting = this.toggleModalWithdrawVesting.bind(this);

        this.transferToAccountProc = this.transferToAccountProc.bind(this);
        this.transferToVestingProc = this.transferToVestingProc.bind(this);
        this.withdrawVestingProc = this.withdrawVestingProc.bind(this);

        this.changeToAccount = this.changeToAccount.bind(this);
        this.changeAmount = this.changeAmount.bind(this);
        this.changeMemo = this.changeMemo.bind(this);
        this.changeCurrentPassword = this.changeCurrentPassword.bind(this);
        this.changeConfirmPassword = this.changeConfirmPassword.bind(this);

        this.handleBasicPrivKeyShow = this.handleBasicPrivKeyShow.bind(this);
        this.handleActivePrivKeyShow = this.handleActivePrivKeyShow.bind(this);
        this.handleOwnerPrivKeyShow = this.handleOwnerPrivKeyShow.bind(this);
        this.handleMemoPrivKeyShow = this.handleMemoPrivKeyShow.bind(this);

        this.defaultHistoryFormatter = this.defaultHistoryFormatter.bind(this);
        this.generateNewPassword = this.generateNewPassword.bind(this);

        this.updatePassword = this.updatePassword.bind(this);
    }

    handleBasicPrivKeyShow() {
        this.setState({
            isBasicPrivKeyShow: !this.state.isBasicPrivKeyShow
        });
    }

    handleActivePrivKeyShow() {
        this.setState({
            isActivePrivKeyShow: !this.state.isActivePrivKeyShow
        });
    }

    handleOwnerPrivKeyShow() {
        this.setState({
            isOwnerPrivKeyShow: !this.state.isOwnerPrivKeyShow
        });
    }

    handleMemoPrivKeyShow() {
        this.setState({
            isMemoPrivKeyShow: !this.state.isMemoPrivKeyShow
        });
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    toggleVM() {
        this.setState({
            dropdownOpenVM: !this.state.dropdownOpenVM
        });
    }

    toggleMD() {
        this.setState({
            dropdownOpenMD: !this.state.dropdownOpenMD
        });
    }

    toggleModalTransfer() {
        this.setState({
            modalTransfer: !this.state.modalTransfer
        });
    }

    toggleModalTransferVesting() {
        this.setState({
            modalTransferVesting: !this.state.modalTransferVesting
        });
    }

    toggleModalWithdrawVesting() {
        this.setState({
            modalWithdrawVesting: !this.state.modalWithdrawVesting
        });
    }

    componentWillMount() {
        if(!isLoggedIn()) {
            hashHistory.push('/login');
        }

        let username = window.localStorage.getItem('username');
        let password = window.localStorage.getItem('password');
        let userInfo = muse.accountInfo(username, this.callbackUserInfo);
        let fulluserInfo = muse.api.getAccounts([username], this.callbackFullUserInfo);

        var key_to_use = muse.auth.getPrivateKeys(username, password, ["owner", "active", "basic", "memo"]);
        this.setState({keyInfo: key_to_use});

        muse.accountHistory(username, null, 1000, this.defaultHistoryFormatter, this.callbackWalletHistory);
    }

    callbackWalletHistory(code, message, result){
        this.setState({walletHistory: result.reverse()});
    }

    callbackUserInfo(res, message, data) {
        data.balance = data.balance.toFixed(6);
        data.vesting = data.vesting;

        this.setState({walletInfo: data });
    }

    callbackFullUserInfo(res, message, data) {

        //This exposes the vesting withdrawal data of the selected account but
        //should be used for all full details alternatively account info could have that data packed into it.
        //that would however require changes in the muse js lib not the wallet itself.

        data = message[0].next_vesting_withdrawal;

        this.setState({accountInfo: data.replace("T", " ") });

    }

    tryHandleError()
    {
        if(muse.lastError != null && muse.lastError.message != null)
        {
            // error
            //alert("It seems you were input the wrong account name or wrong amount. Please try again.");
            //console.log(muse.lastError.message.split("\n"));
            var lastErrorMsg = muse.lastError.message.split("\n");
            if(lastErrorMsg.length > 2){
                var tmpSplit = lastErrorMsg[1].split(":");
                if(tmpSplit.length > 1)
                {
                    alert(tmpSplit[1].split(".")[0]);
                    return true;
                }
                else
                {
                    alert(tmpSplit[0].split(".")[0]);
                    return true;
                }
            } else {
                alert(lastErrorMsg[0]);
                return true;
            }
        }
        else
        {
            return false;
        }
    }

    callbackTransferFunds(code, message) {
        if(code == -1){
            if(!this.tryHandleError())
            {
                alert('Unable to transfer funds');
            }
        } else if(code == 1){
            // success
            let username = window.localStorage.getItem('username');
            let userInfo = muse.accountInfo(username, this.callbackUserInfo);
            muse.accountHistory(username, null, 1000, this.defaultHistoryFormatter, this.callbackWalletHistory);
            this.toggleModalTransfer();
        } else if(code <= 0){
            // failure
            alert("Transfer funds was failed. Please try again.");
        }

        this.setState({loading: false});
    }

    callbackTransferVestingFunds(code, message){
        if(code == -1){
            if(!this.tryHandleError())
            {
                alert('Unable to transfer funds to vesting');
            }
        } else if(code == 1){
            // success
            let username = window.localStorage.getItem('username');
            let userInfo = muse.accountInfo(username, this.callbackUserInfo);
            muse.accountHistory(username, null, 1000, this.defaultHistoryFormatter, this.callbackWalletHistory);
            this.toggleModalTransferVesting();
        } else if(code <= 0){
            // failure
            alert("Transfer to Vesting was failed. Please try again.");
        }

        this.setState({loading: false});
    }

    callbackWithdrawVesting(code, message){
        if(code == -1){
            // error
            alert("It seems you were input the wrong account name or wrong amount. Please try again.");
        } else if(code == 1){
            // success
            let username = window.localStorage.getItem('username');
            let userInfo = muse.accountInfo(username, this.callbackUserInfo);
            this.toggleModalWithdrawVesting();
        } else if(code <= 0){
            // failure
            alert("Withdraw Vesting was failed. Please try again.");
        }

        this.setState({loading: false});
    }

    callbackUpdatePassword(code, message){
        if(code == 0){
            alert("Your password was reset correctly.");
        } else{
            alert("Sorry, There were some erros. Please try again.");;
        }

    }

    transferFct(){
        this.setState({toAccount: '', amount: '', memo: ''});
        this.toggleModalTransfer();
    }

    transferToVestFct(){
        this.setState({toAccount: '', amount: '', memo: ''});
        this.toggleModalTransferVesting();
    }

    withdrawVestingFct() {
        this.setState({toAccount: '', amount: '', memo: ''});
        this.toggleModalWithdrawVesting();
    }

    changeToAccount(e) {
        let toAccount = e.target.value;
        this.setState({ toAccount: toAccount });
    };

    changeAmount(e) {
        let amount = e.target.value;
        this.setState({ amount: amount });
    };

    changeMemo(e) {
        let memo = e.target.value;
        this.setState({ memo: memo });
    };

    changeCurrentPassword(e) {
        let pwd = e.target.value;
        this.setState({ inputCurrentPassword: pwd });
    };

    changeConfirmPassword(e) {
        let pwd = e.target.value;
        this.setState({ inputConfirmPassword: pwd });
    };

    transferToAccountProc() {
        let isValidated = true;

        if(this.state.toAccount == ""){
            isValidated = false;
            alert("Please input the account name ");
        }
        else if(this.state.amount == "" || isNaN(this.state.amount)){
            isValidated = false;
            alert("Please input the numeric value for the amount field");
        }
        else if(parseFloat(this.state.amount) > parseFloat(this.state.walletInfo.balance)){
            isValidated = false;
            alert("Please input the sufficient funds in the amount field.");
        }


        if(isValidated){
            this.setState({loading: true});

            let username = window.localStorage.getItem('username');
            let pwd = window.localStorage.getItem('password');
            var bytes  = crypto.AES.decrypt(pwd.toString(), username);
            var plaintext = bytes.toString(crypto.enc.Utf8);
            muse.transferFunds(username, plaintext, this.state.toAccount, Number(this.state.amount).toFixed(6), this.state.memo, this.callbackTransferFunds);
        }
    }

    transferToVestingProc() {

        let isValidated = true;

        if(this.state.amount == "" || isNaN(this.state.amount)){
            isValidated = false;
            alert("Please input the numeric value for the amount field");
        }
        else if(parseFloat(this.state.amount) > parseFloat(this.state.walletInfo.balance)){
            isValidated = false;
            alert("Please input the sufficient funds in the amount field.");
        }


        if(isValidated){
            this.setState({loading: true});

            let username = window.localStorage.getItem('username');
            let pwd = window.localStorage.getItem('password');
            var bytes  = crypto.AES.decrypt(pwd.toString(), username);
            var plaintext = bytes.toString(crypto.enc.Utf8);
            muse.transferFundsToVestings(username, plaintext, null, Number(this.state.amount).toFixed(6), this.callbackTransferVestingFunds);
        }
    }

    withdrawVestingProc() {

        let isValidated = true;

        if(this.state.amount == "" || isNaN(this.state.amount)){
            isValidated = false;
            alert("Please input the numberic value for the amount field");
        }
        else if(this.state.amount > this.state.walletInfo.vesting){
            isValidated = false;
            alert("Please input the sufficient vesting in the amount field.");
        }

        if(isValidated){
            this.setState({loading: true});

            let username = window.localStorage.getItem('username');
            let pwd = window.localStorage.getItem('password');
            var bytes  = crypto.AES.decrypt(pwd.toString(), username);
            var plaintext = bytes.toString(crypto.enc.Utf8);
            muse.withdrawVesting(username, plaintext, Number(this.state.amount).toFixed(6), this.callbackWithdrawVesting);
        }
        //this.toggleModalTransferVesting();
    }

    withdrawVestingCancelProc() {

    let username = window.localStorage.getItem('username');
    let pwd = window.localStorage.getItem('password');
    var bytes  = crypto.AES.decrypt(pwd.toString(), username);
    var plaintext = bytes.toString(crypto.enc.Utf8);
    muse.withdrawVesting(username, plaintext, Number(0).toFixed(6), this.callbackWithdrawVesting);

    }

    defaultHistoryFormatter(userName, operationName, date, operationData, additionnal) {
        var history_info = { name: operationName, date: date, raw: operationData };

        switch(operationName)
        {
        case "account_create":
            if(operationData.creator == userName)
            {
            history_info.text = 'Created Account ' + operationData.new_account_name;
            }
            else if(operationData.new_account_name == userName)
            {
            history_info.text = 'Account Creation';
            }
            break;
        case "transfer":
            if(operationData.to == userName)
            {
            history_info.text = 'Received ' + operationData.amount.split(" ")[0] + ' MUSE from ' + operationData.from;
            }
            else
            {
            history_info.text = 'Sent ' + operationData.amount.split(" ")[0] + ' MUSE to ' + operationData.to;
            }
            break;
        case "transfer":
            if(operationData.to == userName)
            {
            history_info.text = 'Received ' + operationData.amount.split(" ")[0] + ' MUSE from ' + operationData.from;
            }
            else
            {
            history_info.text = 'Sent ' + operationData.amount.split(" ")[0] + ' MUSE to ' + operationData.to;
            }
            break;

        case "transfer_to_vesting":
            if(operationData.to == userName)
            {
            //history_info.text = 'Received ' + operationData.amount.split(" ")[0] + ' VEST from ' + operationData.from;
            history_info.text = 'Transferred ' + operationData.amount.split(" ")[0] + ' MUSE to VEST';
            }
            else
            {
            history_info.text = 'Sent ' + operationData.amount.split(" ")[0] + ' VEST to ' + operationData.to;
            }
            break;
        case "withdraw_vesting":
            history_info.text = 'Withdrawing ' + operationData.vesting_shares.split(" ")[0] + ' VEST';
            break;
        case "account_witness_vote":

            if(operationData.approve)
            {
            history_info.text =  operationData.account +' Voted Witness ' + operationData.witness;
            }
            else
            {
            history_info.text = operationData.account + ' UnVoted Witness ' + operationData.witness;
            }
            break;
        case "witness_update":
            history_info.text = 'Witness Update';
            break;
        case "account_update":
            history_info.text = 'Account Update';
            break;
        case "content":
            history_info.text = 'Content Listed: URL: ' + operationData.url + ' Uploader: ' + operationData.uploader;
            break;
        case "fill_vesting_withdraw":
            history_info.text = 'Withdrawal of VESTS completed from account: ' + operationData.from_account + ' to account: ' + operationData.to_account + ' of ' + operationData.deposited.split(" ")[0] + ' MUSE.';
            break;
        case "custom_json":
            history_info.text = 'Custom Json ' + operationData.id + ' ' + operationData.json + ' ' + operationData.required_auths + ' ' + operationData.required_basic_auths;
            break;
        default:
            history_info.text = 'Unknown operation: ' + operationName;
        }

        return history_info;
    };

    generateNewPassword() {
        var new_pwd = randomString({length: 52, numeric: true, letters: true, special: true, exclude: ['`', '"', "'", ',']});
        this.setState({newRandPassword: new_pwd});
    }

    updatePassword(){
        let password = window.localStorage.getItem('password');

        var bytes  = crypto.AES.decrypt(password.toString(), username);
        var plaintext = bytes.toString(crypto.enc.Utf8);

        if(this.state.inputCurrentPassword == ""){
            alert("Please input the password.");
            return false;
        }
        else if(this.state.inputCurrentPassword != plaintext){
            alert("You were input the wrong password. Please input your current password correctly!");
            return false;
        }
        else if(this.state.newRandPassword == ""){
            alert("Please generate the radomized password");
            return false;
        }
        else if(this.state.inputConfirmPassword != this.state.newRandPassword){
            alert("The Re-entered generated password doesn't match with generated password. Please input correctly!");
            return false;
        }

        var new_keys = muse.auth.getPrivateKeys(this.state.walletInfo.userName, this.state.newRandPassword, ["owner", "active", "basic", "memo"]);
        muse.updateAccountKeys(this.state.walletInfo.userName, plaintext, new_keys.ownerPubkey, new_keys.activePubkey, new_keys.basicPubkey, new_keys.memoPubkey, this.callbackUpdatePassword );
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount(){

    }

    componentWillUnmount(){

    }

    componentDidUpdate(){
        if(this.props.getLayoutStates().change_pwd == true){
            this.setState({defaultTabInd: 2});
            this.props.updateLayoutStates({change_pwd: false})
        }
    }

    render() {
        return (
            <div className="wallet-container margin-top-50 margin-bottom-65 tabs-wrapper">
                <Tabs selectedIndex={this.state.defaultTabInd} onSelect={defaultTabInd => this.setState({ defaultTabInd })}>
                    <TabList>
                        <Tab>Balance</Tab>
                        <Tab>Permissions</Tab>
                        <Tab>Password</Tab>
                    </TabList>

                    <TabPanel>
                        <div className="row form-group margin-top-30">
                            <div className="col-md-9">
                                <h3>MUSE</h3>
                                <div className="text-muted">
                                    Tradeable tokens that may be transferred anywhere at anytime.<br/>MUSE can be vested by clicking transfer to Vesting.
                                </div>
                            </div>
                            <div className="col-md-3 text-right margin-top-30">

                                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                    <DropdownToggle caret>
                                        {this.state.walletInfo.balance} MUSE&nbsp;&nbsp;&nbsp;
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={this.transferFct}>Transfer</DropdownItem>
                                        <DropdownItem onClick={this.transferToVestFct}>Transfer to Vesting</DropdownItem>
                                        <DropdownItem disabled>Market(Coming soon)</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="row form-group margin-top-30">
                            <div className="col-md-9">
                                <h3>VESTING MUSE</h3>
                                <div className="text-muted">
                                    Tokens that grant you more influence within the network.
                                </div>
                            </div>
                            <div className="col-md-3 text-right">

                                <Dropdown isOpen={this.state.dropdownOpenVM} toggle={this.toggleVM}>
                                    <DropdownToggle caret>
                                        {this.state.walletInfo.vesting} MUSE&nbsp;&nbsp;&nbsp;
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={this.withdrawVestingFct}>Withdraw from Vesting</DropdownItem>
                                        <DropdownItem onClick={this.withdrawVestingCancelProc}>Cancel Withdraw from Vesting</DropdownItem>
                                    </DropdownMenu>

                                </Dropdown>
                            </div>
                        </div>

                        <div className="row form-group margin-top-30">
                            <div className="col-md-9">
                                <h3>MUSE DOLLARS</h3>
                                <div className="text-muted">
                                    Tokens worth about $1.00 of MUSE
                                </div>
                            </div>
                            <div className="col-md-3 text-right">
                                <Dropdown isOpen={this.state.dropdownOpenMD} toggle={this.toggleMD}>
                                    <DropdownToggle caret>
                                        $0 &nbsp;&nbsp;&nbsp;
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem disabled>Market (Coming soon)</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="row form-group margin-top-30">
                            <div className="col-md-9">
                                <h3>Next Withdrawal</h3>

                                <div className="text-muted">
                                  {this.state.accountInfo} CST

                                </div>
                            </div>
                        </div>

                        <div className="margin-top-50">
                            <h3>HISTORY</h3>
                            <table className="table table-hover table-striped">
                                <tbody>
                                    {this.state.walletHistory.map(function (i) {
                                        //console.log(i);
                                        return (
                                            <tr>
                                                <td width="30%">{(new Date(Date.parse(i.date)).toISOString().split('.')[0]).substr(0,10)}</td>

                                                <td>{i.text}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                    </TabPanel>
                    <TabPanel>
                        <div className="row form-group margin-top-30">
                            <div className="col-md-9">
                                <h5>BASIC</h5>
                                <h5>{this.state.isBasicPrivKeyShow ? this.state.keyInfo.basic : this.state.walletInfo.publicBasicKey}</h5>
                                <div className="text-muted">
                                    The basic key is used for non-financial functions such as voting, connection with other users and approving/declining proposed modifications to your data. It should be different from the active and owner keys.
                                </div>
                            </div>
                            <div className="col-md-3 text-right margin-top-30">
                                <button type="button" className="btn btn-sm btn-secondary" onClick={this.handleBasicPrivKeyShow}>{this.state.isBasicPrivKeyShow ? 'SHOW PUBLIC KEY' : 'SHOW PRIVATE KEY'}</button>
                            </div>
                        </div>

                        <div className="row form-group margin-top-30">
                            <div className="col-md-9">
                                <h5>ACTIVE</h5>
                                <h5>{this.state.isActivePrivKeyShow ? this.state.keyInfo.active : this.state.walletInfo.publicActiveKey}</h5>
                                <div className="text-muted">
                                    The active key is used for financial transactions and the creation of (or updates to) your data.<br/> It should be used from a secure workstation.
                                </div>
                            </div>
                            <div className="col-md-3 text-right margin-top-30">
                                <button type="button" className="btn btn-sm btn-secondary" onClick={this.handleActivePrivKeyShow}>{this.state.isActivePrivKeyShow ? 'SHOW PUBLIC KEY' : 'SHOW PRIVATE KEY'}</button>
                            </div>
                        </div>

                        <div className="row form-group margin-top-30">
                            <div className="col-md-9">
                                <h5>OWNER</h5>
                                <h5>{this.state.walletInfo.publicOwnerKey}</h5>
                                <div className="text-muted">
                                    The owner key is the master key for the account and is required to change the other keys.<br/>The private key or password for the owner key should be kept offline as much as possible.
                                </div>
                            </div>
                            <div className="col-md-3 text-right margin-top-30">
                                <p className="margin-top-30"></p>
                            </div>
                        </div>

                        <div className="row form-group margin-top-30">
                            <div className="col-md-9">
                                <h5>MEMO</h5>
                                <h5>{this.state.isMemoPrivKeyShow ? this.state.keyInfo.memo : this.state.walletInfo.publicMemoKey}</h5>
                                <div className="text-muted">
                                    The memo key is used to create and read memos.
                                </div>
                            </div>
                            <div className="col-md-3 text-right margin-top-30">
                                <button type="button" className="btn btn-sm btn-secondary" onClick={this.handleMemoPrivKeyShow}>{this.state.isMemoPrivKeyShow ? 'SHOW PUBLIC KEY' : 'SHOW PRIVATE KEY'}</button>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="margin-top-50">
                            <h3>Reset {this.state.walletInfo.userName}'s Password</h3><hr/>
                        </div>

                        <div className="margin-top-30 margin-bottom-30">
                            <div className="text-muted">
                                Do <b>not</b> lose your password.
                            </div>
                            <div className="text-muted">
                                We cannot recover your password.
                            </div>
                            <div className="text-muted">
                                If you can remember the password, It's not secure.
                            </div>
                            <div className="text-muted">
                                Use only randomly-generated passwords.
                            </div>
                            <div className="text-muted">
                                Do not tell anyone your password.
                            </div>
                            <div className="text-muted">
                                Always back up your password.
                            </div>
                        </div><hr/>

                        <div className="margin-top-50">

                            <div className="form-group margin-top-50">
                                <label for="account_name">ACCOUNT NAME / MuseID</label>
                                <input type="text" className="form-control" id="account_name" value={this.state.walletInfo.userName} disabled />
                            </div>

                            <div className="form-group margin-top-50">
                                <label for="current_password">CURRENT PASSWORD</label>
                                <input type="password" className="form-control" id="current_password" onChange={this.changeCurrentPassword}/>
                            </div>

                            <div className="form-group margin-top-50">
                                <label for="">GENERATED PASSWORD<span className="text-muted">(NEW)</span></label>
                                <div className="text-center">
                                    <h4><b>{this.state.newRandPassword}</b></h4>
                                </div>

                                <div className="margin-top-20 text-center">
                                    <button type="button" className="btn btn-secondary" onClick={this.generateNewPassword}>CLICK TO GENERATE PASSWORD</button>
                                </div>
                            </div>

                            <div className="form-group margin-top-50">
                                <label for="conf_password">RE-ENTER GENERATED PASSWORD</label>
                                <input type="password" className="form-control" id="conf_password" onChange={this.changeConfirmPassword}/>
                            </div>

                            <div className="form-group margin-top-50">
                                <label className="col-md-12">
                                <input type="checkbox" name="terms1" />
                                &nbsp;&nbsp;I UNDERSTAND THIS WALLET HOSTER CANNOT RECOVER LOST PASSWORDS
                                </label>
                                </div>

                                <div className="form-group">
                                <label className="col-md-12">
                                <input type="checkbox" name="terms2" />
                                &nbsp;&nbsp;I HAVE SECURELY SAVED MY GENERATED PASSWORD
                                </label>
                            </div>

                            <div className="form-group margin-top-50">
                                <button type="button" className="btn btn-primary" onClick={this.updatePassword}>UPDATE PASSWORD</button>
                            </div>

                        </div>
                    </TabPanel>

                </Tabs>

                <Modal isOpen={this.state.modalTransfer} toggle={this.toggleModalTransfer} className={this.props.className}>
                    <ModalHeader toggle={this.toggleModalTransfer}>Transfer to Account</ModalHeader>
                    <ModalBody>
                        <p>Move funds to another MUSE account.</p>

                        <div className="form-group row">
                            <label for="from-account" className="col-2 col-form-label">From</label>
                            <div className="col-10 input-group ">
                                <div className="input-group-addon">@</div>
                                <input className="form-control" type="text" value={getUserInformation()} id="from-account" disabled/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label for="to-account" className="col-2 col-form-label">To</label>
                            <div className="col-10 input-group ">
                                <div className="input-group-addon">@</div>
                                <input className="form-control" type="text" id="to-account" onChange={this.changeToAccount} />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label for="transfer-amount" className="col-2 col-form-label">Amount</label>
                            <div className="col-10 ">
                                <input className="form-control" type="text" id="transfer-amount" placeholder="Amount" onChange={this.changeAmount} />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label for="transfer-memo" className="col-2 col-form-label">Memo</label>
                            <div className="col-10 ">
                                <input className="form-control" type="text" id="transfer-memo" onChange={this.changeMemo} />
                            </div>
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.transferToAccountProc}>SUBMIT</Button>{' '}
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalTransferVesting} toggle={this.toggleModalTransferVesting} className={this.props.className}>
                    <ModalHeader toggle={this.toggleModalTransferVesting}>Transfer to Vesting</ModalHeader>
                    <ModalBody>
                        <p>Move funds to Vesting.</p>

                        <div className="form-group row">
                            <label for="from-account" className="col-2 col-form-label">From</label>
                            <div className="col-10 input-group ">
                                <div className="input-group-addon">@</div>
                                <input className="form-control" type="text" value={getUserInformation()} id="from-account" disabled/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label for="transfer-amount" className="col-2 col-form-label">Amount</label>
                            <div className="col-10 ">
                                <input className="form-control" type="text" id="transfer-amount" placeholder="Amount" onChange={this.changeAmount} />
                            </div>
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.transferToVestingProc}>SUBMIT</Button>{' '}
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalWithdrawVesting} toggle={this.toggleModalWithdrawVesting} className={this.props.className}>
                    <ModalHeader toggle={this.toggleModalWithdrawVesting}>Withdraw Vesting</ModalHeader>
                    <ModalBody>
                        <p>Withdraw Vesting. Please remember the decimal place moves 3 places to the left from VESTS to MUSE. Example 300000 VEST is 300 MUSE</p>

                        <div className="form-group row">
                            <label for="transfer-amount" className="col-2 col-form-label">Amount</label>
                            <div className="col-10 ">
                                <input className="form-control" type="text" id="transfer-amount" placeholder="Amount" onChange={this.changeAmount} />
                            </div>
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.withdrawVestingProc}>SUBMIT</Button>{' '}
                    </ModalFooter>
                </Modal>

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

export default Wallet;
