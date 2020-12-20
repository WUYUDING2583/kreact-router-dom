import React, { Component } from 'react'
import { matchPath } from 'react-router-dom';
import RouterContext from './RouterContext'

export default class Route extends Component {
    render() {
        return (
            <RouterContext.Consumer>
                {context => {
                    const { location } = context;
                    const { children, component, render, path, computedMatch } = this.props;
                    const match = computedMatch
                        ? computedMatch
                        : path
                            ? matchPath(location.pathname, this.props)
                            : context.match;
                    const props = {
                        ...context,
                        location,
                        match
                    };
                    return (
                        <RouterContext.Provider value={props}>
                            {match
                                ? children
                                    ? typeof children === "function"
                                        ? children(props)
                                        : children
                                    : component
                                        ? React.createElement(component, props)
                                        : render
                                            ? render(props)
                                            : null
                                : typeof children === "function"
                                    ? children(props)
                                    : null}

                        </RouterContext.Provider>
                    );
                }}
            </RouterContext.Consumer>
        )
    }
}
