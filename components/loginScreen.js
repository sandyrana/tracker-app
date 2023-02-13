import React, { Component } from 'react';
import { View, StatusBar, SafeAreaView, ImageBackground, TouchableHighlight, Vibration, Platform} from 'react-native';
import {Container, Header, Content, Form, Item, Label, Input, Button, Text, CheckBox, Body, ListItem} from 'native-base';
import styles from '../utils/styles';
import { Col, Row, Grid } from "react-native-easy-grid";
import Toast from 'react-native-simple-toast';

import * as asyncstorage from '../utils/asyncstorage';

import * as aesctrl from '../utils/aes-ctr';

import * as globals from '../utils/globals';

import DeviceInfo from 'react-native-device-info';

import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';

import AsyncStorage from '@react-native-community/async-storage';



class loginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        host:'',
        database:'',
        username:'',
        password:'',
        userResponse:'',
        loader:false,
        visible:false
    };
  }
  static navigationOptions = {
    title: 'Login',
    headerShown: false,
    };


    componentDidMount = async() => {
        
        var isLoggedin = await asyncstorage.getData("isLoggedIn");
        var dialogshow = await asyncstorage.getData("dialogshow");
        console.warn(isLoggedin);
        const {navigation} = this.props;
        if(isLoggedin==="true"){
            navigation.navigate("Home");
        }
        if(dialogshow!=="1"){
            if(Platform.OS==='android'){
                this.setState({visible:true});
            }
        }
    }
    /*
    * function: doLogin
    * @Input: host, database, username, password
    * @Output: userinformations
    * */
   doLogin = () => {
    var {host, database, username, password} = this.state;
    var {navigation} = this.props;
    let deviceId = DeviceInfo.getDeviceId();
   host = host.trim().toLowerCase();
   asyncstorage.storeData("database", database);
   database = database.trim().toLowerCase();
   username = username.trim().toLowerCase();
   password = password.trim().toLowerCase();
    var apiURL, postUsername, postPassword, postDatabase,
    userRemark , params = "";
    if(host=='' || typeof host=='undefined'){
        Toast.show('Host can not be empty.');
        return false;
    }else if(database=='' || typeof database=='undefined'){
        Toast.show('Database can not be empty.');
        return false;
    }else if(username=='' || typeof username=='undefined'){
        Toast.show('Username can not be empty.');
        return false;
    }else if(password=='' || typeof password=='undefined'){
        Toast.show('Password  can not be empty.');
        return false;
    }else{  
        this.setState({loader:true});
        var tmpIPAddress = host.split("//");
        
        var uuid = '3cc685f006974143';
        
        serverIP = tmpIPAddress.length == 1 ? "http://" + host : host;

        webserviceURL = serverIP + "/mobile-service/mobileServiceAPI.php";

        asyncstorage.storeData("webserviceURL", webserviceURL);

        

        asyncstorage.storeData("serverAddress", serverIP);

        apiURL = webserviceURL + "?method=login&format=json&deviceUID=" + uuid +
                    "&APP_VERSION=" + globals.default.APP_VERSION;

        
        postUsername = aesctrl.encrypt(username, uuid, 256);
        postPassword = aesctrl.encrypt(password, uuid, 256);
        postDatabase = aesctrl.encrypt(database, uuid, 256);
        

        params += "username=" + encodeURIComponent(postUsername) +
                    "&password=" + encodeURIComponent(postPassword) +
                    "&database=" + encodeURIComponent(postDatabase) +
                    "&deviceUID=" + uuid +
                    "&userRemark=" + encodeURIComponent(userRemark);
                params += "&msmp=1";
                params += "&deviceUDID="+ deviceId;
                params += "&APP_VERSION="+globals.default.APP_VERSION ;
        console.warn(params);
console.log(apiURL+"&"+params);
        //GET request
    fetch(apiURL+"&"+params, {
        method: 'POST',
        //Request Type
        //body:{username:encodeURIComponent(postUsername), password:encodeURIComponent(postPassword), database:encodeURIComponent(postDatabase)}
      })
        .then(response => response.json())
        //If response is in json then in success
        .then(responseJson => {
            var Login = {};
          //Success
          //asyncstorage.storeData("userData", JSON.stringify(responseJson));
          //asyncstorage.storeData("isLoggedIn", true);
          Login.loginResponseText = responseJson;
          this.setState({loader:false});
          if (Login.loginResponseText && Login.loginResponseText.head.status == '1' && Login.loginResponseText.head.error_number == '200') {
              console.warn("this is success login");
                asyncstorage.storeData("userData", JSON.stringify(responseJson));
                asyncstorage.storeData("isLoggedIn", "true");

                console.warn("this is login response");
                console.log(responseJson.body.TrackerAppURL);
                asyncstorage.storeData("dynamicconstant", responseJson.body.TrackerAppURL)
                
                navigation.navigate("Home");
          }else if (Login.loginResponseText.head.status == '101' && Login.loginResponseText.head.error_number == '200') {
            //navigator.notification.alert(Login.loginResponseText.head.error_message, alertDismissed, 'Inactive User', 'OK');
            //Loader.stop();
            Toast.show('This user is inactive.');
            return false;
        } else if (Login.loginResponseText.head.status == '102' && Login.loginResponseText.head.error_number == '200') {
            //navigator.notification.alert(Login.loginResponseText.head.error_message, alertDismissed, 'Authorization Error', 'OK');
            //Loader.stop();
            Toast.show('Please check Username and Password.');
            return false;
        } else if (Login.loginResponseText && Login.loginResponseText.head.status == '0') {
            //Loader.stop();
            //navigator.notification.alert(Login.loginResponseText.head.error_message);
            Toast.show(Login.loginResponseText.head.error_message);
            return false;
        } else {
            //Loader.stop();
            //Login.loginOffline('103');
            navigation.navigate("Home");
        }
          //navigation.navigate("Home");
        })
        //If response is not in json then in error
        .catch(error => {
          //Error
         // alert(JSON.stringify(error));
         // console.warn(error);
         Toast.show(error);
        });
    }
   }

   
   
   
   


  render() {
      const {host, database, username, password, loader} = this.state;
      if(loader===false){
    return (

        <Container style={styles.container}>
            <Grid>
                <Row size={20}>
                        <ImageBackground source={require("../assets/images/logo.png")} style={styles.loginimagebackground}></ImageBackground> 
                        <Text style={styles.apptitle}>
                            ESS GPS Tracking
                        </Text>
                    
                </Row>
                <Row size={80}>
                <Content style={styles.contentstyle}>
                    
                    <Item style={styles.textinputfield}>
                        <Input placeholder='Host' value={host} onChangeText={(host) => this.setState({host})}/>
                    </Item>
    
                    <Item style={styles.textinputfield}>
                        <Input placeholder='Database' value={database} onChangeText={database => this.setState({database})}/>
                    </Item>
    
                    <Item style={styles.textinputfield}>
                        <Input placeholder='Username' value={username} onChangeText={username => this.setState({username})}/>
                    </Item>
    
                    <Item style={styles.textinputfield}>
                        <Input placeholder='Password' value={password} onChangeText={password => this.setState({password})}  secureTextEntry={true}/>
                    </Item>
                    
                    
                    <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.doLogin()}>
                        <Text style={styles.loginText}>Sign In</Text>
                    </TouchableHighlight>
                    
                </Content>
                </Row>
            </Grid>

            
            
        </Container>
            
        
      
    );
    }else{
       return( 
                <View style={{flex:1, flexDirection:'row', justifyContent:"center", alignContent:"center", alignItems:"center"}}>
                    <DoubleBounce size={20} color="#4387fc" />
                </View>
        )
    }
  }
}

export default loginScreen;
