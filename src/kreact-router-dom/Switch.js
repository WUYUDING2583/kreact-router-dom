import React, { Component } from 'react';
import RouterContext from './RouterContext';
import matchPath from "./matchPath";

export default class Switch extends Component {
    render() {
        return (
            <RouterContext.Consumer>
                {context => {
                    let match;
                    let element;
                    React.Children.forEach(this.props.children, child => {
                        if (match == null) {
                            element = child;
                            match = child.props.path
                                ? matchPath(context.location.pathname, child.props)
                                : context.match;
                        }
                    });
                    return React.cloneElement(element, { computedMatch: match });
                }}
            </RouterContext.Consumer>
        )
    }
}
