import React from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import loginScreen from './components/loginScreen';
import homeScreen from './components/homeScreen';
import popupScreen from './components/popupScreen';

const AppNavigator = createStackNavigator({
    Popup:{screen:popupScreen},
    Login:{screen:loginScreen},
    Home:{screen:homeScreen},
    
  })

  const MainNavigator = createStackNavigator(
    {
      Popup:{screen:popupScreen},
      Login:{screen:loginScreen},
      Home:{screen:homeScreen},
      
    },
    {
    defaultNavigationOptions: {
    gesturesEnabled: false,
    },
    headerMode: 'none',
    },
    );
  
const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
