/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import  AppContainer from './router';
//import Notificationhandler from './components/notificationhandler';


class App extends React.Component{
  componentDidMount() {
    SplashScreen.hide();
  }
  render(){
    return <AppContainer />;
    }
};


export default App;
