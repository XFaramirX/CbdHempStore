import React from 'react';
import { Provider } from 'react-redux';
import store from '../src/lib/redux';

import InboxScreen from '../components/CustomComponents/inboxScreen/InboxScreen';

function App() {
  return (
    <Provider store={store}>
      <InboxScreen />
    </Provider>
  );
}
export default App;
