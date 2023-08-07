import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import database from '@react-native-firebase/database';
const crypto = require('./crypto');
import { randomBytes } from 'react-native-randombytes';
global.Buffer = require('buffer').Buffer;

export default class Status extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
      ciphertexttofire: '',
      ciphertextfromfire: '',
      timereset: '',
      plaintextfromfire: '',
      periode: '',
    };    
  }

  componentDidMount() {
    database()
      .ref('sistem1')
      .on('value', async (snapshot) => {
        const data = snapshot.val();

        this.setState({
          status: data.status,
          timereset: data.timereset,
          periode: data.periode,
        });

        try {
          const ciphertexttofire = await this.encryptData(data.status.toString());
          this.setState({ ciphertexttofire });

          const plaintextfromfire = await this.decryptData(data.status.toString());
          this.setState({ plaintextfromfire });
        } catch (error) {
          console.log('Error:', error);
        }
      });
  }

  encryptData = async (plaintext) => {
    const key = '07BN(%$*Xs-`9YKjRIv=5[a&HTn3s%@@OnKFPBjh`d=]t#wH)qDOW9yWW+fZT1xL';
    const cryptoAlgorithm = 'aes-128-cbc';
    const hashAlgorithm = 'sha1';

    if (key.length !== 64) {
      throw 'Invalid key length';
    }

    const staticIv = key.substring(0, 16);
    const ivKey = key.substring(16, 32);
    const dataKey = key.substring(32, 48);
    const hashKey = key.substring(48, 64);

    let iv = randomBytes(15);

    const ivCrypto = crypto.createCipheriv(cryptoAlgorithm, ivKey, staticIv);
    ivCrypto.update(iv);
    let ivCipher = ivCrypto.final();

    iv = Buffer.concat([iv, Buffer.alloc(1, 1)], 16);

    const dataCrypto = crypto.createCipheriv(cryptoAlgorithm, dataKey, iv);
    dataCrypto.update(plaintext);
    let dataCipher = dataCrypto.final();

    const hash = crypto.createHmac(hashAlgorithm, hashKey);
    hash.update(ivCipher);
    hash.update(dataCipher);

    const ciphertexttofire =
      ivCipher.toString('hex') + dataCipher.toString('hex') + hash.digest('hex');

    return ciphertexttofire;
  };

  decryptData = async (ciphertextfromfire) => {
    const key = '07BN(%$*Xs-`9YKjRIv=5[a&HTn3s%@@OnKFPBjh`d=]t#wH)qDOW9yWW+fZT1xL';
    const cryptoAlgorithm = 'aes-128-cbc';
    const hashAlgorithm = 'sha1';
  
    if (key.length !== 64) {
      throw 'Invalid key length';
    }
  
    if (ciphertextfromfire.length < 104 || ciphertextfromfire.length % 2 !== 0) {
      throw 'Wrong ciphertext length';
    }
  
    try {
      const cipherLen = ciphertextfromfire.length;
      const ivCipherfromfire = Buffer.from(ciphertextfromfire.substring(0, 32), 'hex');
      const dataCipherfromfire = Buffer.from(
        ciphertextfromfire.substring(32, cipherLen - 40),
        'hex'
      );
      const hashExpectedfromfire = Buffer.from(ciphertextfromfire.substring(cipherLen - 40), 'hex');
  
      const hashCryptofromfire = crypto.createHmac(hashAlgorithm, key.substring(48, 64));
      hashCryptofromfire.update(ivCipherfromfire);
      hashCryptofromfire.update(dataCipherfromfire);
      const hashCalculatedfromfire = hashCryptofromfire.digest();
  
      if (!hashCalculatedfromfire.equals(hashExpectedfromfire)) {
        throw 'Hash mismatch';
      }
  
      const ivCryptofromfire = crypto.createDecipheriv(cryptoAlgorithm, key.substring(16, 32), key.substring(0, 16));
      ivCryptofromfire.update(ivCipherfromfire);
      let ivfromfire = ivCryptofromfire.final();
  
      ivfromfire = Buffer.concat([ivfromfire, Buffer.alloc(1, 1)], 16);
  
      const dataCryptofromfire = crypto.createDecipheriv(cryptoAlgorithm, key.substring(32, 48), ivfromfire);
      dataCryptofromfire.update(dataCipherfromfire);
      let plaintextfromfire = dataCryptofromfire.final('utf8');
  
      console.log('Dekripsi Status Berhasil');
      return plaintextfromfire;
    } catch (error) {
      console.log('Dekripsi Status Gagal:', error); 
      throw error; 
    }
  };
  

  updateStatus = async (value) => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin melakukan tindakan ini?',
      [
        {
          text: 'Tidak',
          style: 'cancel',
        },
        {
          text: 'Ya',
          onPress: async () => {
            try {
              const ciphertext = await this.encryptData(value.toString());
              
              database()
                .ref('sistem1/status/')
                .set(ciphertext)
                .then(() => console.log('Enkripsi Berhasil. Status berhasil diupdate'))
                .catch((error) => console.log('Gagal mengupdate status:', error));
      
              this.setState({
                status: value,
              });
            } catch (error) {
              console.log('Gagal mengenkripsi data:', error);
            }
          },
        },
      ]
    );
  };

  updateTimereset = async (value) => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin mereset waktu kontrol menjadi Hari 1 (Fase Telur)?',
      [
        {
          text: 'Tidak',
          style: 'cancel',
        },
        {
          text: 'Ya',
          onPress: async () => {
            try {
              const ciphertext = await this.encryptData(value.toString());
              
              database()
              .ref('sistem1')
              .transaction((data) => {
                if (data) {
                  data.timereset = ciphertext;
                  data.periode = (data.periode || 0) + 1; 
                }
                return data;
              })
              .then(() => console.log('Enkripsi Berhasil. Fase Berhasil diulang ke hari 1'))
              .catch((error) => console.log('Gagal mengupdate status:', error));

            } catch (error) {
              console.log('Gagal mengenkripsi data:', error);
            }
          },
        },
      ]
    );
  };

  getStatusText = () => {
    const decryptedStatus = parseInt(this.state.plaintextfromfire);
    if (decryptedStatus === 1) {
      return 'Kontrolling Hidup';
    } else if (decryptedStatus === 2) {
      return 'Kontrolling Mati';
    } else {
      return 'Status Tidak Diketahui';
    }
  };

  render() {
    return (
      <View>
        <View
          style={{
            borderWidth: 3,
            borderRadius: 10,
            marginVertical: 0,
            marginHorizontal: 0,
            paddingVertical: 15,
            paddingHorizontal: 0,
            borderColor: '#429C59',
            backgroundColor: 'white',
          }}>
          <Text style={styles.statusTextStyle}>Status : {this.getStatusText()}</Text>
          <View
            style={{
              flexDirection: 'row',
              height: 40,
              paddingVertical: 0,
              marginVertical: 2,
              paddingHorizontal: 0,
            }}>
            <TouchableOpacity
              onPress={() => this.updateStatus(1)}
              style={{
                backgroundColor: '#266937',
                padding: 10,
                marginHorizontal: 30,
                marginLeft: 10,
                marginRight: 10,
                borderRadius: 10,
                flex: 0.33,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  alignSelf: 'center',
                }}>
                Hidupkan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.updateStatus(2)}
              style={{
                backgroundColor: '#A51010',
                padding: 10,
                borderRadius: 10,
                flex: 0.33,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  alignSelf: 'center',
                }}>
                Matikan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.updateTimereset(3)}
              style={{
                backgroundColor: '#EE6B19',
                padding: 10,
                marginHorizontal: 30,
                marginLeft: 10,
                marginRight: 10,
                borderRadius: 10,
                flex: 0.34,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  alignSelf: 'center',
                }}>
                Reset Fase
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  statusTextStyle: {
    fontSize: 22,
    paddingBottom: 13,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#224229',
    paddingLeft: 0,
    textAlign: 'center',
  },
});
