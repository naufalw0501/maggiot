import React, { useEffect, useState, Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import auth from "@react-native-firebase/auth";
import database from '@react-native-firebase/database';
import { ScrollView } from "react-native-gesture-handler";
const crypto = require('./components/crypto');
import { randomBytes } from 'react-native-randombytes';
global.Buffer = require('buffer').Buffer;

const HomeScreen = ({ navigation }) => {
  
  const [user, setUser] = useState();
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      console.log("user", JSON.stringify(user));
      setUser(user);
    });
    return subscriber;
  }, []);

  useEffect(() => {
    database()
      .ref('sistem1/token')
      .once('value')
      .then((snapshot) => {
        const token = snapshot.val();
        if (!token) {
          const newToken = generateToken();
          if (newToken) {
            encryptData(newToken).then((encryptedToken) => {
              database()
                .ref('sistem1/token')
                .set(encryptedToken)
                .then(() => {
                  console.log("New Token uploaded successfully!");
                })
                .catch((error) => {
                  console.error("Error uploading token:", error);
                });
            });
          setShowToken(false);
          }
        }
        else {
          setShowToken(false);
        }
      })
      .catch((error) => {
        console.error("Error checking token:", error);
      });
  setShowToken(true);
  }, []);

  function generateToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
  
    let token = '';
    for (let i = 0; i < 4; i++) {
      const randomCharIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomCharIndex);
    }
  
    for (let i = 0; i < 2; i++) {
      const randomNumberIndex = Math.floor(Math.random() * numbers.length);
      token += numbers.charAt(randomNumberIndex);
    }
  
    return token;
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

  const logout = () => {
    Alert.alert(
      "Logout",
      "Anda yakin ingin Logout ?",
      [
        {
          text: "Batal",
          onPress: () => {
            return null;
          },
        },
        {
          text: "Ya",
          onPress: () => {
            auth()
              .signOut()
              .then(() => navigation.replace("Auth"))
              .catch((error) => {
                console.log(error);
                if (error.code === "auth/no-current-user")
                  navigation.replace("Auth");
                else alert(error);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <View>
          <Text style={styles.welcomeTextStyle}>
            Selamat Datang
          </Text>
          {user ? (
            <Text style={styles.welcomeTextStyle2}>
              {""}
              {user.displayName
                ? user.displayName
                : user.email}
            </Text>
          ) : null}
          <Media1 navigation={navigation} setShowToken={setShowToken} showToken={showToken} />
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={logout}
          >
            <Text style={styles.buttonTextStyle}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

class Media1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: '',
      lokasi:'',
      token:'',
      decryptedtoken: '',
      id:'',
      istokendefault:'',
    };
  }

  componentDidMount() {
    database()
      .ref('sistem1')
      .on('value', snapshot => {
        const data = snapshot.val();
        
        this.setState({
          lokasi: data.lokasi,
          token: data.token,
          id: data.id,
          istokendefault: data.istokendefault,
        }, () => {
          this.decryptToken();
        });
      });
  }

  handleInputChange = (text) => {
    this.setState({ userInput: text });
  }

  

  handleShowToken = () => {
    this.props.setShowToken(!this.props.showToken);
  };

  handleButtonPress = async () => {
    if (this.state.userInput.trim() === '') {
      Alert.alert("Masukkan Token Media !");
      return;
    }
    await this.decryptToken(); 
    if (this.state.userInput === this.state.decryptedToken) {
      this.props.navigation.navigate("KontrolScreen");
      console.log("Dekripsi Token Berhasil");
    } else {
      Alert.alert(
        'Token Media Salah'
      );
    }
  }

  decryptToken = async () => {
    const { token } = this.state;
    
    if (!token) {
      this.setState({ decryptedToken: '' });
      return;
    }
    
    try {
      const key = '07BN(%$*Xs-`9YKjRIv=5[a&HTn3s%@@OnKFPBjh`d=]t#wH)qDOW9yWW+fZT1xL';
      const cryptoAlgorithm = 'aes-128-cbc';
      const hashAlgorithm = 'sha1';

      if (key.length !== 64) {
        throw 'Invalid key length';
      }

      if (token.length < 104 || token.length % 2 !== 0) {
        throw 'Wrong ciphertext length';
      }

      const cipherLen = token.length;
      const ivCiphertoken = Buffer.from(token.substring(0, 32), 'hex');
      const dataCiphertoken = Buffer.from(
        token.substring(32, cipherLen - 40),
        'hex'
      );
      const hashExpectedtoken = Buffer.from(token.substring(cipherLen - 40), 'hex');

      const hashCryptotoken = crypto.createHmac(hashAlgorithm, key.substring(48, 64));
      hashCryptotoken.update(ivCiphertoken);
      hashCryptotoken.update(dataCiphertoken);
      const hashCalculatedtoken = hashCryptotoken.digest();

      if (!hashCalculatedtoken.equals(hashExpectedtoken)) {
        throw 'Hash mismatch';
      }

      const ivCryptotoken = crypto.createDecipheriv(cryptoAlgorithm, key.substring(16, 32), key.substring(0, 16));
      ivCryptotoken.update(ivCiphertoken);
      let ivtoken = ivCryptotoken.final();

      ivtoken = Buffer.concat([ivtoken, Buffer.alloc(1, 1)], 16);

      const dataCryptotoken = crypto.createDecipheriv(cryptoAlgorithm, key.substring(32, 48), ivtoken);
      dataCryptotoken.update(dataCiphertoken);
      let plaintextToken = dataCryptotoken.final('utf8');
      this.setState({ decryptedToken: plaintextToken });
    } catch (error) {
      this.setState({ decryptedToken: '' });
      Alert.alert(
        'Error',
        'An error occurred while decrypting token.',
        [
          {
            text: 'OK',
            onPress: () => console.log('OK Pressed')
          }
        ]
      );
    }
  };

  render() {
    const { showToken } = this.props;
    const { token, istokendefault, decryptedToken } = this.state;
    return (
        <View>
          <View style={{
            borderWidth:3,
            borderRadius:10,
            marginVertical:0,
            marginHorizontal:0,
            paddingBottom:10,
            paddingHorizontal:0,
            borderColor:'#429C59',
            backgroundColor:'white',
            height:230,
            flexDirection:'column',
          }}>
            <View style={{
              borderColor:'#429C59',
              height:'100%',
              flexDirection:'row',
              flex:0.48,
              marginHorizontal:10,
            }}>
              <View style={{
                borderColor:'#429C59',
                height:'100%',
                flexDirection:'row',
                flex:0.25,
                justifyContent:'center',
              }}>
                <Text style={{
                  color:'#EE6B19',
                  fontSize:73,
                  fontWeight:'bold',
                }}>
                  1.
                </Text>
              </View>
              <View style={{
                borderColor:'#72B0A9',
                height:'100%',
                flexDirection:'column',
                flex:0.75,
              }}>
                <View style={{
                  borderColor:'#72B0A9',
                  height:'100%',
                  flex:0.5,
                  justifyContent:'center',
                  paddingTop:10,
                }}>
                  <Text style={{
                    color:'#429C59',
                    fontSize:20,
                    fontWeight:'bold',
                    marginBottom:-5,
                  }}>
                    Media {this.state.id}
                  </Text>
                </View>
                <View style={{
                  borderColor:'#72B0A9',
                  height:'100%',
                  flex:0.5,
                  justifyContent:'center',
                  paddingBottom:10,
                  marginBottom:-2,
                  borderTopColor:'#D9D9D9',
                  borderTopWidth:2,
                  marginRight:6,
                  borderTopRadius:2,
                  
                }}>
                  <Text style={{
                    color:'#224229',
                    fontSize:14,
                    fontWeight:'bold',
                  }}>
                    {this.state.lokasi}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{
              borderColor:'#72B0A9',
              height:'100%',
              flexDirection:'column',
              flex:0.5,
              marginHorizontal:10,
            }}>
              <View style={{
              borderColor:'#429C59',
              borderWidth:1.5,
              borderRadius:10,
              marginVertical:0,
              marginHorizontal:5,
              paddingLeft:5,
              height:'100%',
              flex:0.6,
              }}>
                <TextInput
                  placeholder="Masukkan Token Media..."
                  placeholderTextColor="#95B9AD"
                  autoCapitalize="none"
                  keyboardType="default"
                  returnKeyType="next"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                  secureTextEntry={!showToken}
                  onChangeText={this.handleInputChange}
                  value={this.state.userInput}
                />
              </View>
              <TouchableOpacity 
                style={{
                  alignItems: 'flex-end',
                  marginBottom:5,
                  marginRight:3
                }}
                onPress={this.handleShowToken}>
                  <Text
                  style={{
                    textDecorationLine: 'underline',
                    fontWeight: '500',
                    fontSize:13,
                    color: '#266937',
                    marginBottom:-5,
                  }}>{showToken ? 'Sembunyikan Token' : 'Tampilkan Token'}</Text>
              </TouchableOpacity>
                {istokendefault === true && (
                  <Text style={styles.tokenDefaultTextStyle}>
                    Token Default = {decryptedToken}
                  </Text>
                )}
              <View style={{
              borderColor:'#72B0A9',
              height:'100%',
              flex:0.5,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#266937",
                  color: "#FFFFFF",
                  height: 35,
                  alignItems: "center",
                  borderRadius: 10,
                  marginLeft: 5,
                  marginTop: 4,
                }}
                activeOpacity={0.5}
                onPress={this.handleButtonPress}
                >
                <Text style={{
                      color: "#FFFFFF",
                      paddingVertical: 5,
                      fontWeight: "bold",
                      fontSize: 16,
                }}>
                  Masuk
                </Text>
              </TouchableOpacity>
              </View>
            </View>
          </View>

        </View>
    );
  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  buttonStyle: {
    minWidth: 300,
    backgroundColor: "#266937",
    borderWidth: 0,
    color: "#FFFFFF",
    height: 40,
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingRight: 10,
    paddingLeft: 10,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal : 10,
    paddingVertical : 10,
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  nilaiTextStyle: {
    height: '150%',
    width: '85%',
    borderRadius: 10,
    backgroundColor: 'white',
    marginLeft: 12,
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 38,
    marginTop: 20,
  },
  keteranganTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    alignSelf: "center",
    marginTop: 15,
    paddingTop: 1,
    paddingBottom: 1,
  },
  welcomeTextStyle: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "left",
    color: "#266937",
    paddingBottom: 3,
    paddingTop: 5,
    paddingLeft: 0,
  },
  welcomeTextStyle2: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "left",
    color: "#EE6B19",
    paddingBottom: 20,
    paddingLeft: 0,
  },
  tokenDefaultTextStyle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#266937",
    paddingRight: 5,
    textAlign: "right",
  },
});