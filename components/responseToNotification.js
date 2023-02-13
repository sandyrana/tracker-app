import React, { Component } from 'react';
import {
  AppState
} from 'react-native';

import * as asyncstorage from '../utils/asyncstorage';

import * as constant from '../utils/contacts';

import RNSettings from 'react-native-settings';

import DeviceInfo from 'react-native-device-info';

export const sendPingResponseToServer = async(notificationData) => {
    console.log("here in send pign response data");
    console.log(notificationData);

    var randomId = notificationData.data.RandomId;

    var deviceId = await asyncstorage.getData("deviceId");
    var userData = await asyncstorage.getData("userData");
    userData = JSON.parse(userData);
    
    var database = await asyncstorage.getData("database");
    RNSettings.getSetting(RNSettings.LOCATION_SETTING).then(result => {
        var isRunninggps = 0;
        var isAppRunning = 0;
        if (result == RNSettings.ENABLED) {
          console.log('location is enabled');
          isRunninggps = 1;
        } else {
          console.log('location is disabled');
          isRunninggps = 0;
        }
        console.log("Current app state --->"+AppState.currentState);
        if(AppState.currentState=='active' || AppState.currentState=='background'){
          isAppRunning = 1;
        }
        //console.log(that.state.userdata.body.fUser);

        pingResponseFromDevice(randomId, isAppRunning, isRunninggps, deviceId, userData.body.fUser, userData.body.ID, database)

      });
}

export const pingResponseFromDevice = async(randomId, isRunning, gpsEnabled, deviceId, fUser, userid, database) => {

    console.log(randomId);
    console.log(isRunning);
    console.log(gpsEnabled);
    console.log(deviceId);
    console.log(fUser);
    console.log(userid);
    console.log(database);

    var serverAddressdata = await asyncstorage.getData("serverAddress");
    //applying ajax for devicetoken update
    var url = serverAddressdata+constant.constantdata.PING_CALLBACK_URL;

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
        console.warn(responseJson);
        //BackgroundGeolocation.start(); //triggers start on start event
      })
      .catch((error) => {
        console.error(error);
      });

}