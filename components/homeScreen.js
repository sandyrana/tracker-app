import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  InteractionManager,
  PermissionsAndroid,
  Platform,
  Alert,
  BackHandler,
  AppState
} from 'react-native';
import {
  Container,
  Header,
  Title,
  // Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Left,
  Body,
  Right
} from 'native-base';
import MapView, { Marker,PROVIDER_GOOGLE } from 'react-native-maps';

import UUIDGenerator from 'react-native-uuid-generator';

import {requestMultiple, PERMISSIONS} from 'react-native-permissions';


//import BackgroundGeolocation from "react-native-background-geolocation";

import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';


import * as asyncstorage from '../utils/asyncstorage';

import * as constant from '../utils/contacts';

import DeviceInfo from 'react-native-device-info';

import Geolocation from 'react-native-geolocation-service';

import TrackingDot from '../assets/images/TrackingDot.png';

import {sendPingResponseToServer} from './responseToNotification';

//import firebase from 'react-native-firebase';

//import PushNotification from "react-native-push-notification";

//import PushNotificationIOS from '@react-native-community/push-notification-ios';


//import {Notifications} from 'react-native-notifications';

import RNSettings from 'react-native-settings';

import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';

//import firebase from '@react-native-firebase/app';
//import messaging from '@react-native-firebase/messaging';
import {Global} from './Global';

const androidConfig = {
  clientId:Global.clientIdAndroid,
  appId:Global.appIdAndroid,
  apiKey:Global.apiKeyAndroid,
  databaseURL: Global.databaseURL,
  storageBucket:Global.storageBucket,
  messagingSenderId:Global.messagingSenderId,
  projectId:Global.projectId
};

const iosConfig = {
  clientId:Global.clientIdiOS,
  appId:Global.appIdiOS,
  apiKey:Global.apiKeyiOS,
  databaseURL: Global.databaseURL,
  storageBucket:Global.storageBucket,
  messagingSenderId:Global.messagingSenderId,
  projectId:Global.projectId
};


if (!__DEV__ && Platform.OS !== "android") {
  try {
    console = {}
    console.assert = () => {}
    console.info = () => {}
    console.log = () => {}
    console.warn = () => {}
    console.error = () => {}
    console.time = () => {}
    console.timeEnd = () => {}

    global.console = console
  } catch (err) {}
}

export default class homeScreen extends Component {
   constructor(){
    super()

    this.state = {
      loading: true,
      uuid:'',
      latitude: 0,
      longitude: 0,
      error: null, 
      userdata:[],
      serverAddress:"",
      deviceId:"",
      locationpermission:false,
      maxZoomLevel:10,
  
      region: null,
      locations: [],
      stationaries: [],
      isRunning: false,
      database:'',
  
      interval:1000,
      lastspeed:0,
      deviceToken:"",

      appState: AppState.currentState,
      permissions:{},

      dynamicconstant:{},
      visible:false,
      dialogcanshow:false
    }
    var thats = this;


  }

  pingResponseFromDevice = (randomId, isRunning, gpsEnabled, deviceId, fUser, userid, database) => {
    console.log(randomId);
    console.log(isRunning);
    console.log(gpsEnabled);
    console.log(deviceId);
    console.log(fUser);
    console.log(userid);
    console.log(database);

    const {dynamicconstant} = this.state;

    //applying ajax for devicetoken update
    var url = this.state.serverAddress+constant.constantdata.PING_CALLBACK_URL;
    //var url = this.state.serverAddress+dynamicconstant.PING_CALLBACK_URL;
    var data = {
      deviceId: deviceId,
      randomid: randomId,
      fuser: fUser,
      userid:userid,
      isrunning:isRunning,
      database:database,
      isgpsenabled:gpsEnabled
      }
      console.log(data);
      console.log(url);

      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((response) => response.json()
      )
      .then((responseJson) => {
        //console.warn(responseJson);
        //BackgroundGeolocation.start(); //triggers start on start event
      })
      .catch((error) => {
        console.error(error);
      });


  }
  
  backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => BackHandler.exitApp() }
    ]);
    return true;
  };


  static navigationOptions = {
    title: 'Home',
    headerShown: false,
    };

  
    requestCameraPermission = async() =>  {
      var that = this;
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'This application collects location data to enable Tracking Feature even when the App is closed or not in use.',
            message:
              'This application collects location data to enable Tracking Feature even when the App is closed or not in use.' ,
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //console.log('You can use the location');
          that.setState({locationpermission:true});
        } else {
          //console.log('Location permission denied');
          that.setState({locationpermission:false});
        }
      } catch (err) {
       // console.warn(err);
      }
    }

    requestLocationPermission = async() => {

     if(this.state.dialogcanshow===true){
       this.setState({visible:true});
     }else{
      var that = this;
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            title: 'This application collects location data to enable Tracking Feature even when the App is closed or not in use.',
            message:
              'This application collects location data to enable Tracking Feature even when the App is closed or not in use.' ,
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //console.log('You can use the location');
          that.setState({locationpermission:true});
        } else {
          //console.log('Location permission denied');
          that.setState({locationpermission:false});
        }
      } catch (err) {
       // console.warn(err);
      }
     }

      
    }
  

  
  componentDidMount = async() => {
    
    const {dynamicconstant} = this.state;
    var dialogshow = await asyncstorage.getData("dialogshow");
    
    if(dialogshow!=="1"){
      if(Platform.OS==='android'){
          this.setState({dialogcanshow:true});
      }
    }
    /*requestMultiple([PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION]).then((statuses) => {
      console.log(statuses);
    });*/

    console.log("global values---->");
    console.log(Global);

    AppState.addEventListener('change', this._handleAppStateChange);

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
    
    if(Platform.OS=='android' &&  dialogshow==="1"){
      
      
    }else
    {
      this.setState({visible:true});
      return;
    }
    var deviceId = DeviceInfo.getUniqueId();
    //console.warn(deviceId);
    
    await asyncstorage.storeData("deviceId", deviceId);

    DeviceInfo.getBatteryLevel().then(batteryLevel => {
      
    // 0.759999
    });
    
    var isLoggedin = await asyncstorage.getData("isLoggedIn");
    
    var userData = await asyncstorage.getData("userData");

    var database = await asyncstorage.getData("database");

    var dynamicconstantasync = await asyncstorage.getData("dynamicconstant");

    console.log("dynamic constant data--->");
    console.log(dynamicconstantasync);

    if(typeof dynamicconstantasync!='undefined' && dynamicconstantasync){
        this.setState({dynamicconstant:JSON.parse(dynamicconstantasync)});
    }
    
    var serverAddressdata = await asyncstorage.getData("serverAddress");
    this.setState({serverAddress:serverAddressdata})

    this.setState({
      userdata:JSON.parse(userData),
      deviceId:deviceId,
      database:database
    })

    var that = this;
    InteractionManager.runAfterInteractions(() => {
      this.setState({ loading: false });
    });
  //}

  //let deviceInfo = await BackgroundGeolocation.getDeviceInfo();
  

    function logError(msg) {
      console.log(`[ERROR] getLocations: ${msg}`);
    }

    const handleHistoricLocations = locations => {
      let region = null;
      const now = Date.now();
      const latitudeDelta = 0.01;
      const longitudeDelta = 0.01;
      const durationOfDayInMillis = 24 * 3600 * 1000;

      const locationsPast24Hours = locations.filter(location => {
        return now - location.time <= durationOfDayInMillis;
      });

      if (locationsPast24Hours.length > 0) {
        // asume locations are already sorted
        const lastLocation =
          locationsPast24Hours[locationsPast24Hours.length - 1];
        region = Object.assign({}, lastLocation, {
          latitudeDelta,
          longitudeDelta
        });
      }
      this.setState({ locations: locationsPast24Hours, region });
    };

    //var url = this.state.serverAddress+constant.constantdata.SERVER_PATH;
    var url = this.state.serverAddress+dynamicconstant.SERVER_PATH;

    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 20,
      distanceFilter: 20,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: false,
      startOnBoot: true,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.RAW_PROVIDER,
      //locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
      interval: 1000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
      
    });

    BackgroundGeolocation.on('location', (location) => {
      
      
      
      if(Platform.OS=='ios'){
        // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask(taskKey => {

        //console.warn("this is location");
       // console.warn(location);

        this.updateDeviceToken();
      
        this.setState({
          latitude: location.latitude,
          longitude: location.longitude,
          maxZoomLevel:17
        });
        this.sendCoordinatesToServer(location);


        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        BackgroundGeolocation.endTask(taskKey);
      });
      }else{
       // console.warn("this is location");
       // console.warn(location);

        this.updateDeviceToken();
      
        this.setState({
          latitude: location.latitude,
          longitude: location.longitude,
          maxZoomLevel:17
        });
        this.sendCoordinatesToServer(location);
      }

      
    });

    BackgroundGeolocation.on('stationary', (location) => {
      // handle stationary locations here
      //console.warn("this is stationary");
      //console.warn(location);
      Actions.sendLocation(stationaryLocation);


      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask(taskKey => {

      //console.warn("this is location1");
     // console.warn(location);


      
        this.setState({
          latitude: location.latitude,
          longitude: location.longitude,
          maxZoomLevel:17
        });
        this.sendCoordinatesToServer(location);


        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        BackgroundGeolocation.endTask(taskKey);
      });

      
    });

    BackgroundGeolocation.on('error', (error) => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
      BackgroundGeolocation.getConfig(function(config) {
                  console.log(config);
                });
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation service has been stopped');

    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(() =>
          Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
            { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
          ]), 1000);
      }
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
    });

    BackgroundGeolocation.on('abort_requested', () => {
      console.log('[INFO] Server responded with 285 Updates Not Required');

      // Here we can decide whether we want stop the updates or not.
      // If you've configured the server to return 285, then it means the server does not require further update.
      // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
      // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
    });

    BackgroundGeolocation.on('http_authorization', () => {
      console.log('[INFO] App needs to authorize the http requests');
    });

    BackgroundGeolocation.checkStatus(status => {
      console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
      console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
      console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
      }
    });

    //this.checkPermission();
    //this.createNotificationListeners(); //add this line

    var that = this;

    //firebase notification
    /*if(!firebase.apps.length){
      firebase.initializeApp(Platform.OS==='ios' ? iosConfig : androidConfig)
    }*/

    //await messaging().registerDeviceForRemoteMessages();
    
    /*const fcmToken = await messaging().getToken();
    if(fcmToken){
      console.log("token-->"+fcmToken);
      //this.setState("deviceToken", fcmToken);
      if(typeof fcmToken != undefined){
          that.updateDeviceToken(fcmToken);
      }
    }else{
      console.log("failed", "No token recieved")
    }*/

    
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

   /* messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        //setLoading(false);
      });


      messaging().onMessage(async remoteMessage => {
        console.log("notification data--->");
        console.log(remoteMessage);
        sendPingResponseToServer(remoteMessage);
       // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      });

      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
        navigation.navigate(remoteMessage.data.type);
      });*/

      
      

  }

  


  

  updateDeviceToken = (token) => {
    console.log(token);
    this.setState({deviceToken:token});
    console.log("here in update device token");
    const {serverAddress, userdata, deviceId, database, dynamicconstant} = this.state;

    console.log("this is componnent will moiunt");
    console.log(this.state.deviceToken);
    console.log(this.state.deviceId);

    var fUser = this.state.userdata.body.fUser;
    var userId = this.state.userdata.body.ID;
    console.log(fUser);
    console.log(userId);

    //applying ajax for devicetoken update
    var url = this.state.serverAddress+constant.constantdata.GCM_REGISTRATION_TO_SERVER_URL;

    //var url = this.state.serverAddress+this.state.dynamicconstant.GCM_REGISTRATION_TO_SERVER_URL;

    var data = {
      deviceId: this.state.deviceId,
      tokenID: this.state.deviceToken,
      fuser: fUser,
      userid:userId,
      devicetype:Platform.OS,
      database:database
      }
      console.log(data);
      console.log(url);

      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((response) => response.json()
      )
      .then((responseJson) => {
        //console.warn(responseJson);
        //BackgroundGeolocation.start(); //triggers start on start event
      })
      .catch((error) => {
        console.error(error);
      });
  }

  setRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: 0.04,
    longitudeDelta: 0.05,
  });

  // You must remove listeners when your component unmounts
  componentWillUnmount() {
    BackgroundGeolocation.removeAllListeners();
    this.notificationListener;
    this.notificationOpenedListener;

    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  
  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
    }
    this.setState({appState: nextAppState});
  }

  sendCoordinatesToServer = (location) => {
    this.setState({lastspeed:location.speed});
    const {serverAddress, userdata, deviceId, database, dynamicconstant} = this.state;
    var url = serverAddress+constant.constantdata.SERVER_PATH;

   ///var url = serverAddress+dynamicconstant.SERVER_PATH;
    console.log("sending coordinates to server method==>");
    console.log(url);

    //console.log(url);
    var latitude = location.latitude;
    var longitude = location.longitude;
    var accuracy = location.accuracy;
    var speed = location.speed;
    var battery = 100;
    var date = new Date().toISOString();
    var fUser = userdata.body.fUser;
    var userId = userdata.body.ID;
    
    // console.log(JSON.stringify({
    //   deviceId: deviceId,
    //   latitude: latitude,
    //   longitude: longitude,
    //   date: date,
    //   fake: 0,
    //   fUser: fUser,
    //   userId:userId
    //   //geoData:location["coords"]
     
    // }));

    
var data = {
    deviceId: deviceId,
    latitude: latitude,
    longitude: longitude,
    date: date,
    fake: 0,
    fUser: fUser,
    userId:userId,
    accuracy:accuracy.toString(),
    database:database,
    speed:speed,
    battery:battery
    //geoData:location["coords"]
  }

var data1 = [];
data1.push(data);
console.log("here in data");
console.log(JSON.stringify(data1));
console.log(url);
if(speed > 0){
  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data1),
  }).then((response) => {
    //console.warn("hi ashu");
    //console.warn(response);
    response.json()
  }
  )
  .then((responseJson) => {
    console.log(responseJson);
    //BackgroundGeolocation.start(); //triggers start on start event
  })
  .catch((error) => {
    console.error(error);
  });
}

 


  }

  updateDialogStatus = async() => {
    console.log("this is update dialog status");
    this.setState({visible:false});
    asyncstorage.storeData("dialogshow", "1");
    
      await this.requestCameraPermission();
      await this.requestLocationPermission();
    
    
}


  render() {
    const { width, height } = Dimensions.get('window');
    const ratio = width / height;
    const { locations, stationaries, region, isRunning } = this.state;

    return (
      <Container>
        <Header>
            <Title style={{marginTop:10}}>Tracker Home</Title>
          
        </Header>

        <View style={styles.container}>
          {this.state.loading ? (
            <Loading />
          ) : (
            <MapView
              style={styles.map}
              //initialRegion={coordinates}
              initialRegion={this.setRegion()}
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              region={this.setRegion()}
              maxZoomLevel={this.state.maxZoomLevel}
            >
               <Marker coordinate={this.setRegion()} />
              <Text style={{justifyContent:"center", alignItems:"center", alignContent:"center", flex:1, flexDirection:"row", textAlign:"center", marginTop:10, fontWeight:"bold"}}>UUID: {this.state.uuid}</Text>
            </MapView>
          )}
        </View>

        <Dialog
                visible={this.state.visible}
                footer={
                <DialogFooter>
                    <DialogButton
                    text="CANCEL"
                    onPress={() => { this.updateDialogStatus() }}
                    />
                    <DialogButton
                    text="OK"
                    onPress={() => { this.updateDialogStatus() }}
                    />
                </DialogFooter>
                }
            >
                <DialogContent style={{padding:20}}>
                <Text style={{padding:20 }}>This application collects location data to enable Tracking Feature even when the App is closed or not in use.</Text>
                </DialogContent>
            </Dialog>
      </Container>
    );
  }
}

const Loading = () => (
  <View style={styles.container}>
    <Text>Loading...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    marginTop: 1.5,
    ...StyleSheet.absoluteFillObject,
  },
});