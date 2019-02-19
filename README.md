# react-anti

React Anti Component (confirm, alert, loading, ...)

## Install

`npm install react-anti` or `yarn add react-anti`

## Example

```js
import React from 'react';
import ReactDOM from 'react-dom';
import anti from 'react-anti';

let Alert = anti(props => <div>[React Anti]: Hello {props.name}</div>);

class App extends React.Component {
  state = {
    name: 'Alice'
  };
  render() {
    return (
      <div>
        <Alert name={this.state.name} />
        <button onClick={() => Alert.show()}>show</button>
        <button onClick={() => Alert.hide()}>hide</button>
        <button onClick={() => (Alert.visible = !Alert.visible)}>toggle</button>
        <button onClick={() => this.setState({ name: 'Bob' })}>change name</button>
      </div>
    );
  }
}
const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
```
