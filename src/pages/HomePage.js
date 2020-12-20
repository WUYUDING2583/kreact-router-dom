import React, { Component } from 'react'
import { withRouter } from '../kreact-router-dom';

class HomePage extends Component {
    render() {
        console.log("HomePage",this.props);
        return (
            <div>
                HomePage
            </div>
        )
    }
}

export default withRouter(HomePage);