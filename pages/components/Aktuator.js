import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { ProgressBar } from 'react-native-paper';
import database from '@react-native-firebase/database';
const crypto = require('./crypto');
global.Buffer = require('buffer').Buffer;

class Aktuator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kipas: 0,
      lampu: 0,
      mistmaker: 0,
      sprayer: 0,
    };
  }

  componentDidMount() {
    database()
      .ref('sistem1')
      .on('value', snapshot => {
        const data = snapshot.val();
        
        this.setState({
          kipas:data.kipas,
          lampu:data.lampu,
          mistmaker:data.mistmaker,
          sprayer:data.sprayer,
        })
      });
  }
  

  render() {
    const kipasStatus = this.state.kipas === 0 ? 'OFF' : 'ON';
    const sprayerStatus = this.state.sprayer === 0 ? 'OFF' : 'ON';
    return (
      <View>
        <View style={{
        backgroundColor: 'white',
        }}>
        <View
          style={{
            flexDirection: 'row',
            height: 200,
            width:400,
            paddingTop: 15,
            paddingBottom: 0,
            marginHorizontal:10,
            paddingHorizontal: 0,
          }}>
          <View style={{
            height: '100%',
            width: '50%',
            borderRadius: 10,
            backgroundColor: '#266937',
            marginLeft: 0,
            marginRight: 6,
            flexDirection:'row',
            flex: 0.5}}>
            <View
              style={{
                flexDirection: 'column',
                height: '100%',
                marginLeft: 15,
                flex:1,
              }}> 
            <View style={{
                backgroundColor: 'white',
                borderRadius:10,
                width:157,
                height:100,
                marginTop:10,
                paddingTop:5
            }}>
            <Image
            source={require("../img/fanicon.png")}
            style={{
                height:90,
                width:'80%',
                resizeMode: 'contain',
                marginLeft:10,
            }}
            />
            </View>             
            <Text style={styles.nilaiTextStyle}>
                Kipas
            </Text>
            <Text style={styles.nilai2TextStyle}>
                Status : {kipasStatus}
            </Text>
            </View>
            </View>
            <View style={{
            height: '100%',
            width: '50%',
            borderRadius: 10,
            backgroundColor: '#266937',
            marginLeft: 0,
            marginRight: 6,
            flexDirection:'row',
            flex: 0.5}}>
            <View
              style={{
                flexDirection: 'column',
                height: '100%',
                marginLeft: 15,
                flex:1,
              }}> 
            <View style={{
                backgroundColor: 'white',
                borderRadius:10,
                width:157,
                height:100,
                marginTop:10,
                paddingTop:5
            }}>
            <Image
            source={require("../img/sprayericon.png")}
            style={{
                height:90,
                width:'80%',
                resizeMode: 'contain',
                marginLeft:10,
            }}
            />
            </View>             
            <Text style={styles.nilaiTextStyle}>
                Sprayer
            </Text>
            <Text style={styles.nilai2TextStyle}>
                Status : {sprayerStatus}
            </Text>
            </View>
            </View>
        </View>
        </View>
        <View style={{
        backgroundColor: 'white',
        paddingBottom:100,
        }}>
        <View
          style={{
            flexDirection: 'row',
            height: 200,
            width:400,
            paddingTop: 5,
            paddingBottom: 0,
            marginHorizontal:10,
            paddingHorizontal: 0,
          }}>
          <View style={{
            height: '100%',
            width: '50%',
            borderRadius: 10,
            backgroundColor: '#266937',
            marginLeft: 0,
            marginRight: 6,
            flexDirection:'row',
            flex: 0.5}}>
            <View
              style={{
                flexDirection: 'column',
                height: '100%',
                marginLeft: 15,
                flex:1,
              }}> 
            <View style={{
                backgroundColor: 'white',
                borderRadius:10,
                width:157,
                height:100,
                marginTop:10,
                paddingTop:5
            }}>
            <Image
            source={require("../img/lampicon.png")}
            style={{
                height:90,
                width:'80%',
                resizeMode: 'contain',
                marginLeft:10,
            }}
            />
            </View>             
            <Text style={styles.nilaiTextStyle}>
                Lampu
            </Text>
            <Text style={styles.nilai2TextStyle}>
                Status : {this.state.lampu}%
            </Text>
            </View>
            </View>
            <View style={{
            height: '100%',
            width: '50%',
            borderRadius: 10,
            backgroundColor: '#266937',
            marginLeft: 0,
            marginRight: 6,
            flexDirection:'row',
            flex: 0.5}}>
            <View
              style={{
                flexDirection: 'column',
                height: '100%',
                marginLeft: 15,
                flex:1,
              }}> 
            <View style={{
                backgroundColor: 'white',
                borderRadius:10,
                width:157,
                height:100,
                marginTop:10,
                paddingTop:5
            }}>
            <Image
            source={require("../img/mistmakericon.png")}
            style={{
                height:90,
                width:'80%',
                resizeMode: 'contain',
                marginLeft:15,
            }}
            />
            </View>             
            <Text style={styles.nilaiTextStyle}>
                Mist Maker
            </Text>
            <Text style={styles.nilai2TextStyle}>
                Status : {this.state.mistmaker}%
            </Text>
            </View>
            </View>
        </View>
        </View>
        </View>

    );
  }
}

export default Aktuator;




const styles = StyleSheet.create({
  nilaiTextStyle: {
    height: '90%',
    width: '90%',
    borderRadius: 10,
    color:'white',
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    paddingTop:5,
    marginBottom: -30,
  },
  nilai2TextStyle: {
    height: '90%',
    width: '90%',
    borderRadius: 10,
    color:'white',
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 25,
    marginTop: 10,
  },  
  barTextStyle: {
    color:'white',
  }
});