/**
 * @format
 */

import {AppRegistry} from 'react-native';
//import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';
import {sendPingResponseToServer} from './components/responseToNotification';
// Register background handler
/*messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    sendPingResponseToServer(remoteMessage);
});*/

if (!__DEV__) {
    global.console = {
        info: () => {},
        log: () => {},
        assert: () => {},
        warn: () => {},
        debug: () => {},
        error: () => {},
        time: () => {},
        timeEnd: () => {},
    };
}


  
AppRegistry.registerComponent(appName, () => App);
