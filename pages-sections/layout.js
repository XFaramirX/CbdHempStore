import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from '../src/lib/redux';

class Inicio extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Provider store={store}>
        <h1>Hello World</h1>






        
        <style jsx>{`
          .container {
            margin: 50px;
          }
          p {
            color: blue;
          }
        `}</style>
        <style jsx global>{`
          h1 {
            font-size: 20px;
          }
        `}</style>
      </Provider>
    );
  }
}

export default Inicio;
