import React, { Component } from 'react'
import LifeCycle from './LifeCycle';
import RouterContext from './RouterContext'

export default class Prompt extends Component {
    render() {
        return (
            <RouterContext.Consumer>
                {context=>{
                    const {message,when}=this.props;
                    if(!when){
                        return null;
                    }
                    return <LifeCycle
                        onMount={self=>{
                            self.release=context.history.block(message);
                        }}
                        onUnmount={self=>{
                            self.release();
                        }}
                    />
                }}
            </RouterContext.Consumer>
        )
    }
}
