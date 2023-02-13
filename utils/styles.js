import {StyleSheet, Platform, Dimensions} from 'react-native';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
//import { useTheme } from "react-native-themed-styles"
//import { styleSheetFactory } from "./theme"
const styles = StyleSheet.create({
    container:{
      flex:1,
      //justifyContent:'center',
      //alignItems:'center',
      //alignContent:"center",
      backgroundColor:"#fff",
      //width:100,
      padding:20
    },
    contentstyle:{
        width:'100%', 
        marginTop:50
    },

    loginimagebackground:{
        width:120,
        height:120,
        //top:screenWidth/7,
        left:screenWidth/3,
        //position:"absolute",
        //top:40,
        //bottom:100,
        //flex:1,
        //justifyContent: 'center',
       // alignItems:"center"
    },
    textinputfield:{
        marginTop:10,
        fontFamily: "OpenSans-Regular"
    },
    buttonlogin:{
        marginTop:40,
        textAlign:"center"
    },
    buttonContainer: {
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:'100%',
        borderRadius:30,
        marginTop:40
      },
      loginButton: {
        backgroundColor: "#4387fc",
      },
      loginText: {
        color: 'white',
      },
      checboxlogin:{
          marginTop:20, 
          marginLeft:0
      },
      apptitle:{
          top:130, 
          fontWeight:"bold", 
          fontSize:24,
          //width:30,
          flex:1,
          flexDirection:"row",
          //justifyContent: 'center',
          //alignItems:"center",
          textAlign:"center",
          marginLeft:"-30%"
        },

        modalView: {
          margin: 20,
          backgroundColor: "white",
          borderRadius: 20,
          padding: 35,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5
        },
        openButton: {
          backgroundColor: "#F194FF",
          borderRadius: 20,
          padding: 10,
          elevation: 2
        },
        textStyle: {
          color: "white",
          fontWeight: "bold",
          textAlign: "center"
        },
        modalText: {
          marginBottom: 15,
          textAlign: "center"
        }
    
  });
  
  export default styles;