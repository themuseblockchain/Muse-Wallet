import React, {Component, PropTypes} from 'react'
import { hashHistory  } from 'react-router'

import {isLoggedIn} from '../helpers/Authentication.jsx'

import StepZilla from 'react-stepzilla';
import Step1 from './Step1.jsx'
import Step2 from './Step2.jsx'
import Step3 from './Step3.jsx'
import Step4 from './Step4.jsx'

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.sampleStore = {
            email: '',
            phone: '',
            account_name: '',
            account_pwd: '',
            savedToCloud: false
        };
    }

    componentWillMount() {
        
    }

    componentWillUnmount() {}

    getStore() {
        return this.sampleStore;
    }

    updateStore(update) {
        //this.sampleStore = {email: update.userInput.email, gender: update.userInput.gender, savedToCloud: update.userInput.savedToCloud}
        this.sampleStore = Object.assign(this.sampleStore, update);
    }

    render() {
        const steps =
        [
            {name: 'EMAIL', component: <Step1 getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
            {name: 'PHONE', component: <Step2 getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
            {name: 'MUSE ACCOUNT', component: <Step3 getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
            {name: 'FINISHED', component: <Step4 getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
        ]
        
        return (
            <div className="dashboard-container">
                <div className='step-progress'>
                    <StepZilla
                        steps={steps}
                        preventEnterSubmission={true}
                        nextTextOnFinalActionStep={"Save"}
                        hocValidationAppliedTo={[2]}
                        prevBtnOnLastStep={false}
                    />
                </div>
            </div>
        )
    }
}

export default Register;