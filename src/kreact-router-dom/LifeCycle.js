import React, { Component } from 'react'

export default class LifeCycle extends Component {
    componentDidMount(){
        if(this.props.onMount){
            this.props.onMount.call(this,this);
        }
    }

    componentWillUnmount(){
        if(this.props.onUnmount){
            this.props.onUnmount.call(this,this);
        }
    }

    componentDidUpdate(preProps){
        if(this.props.onUpdate){
            this.props.onUpdate.call(this,this,preProps);
        }
    }
    render() {
        return null;
    }
}
