import React, {Component} from 'react';

import Header from '../pages/includes/Header.jsx';
import Footer from '../pages/includes/Footer.jsx';

// App component - represents the whole app
export default class LandingLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_scroll:  true,
        }

        this.layoutState = {
            change_pwd: false
        }
    }

    getLayoutStates() {
        return this.layoutState;
    }

    updateLayoutStates(update) {
        this.layoutState = Object.assign(this.layoutState, update);
    }

    updateDimensions() {
        if(document.body.clientHeight > window.innerHeight) {
            this.setState({ is_scroll: true});
        } else {
            this.setState({ is_scroll: false});
        }
    }

    /**
   * Add event listener
   */
    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    /**
    * Remove event listener
    */
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    render() {
        let that = this;
        const childWithProp = React.Children.map(this.props.children, (child) => {
            return React.cloneElement(child, {getLayoutStates: that.getLayoutStates.bind(that), updateLayoutStates: that.updateLayoutStates.bind(that)});
        });

        return (
            <div className="app">
                <div className="header">
                    <Header {...this.props} getLayoutStates={() => (this.getLayoutStates())} updateLayoutStates={(u) => {this.updateLayoutStates(u)}} />
                </div>
                <div className="container margin-top-50 margin-bottom-65">
                    {childWithProp}
                </div>

                <div className="footer-container">
                    <Footer />
                </div>
            </div>
        );
    }
}
