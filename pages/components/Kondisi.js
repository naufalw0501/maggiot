import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import database from '@react-native-firebase/database';
const crypto = require('./crypto');
global.Buffer = require('buffer').Buffer;

export default class Kondisi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0,
      hari: 0,
      suhu: 0,
      kelembapan: 0,
      peringatansuhu: 0,
      peringatankelembapan: 0,
      token: null,
      periode: '',
    };
  }

  componentDidMount() {
    database()
      .ref('sistem1')
      .on('value', snapshot => {
        const data = snapshot.val();
        
        this.setState({
          status:data.status,
          hari:data.hari,
          suhu:data.suhu,
          kelembapan:data.kelembapan,
          peringatansuhu:data.peringatansuhu,
          peringatankelembapan:data.peringatankelembapan,
          periode:data.periode,
        })
      });
  }
  

  getFase = () => {
    if (this.state.hari <= 3 ) {
      return "Fase Telur";
    } else if (this.state.hari >= 4) {
      return "Fase Larva";
    }
  }

  getKondisi = () => {
    if (this.state.peringatansuhu == 1 && this.state.peringatankelembapan == 1 ) {
      return "Abnormal";
    } else if (this.state.peringatansuhu == 1 && this.state.peringatankelembapan == 0 ) {
      return "Abnormal";
    } else if (this.state.peringatansuhu == 0 && this.state.peringatankelembapan == 1 ) {
      return "Abnormal";
    } else if (this.state.peringatansuhu == 0 && this.state.peringatankelembapan == 0 ) {
      return "Normal";
    } 
  }


  
  render() {
    return (
      <View>
        <View style={{
            borderWidth:3,
            borderRadius:10,
            marginVertical:0,
            marginTop:20,
            paddingVertical:15,
            paddingLeft:10,
            borderColor:'#429C59',
            backgroundColor:'white',
            flexDirection: 'column',
            width:'100%',
            height:200,
        }}>
        <View style={{
          flex: 0.25,
          textAlign: "center",
          alignItems: "center",
        }}>
          <Text style={{
            fontSize:22,
            color: "#224229",
            fontWeight:"bold",
          }}>
            Kondisi Media
          </Text>
        </View>
        <View style={{
          flex: 0.1875,
          flexDirection:'row',
        }}>
          <Image
            source={require("../img/calendargreen.png")}
            style={{
              height: 20,
              resizeMode:'contain',
              flex:0.1,
            }}
          />
          <Text style={{
            color:'#429C59',
            fontWeight:"bold",
            fontSize:16,
            flex:0.9,
            marginLeft: 5,
          }}>
            Periode Ke-{this.state.periode} ; Hari Ke-{this.state.hari} ; {this.getFase()}
          </Text>
        </View>
        <View style={{
          flex: 0.1875,
          flexDirection:'row',
        }}>
          <Image
            source={require("../img/temporange.png")}
            style={{
              height: 20,
              resizeMode:'contain',
              flex:0.1,
            }}
          />
          <Text style={{
            color:'#EE6B19',
            fontWeight:"bold",
            fontSize:16,
            flex:0.9,
            marginLeft: 5,
          }}>
            Suhu = {this.state.suhu}°C
          </Text>
        </View>
        <View style={{
          flex: 0.1875,
          flexDirection:'row',
        }}>
          <Image
            source={require("../img/humgreen.png")}
            style={{
              height: 20,
              resizeMode:'contain',
              flex:0.1,
            }}
          />
          <Text style={{
            color:'#429C59',
            fontWeight:"bold",
            fontSize:16,
            flex:0.9,
            marginLeft: 5,
          }}>
            Kelembapan = {this.state.kelembapan}%
          </Text>
        </View>
        <View style={{
          flex: 0.1875,
          flexDirection:'row',
          alignItems: 'center',
        }}>
          <Image
            source={require("../img/alertorange.png")}
            style={{
              height: 20,
              resizeMode:'contain',
              flex:0.1,
            }}
          />
          <Text style={{
            color:'#EE6B19',
            fontWeight:"bold",
            fontSize:16,
            flex:0.9,
            marginLeft: 5,
          }}>
            Kondisi Sistem : {this.getKondisi()}
          </Text>
        </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    statusTextStyle: {
      fontSize: 17,
      paddingBottom: 4,
      fontWeight: "bold",
      textAlign: "left",
      color: "#07432F",
      paddingLeft: 0,
      textAlign: 'center',
    },
  });
