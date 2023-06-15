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
import CryptoJS from "react-native-crypto-js";

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
    };
  }

  componentDidMount() {
    database()
      .ref('sistem1')
      .on('value', snapshot => {
        const data = snapshot.val();
        
        this.setState({
          lokasi:data.lokasi,
          token:data.token,
          id:data.id,
        })
      });
  }

  handleInputChange = (text) => {
    this.setState({ userInput: text });
  }

  

  handleShowToken = () => {
    this.props.setShowToken(!this.props.showToken);
  };

  handleButtonPress = async () => {
    await this.decryptToken(); 
    if (this.state.userInput === this.state.decryptedToken) {
      this.props.navigation.navigate("KontrolScreen");
    } else {
      Alert.alert(
        'Password Media Salah'
      );
    }
  }

  decryptToken = async () => {
    const { token } = this.state;
    const key = 'maggiot0987654321';
    
    if (!token) {
      this.setState({ decryptedToken: '' });
      return;
    }
    
    try {
      const bytes = CryptoJS.AES.decrypt(token, key);
      const plaintextToken = bytes.toString(CryptoJS.enc.Utf8);
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
              marginVertical:5,
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
                  }}>{showToken ? 'Sembunyikan Token' : 'Tampilkan Token'}</Text>
              </TouchableOpacity>
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
});