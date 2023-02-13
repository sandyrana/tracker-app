import React, { Component, useEffect, useState } from 'react';
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

import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog';

import {requestMultiple, PERMISSIONS} from 'react-native-permissions';

import * as asyncstorage from '../utils/asyncstorage';

class Popup extends Component{

    constructor(props) {
        super(props);
        this.state = {
            visible:false
        };
      }
    
      componentDidMount = async() => {
        const {navigation} = this.props;
        var dialogshow = await asyncstorage.getData("dialogshow");
        
        if(dialogshow!=="1"){
        if(Platform.OS==='android'){
            this.setState({visible:true});
        }
        }else{
            navigation.navigate("Login");
        }
      }
     updateDialogStatus = async() => {
         
       // this.setState({visible:!this.state.visible});
        console.log("this is update dialog status");
        this.setState({visible:false});
        asyncstorage.storeData("dialogshow", "1");
    
        //await this.requestCameraPermission();
        //await this.requestLocationPermission();
        await this.requestLocation();
    }

   

       requestLocation = () => {
        const {navigation} = this.props;
        requestMultiple([PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION]).then((statuses) => {
            console.log(statuses);
            navigation.navigate("Login");
          });
       }
  
        
      

    static navigationOptions = {
        title: 'Login',
        headerShown: false,
        };
    render(){
        return(
        
            <Container>
                
                 <Dialog
                visible={this.state.visible}
                footer={
                <DialogFooter>
                    <DialogButton
                    text="CANCEL"
                    onPress={() => { return false; }}
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

export default Popup;
