import React, {Component} from 'react';

export default class App extends Component {
    render() {
        let state = this.props.getState();

        return (
            <div>
                <h1>Hello World</h1>
                <ul>
                    {state.history.map((item, index) => (
                        <li key={index}>{item.file} ({item.action})</li>
                    ))}
                </ul>
            </div>
        );
    }
}
