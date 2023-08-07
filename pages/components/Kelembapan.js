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

class Kelembapan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kelembapan: '0',
      peringatankelembapan: '0',
    };
  }

  componentDidMount() {
    database()
      .ref('sistem1')
      .on('value', snapshot => {
        const data = snapshot.val();
        this.setState({
          kelembapan:data.kelembapan,
          peringatankelembapan:data.peringatankelembapan,
        })
      });
  }

  render() {
    return (
      <View>
      <View style={{
            backgroundColor:'#429C59',
            borderRadius:10,
            height:50,
            width:170,
            marginBottom:-30,
            marginTop:15,
            flexDirection:'row',
          }}>
          <Image
            source={require("../img/humwhite.png")}
            style={{
              height: 20,
              resizeMode:'contain',
              flex:0.3,
              marginTop:8,
              marginLeft:-10,
            }}
          />
          <Text style={{
            color:'white',
            justifyContent:'center',
            alignItems:'center',
            fontSize:20,
            fontWeight:'bold',
            flex:0.7,
            marginTop:5,
            marginLeft:-10,
          }}>
            Kelembapan
          </Text>
      </View>
    <View
      style={{
        flexDirection: 'row',
        height: 120,
        paddingTop: 15,
        paddingBottom: 0,
        marginBottom:-15,
        paddingHorizontal: 0,
      }}>
      <View style={{
        height: '100%',
        width: '80%',
        borderRadius: 10,
        backgroundColor: '#266937',
        marginLeft: 0,
        marginRight: 0,
        flex: 1}}>
        <View
          style={{
            flexDirection: 'column',
            height: 75,
          }}>              
        <Text style={styles.nilaiTextStyle}>
            {this.state.kelembapan}%
        </Text>
        </View>
      </View>
    </View>
    <KelembapanBar kelembapan={this.state.kelembapan} peringatankelembapan={this.state.peringatankelembapan}/>
    <View style={{
          backgroundColor:'#266937',
          borderRadius:10,
          marginTop:-20,
          paddingTop:0,
          paddingHorizontal:15,
          paddingBottom:10,
        }}>
        <Text style={{
              textAlign:'justify',
              fontSize:15,
              color:'white',
          }}>
          Pada fase penetasan telur, Maggot BSF cocok pada 
          kelembapan 60% - 80%. Sedangkan pada fase larva, 
          Maggot BSF membutuhkan kelembapan udara optimum 
          60% - 70%.
        </Text>
      </View>
    </View>        
    );
  }
}

export default Kelembapan;

export function KelembapanBar({ kelembapan, peringatankelembapan }) {
  let color, progress, statuskelembapan;

  if (peringatankelembapan == '1') {
    color = '#C33E3E';
    progress = kelembapan/100;
    statuskelembapan = 'Abnormal'
  } 
  else {
    color = '#129E20';
    progress = kelembapan/100;
    statuskelembapan = 'Normal'
}

  return (
    <View style={{
        paddingTop:10,
        paddingBottom:30,
        backgroundColor:'#266937',
        paddingHorizontal:15,
        borderRadius:10,
        marginTop:0,
    }}>
      <ProgressBar style={{
          height:20,
          borderRadius:5,
      }} progress={progress} color={color} />
      <View style={{
          flexDirection: 'row',
          height: 20,
      }}>
        <View style={{
            flex : 0.2
        }}>
        <Text style={styles.barTextStyle}>0%</Text>
        </View>
        <View style={{
            flex : 0.2, 

        }}>
        <Text style={styles.barTextStyle}>25%</Text>
        </View>
        <View style={{
            flex : 0.2, 
            alignItems: 'center'
        }}>
        <Text style={styles.barTextStyle}>50%</Text>
        </View>
        <View style={{
            flex : 0.2, 
            alignItems: 'center'
        }}>
        <Text style={styles.barTextStyle}>75%</Text>
        </View>
        <View style={{
            flex : 0.2, 
            alignItems: 'flex-end'
        }}>
        <Text style={styles.barTextStyle}>100%</Text>
        </View>
      </View>
      <View style={{
          alignItems:'center',
          paddingTop:10,
          marginBottom:-8
      }}>
      <Text style={{
          alignItems:'center',
          fontSize:20,
          fontWeight:'bold',
          color:'white'
      }}>
          Status : {statuskelembapan}
      </Text>
      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  nilaiTextStyle: {
    height: '90%',
    width: '90%',
    borderRadius: 10,
    backgroundColor: 'white',
    color:'#003D38',
    marginLeft: 15,
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 38,
    marginTop: 15,
  },
  
  barTextStyle: {
    color:'white',
  }
});