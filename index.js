/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {AuthContextProvider} from './src/utlis/AuthContext';

const RootApp = () => (
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);

AppRegistry.registerComponent(appName, () => RootApp);
