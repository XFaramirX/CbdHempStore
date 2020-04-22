import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from '../src/lib/redux';

import InboxScreen from '../components/CustomComponents/inboxScreen/InboxScreen';

class Inicio extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Provider store={store}>
        <h1>Hello World</h1>
      </Provider>
    );
  }
}

export default Inicio;
