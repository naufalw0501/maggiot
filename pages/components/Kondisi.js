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
      plaintextsuhu: '',
      plaintextkelembapan: '',
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
        const ciphertextsuhu = this.state.suhu;
        const ciphertextkelembapan = this.state.kelembapan;
        const key = '07BN(%$*Xs-`9YKjRIv=5[a&HTn3s%@@OnKFPBjh`d=]t#wH)qDOW9yWW+fZT1xL';
        const cryptoAlgorithm = 'aes-128-cbc';
        const hashAlgorithm = 'sha1';

        if (key.length !== 64) {
          throw 'Invalid key length';
        }
    
        if (ciphertextsuhu.length < 104 || ciphertextsuhu.length % 2 !== 0) {
          throw 'Wrong ciphertext length';
        }

        if (ciphertextkelembapan.length < 104 || ciphertextkelembapan.length % 2 !== 0) {
          throw 'Wrong ciphertext length';
        }

        const staticIv = key.substring(0, 16);
        const ivKey = key.substring(16, 32);
        const dataKey = key.substring(32, 48);
        const hashKey = key.substring(48, 64);

        const cipherLensuhu = ciphertextsuhu.length;
        const ivCiphersuhu = Buffer.from(ciphertextsuhu.substring(0, 32), 'hex');
        const dataCiphersuhu = Buffer.from(ciphertextsuhu.substring(32, cipherLensuhu - 40), 'hex');
        const hashExpectedsuhu = Buffer.from(ciphertextsuhu.substring(cipherLensuhu - 40), 'hex');

        const cipherLenkelembapan = ciphertextkelembapan.length;
        const ivCipherkelembapan = Buffer.from(ciphertextkelembapan.substring(0, 32), 'hex');
        const dataCipherkelembapan = Buffer.from(ciphertextkelembapan.substring(32, cipherLenkelembapan - 40), 'hex');
        const hashExpectedkelembapan = Buffer.from(ciphertextkelembapan.substring(cipherLenkelembapan - 40), 'hex');

        const hashCryptosuhu = crypto.createHmac(hashAlgorithm, hashKey);
        hashCryptosuhu.update(ivCiphersuhu);
        hashCryptosuhu.update(dataCiphersuhu);
        const hashCalculatedsuhu = hashCryptosuhu.digest();

        const hashCryptokelembapan = crypto.createHmac(hashAlgorithm, hashKey);
        hashCryptokelembapan.update(ivCipherkelembapan);
        hashCryptokelembapan.update(dataCipherkelembapan);
        const hashCalculatedkelembapan = hashCryptokelembapan.digest();

        if (!hashCalculatedsuhu.equals(hashExpectedsuhu)) {
          throw 'Hash Suhu mismatch';
        }

        if (!hashCalculatedkelembapan.equals(hashExpectedkelembapan)) {
          throw 'Hash Kelembapan mismatch';
        }

        const ivCryptosuhu = crypto.createDecipheriv(cryptoAlgorithm, ivKey, staticIv);
        ivCryptosuhu.update(ivCiphersuhu);
        let ivsuhu = ivCryptosuhu.final();

        const ivCryptokelembapan = crypto.createDecipheriv(cryptoAlgorithm, ivKey, staticIv);
        ivCryptokelembapan.update(ivCipherkelembapan);
        let ivkelembapan = ivCryptokelembapan.final();
    
        ivsuhu = Buffer.concat([ivsuhu, Buffer.alloc(1, 1)], 16);

        ivkelembapan = Buffer.concat([ivkelembapan, Buffer.alloc(1, 1)], 16);

        const dataCryptosuhu = crypto.createDecipheriv(cryptoAlgorithm, dataKey, ivsuhu);
        dataCryptosuhu.update(dataCiphersuhu);
        let plaintextsuhu = dataCryptosuhu.final('utf8');

        const dataCryptokelembapan = crypto.createDecipheriv(cryptoAlgorithm, dataKey, ivkelembapan);
        dataCryptokelembapan.update(dataCipherkelembapan);
        let plaintextkelembapan = dataCryptokelembapan.final('utf8');

        this.setState({ plaintextsuhu });

        this.setState({ plaintextkelembapan });

      });
  }
  

  getFase = () => {
    if (this.state.hari <= 5 ) {
      return "Fase Telur";
    } else if (this.state.hari >= 6) {
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
            Suhu = {this.state.plaintextsuhu}°C
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
            Kelembapan = {this.state.plaintextkelembapan}%
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
