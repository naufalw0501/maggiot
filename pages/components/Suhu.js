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

class Suhu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suhu: '0',
      peringatansuhu: '0',
      plaintextsuhu: '',
    };
  }

  componentDidMount() {
    database()
      .ref('sistem1')
      .on('value', snapshot => {
        const data = snapshot.val();
        
        this.setState({
          suhu:data.suhu,
          peringatansuhu:data.peringatansuhu,
        })
        const ciphertext = this.state.suhu;
        const key = '07BN(%$*Xs-`9YKjRIv=5[a&HTn3s%@@OnKFPBjh`d=]t#wH)qDOW9yWW+fZT1xL';
        const cryptoAlgorithm = 'aes-128-cbc';
        const hashAlgorithm = 'sha1';
    
        if (key.length !== 64) {
          throw 'Invalid key length';
        }
    
        if (ciphertext.length < 104 || ciphertext.length % 2 !== 0) {
          throw 'Wrong ciphertext length';
        }
    
        const staticIv = key.substring(0, 16);
        const ivKey = key.substring(16, 32);
        const dataKey = key.substring(32, 48);
        const hashKey = key.substring(48, 64);
    
        const cipherLen = ciphertext.length;
        const ivCipher = Buffer.from(ciphertext.substring(0, 32), 'hex');
        const dataCipher = Buffer.from(ciphertext.substring(32, cipherLen - 40), 'hex');
        const hashExpected = Buffer.from(ciphertext.substring(cipherLen - 40), 'hex');
    
        const hashCrypto = crypto.createHmac(hashAlgorithm, hashKey);
        hashCrypto.update(ivCipher);
        hashCrypto.update(dataCipher);
        const hashCalculated = hashCrypto.digest();
    
        if (!hashCalculated.equals(hashExpected)) {
          throw 'Hash mismatch';
        }
    
        const ivCrypto = crypto.createDecipheriv(cryptoAlgorithm, ivKey, staticIv);
        ivCrypto.update(ivCipher);
        let iv = ivCrypto.final();
    
        iv = Buffer.concat([iv, Buffer.alloc(1, 1)], 16);
    
        const dataCrypto = crypto.createDecipheriv(cryptoAlgorithm, dataKey, iv);
        dataCrypto.update(dataCipher);
        let plaintextsuhu = dataCrypto.final('utf8');
    
        this.setState({ plaintextsuhu });
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
            marginTop:5,
            flexDirection:'row',
          }}>
          <Image
            source={require("../img/tempwhite.png")}
            style={{
              height: 25,
              resizeMode:'contain',
              flex:0.3,
              marginTop:6,
              marginLeft:-4,
            }}
          />
          <Text style={{
            color:'white',
            paddingLeft:30,
            fontSize:20,
            fontWeight:'bold',
            flex:0.7,
            marginTop:5,
            marginLeft:-10
          }}>
            Suhu
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
            {this.state.plaintextsuhu}°C
          </Text>
            </View>
          </View>
        </View>
        <SuhuBar plaintextsuhu={this.state.plaintextsuhu} peringatansuhu={this.state.peringatansuhu}/>
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
          Pada fase penetasan telur, Maggot BSF cocok pada suhu 28°C - 35°C. 
          Sedangkan pada fase larva, Maggot BSF membutuhkan suhu optimum 
          30°C - 36°C.
        </Text>
        </View>
        </View>
      

    );
  }
}

export default Suhu;

export function SuhuBar({ plaintextsuhu, peringatansuhu }) {
  let color, progress, statussuhu;

  
  if (peringatansuhu == '1') {
    color = '#C33E3E';
    progress = (plaintextsuhu-20)/20;
    statussuhu = 'Abnormal'
  } 
  else {
    color = '#129E20';
    progress = (plaintextsuhu-20)/20; // menghitung progress dari suhu dalam rentang 25-31 
    statussuhu = 'Normal'
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
        <Text style={styles.barTextStyle}>20°C</Text>
        </View>
        <View style={{
            flex : 0.2, 

        }}>
        <Text style={styles.barTextStyle}>25°C</Text>
        </View>
        <View style={{
            flex : 0.2, 
            alignItems: 'center'
        }}>
        <Text style={styles.barTextStyle}>30°C</Text>
        </View>
        <View style={{
            flex : 0.2, 
            alignItems: 'center'
        }}>
        <Text style={styles.barTextStyle}>35°C</Text>
        </View>
        <View style={{
            flex : 0.2, 
            alignItems: 'flex-end'
        }}>
        <Text style={styles.barTextStyle}>40°C</Text>
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
          Status : {statussuhu}
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