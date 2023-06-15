import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  SafeAreaView
} from "react-native";
import auth from "@react-native-firebase/auth";
import database from '@react-native-firebase/database';
import { ScrollView } from "react-native-gesture-handler";
import CryptoJS from "react-native-crypto-js";


const EditMediaScreen = ({ navigation }) => {
  const [user, setUser] = useState();
  const [lokasi, setLokasi] = useState('');
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  const handleShowToken = () => {
    setShowToken(!showToken);
  };

  const [encryptedToken, setEncryptedToken] = useState("");
  const encryptToken = () => {
    const ciphertexttoken = CryptoJS.AES.encrypt(token, 'maggiot0987654321').toString();
    setEncryptedToken(ciphertexttoken);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      console.log("user", JSON.stringify(user));
      setUser(user);
    });
    return subscriber;
  }, []);

  useEffect(() => {
    const ref = database().ref('sistem1/lokasi');
    ref.on('value', (snapshot) => {
      const data = snapshot.val();
      setLokasi(data);
    });

    return () => ref.off('value');
  }, []);

  useEffect(() => {
    if (encryptedToken !== '') {
      updateDataMedia();
    }
  }, [encryptedToken]);


  const updateDataMedia = async () => {
    // Mengubah nilai sistem1/lokasi pada Realtime Database
    database()
      .ref('sistem1/lokasi')
      .set(lokasi)
      .then(() => {
        console.log('Nilai sistem1/lokasi berhasil diubah.');
      })
      .catch((error) => {
        console.log('Gagal mengubah nilai sistem1/lokasi:', error);
      });

    // Mengubah nilai sistem1/token pada Realtime Database
    if (token !== '') {
      database()
        .ref('sistem1/token')
        .set(encryptedToken)
        .then(() => {
          console.log('Nilai sistem1/token berhasil diubah.');
          setEncryptedToken('');
        })
        .catch((error) => {
          console.log('Gagal mengubah nilai sistem1/token:', error);
        });
    }
  };

  const handleButtonPress = async () => {
    encryptToken();
    await updateDataMedia();
    navigation.navigate("KontrolScreen");
  }

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <ScrollView style={{ height: '100%' }}>
        <View style={{
          backgroundColor: 'white',
          paddingTop: 20,
          paddingBottom: 10,
          paddingLeft: 20,
        }}>
          <Text style={{
            fontSize: 22,
            color: "#EE6B19",
            fontWeight: "bold",
          }}>
            Media 001
          </Text>
          <Text style={{
            fontSize: 20,
            color: "#266937",
            fontWeight: "bold",
          }}>
            Lokasi Media : 
          </Text>
          <Text style={{
            fontSize: 18,
            color: "#266937",
            fontWeight: "medium",
            paddingRight: 10,
          }}>
            {lokasi ? lokasi : "Lokasi"}
          </Text>
          <View style={{
            backgroundColor: 'white',
            borderBottomColor: '#D9D9D9',
            borderBottomWidth: 3,
            paddingTop: -10,
            paddingBottom: 10,
            paddingLeft: 20,
            paddingRight: 20,
            marginRight: 20,
          }}>
          </View>
          <Text style={{
            fontSize: 20,
            color: "#266937",
            fontWeight: "bold",
            marginTop: 10,
            marginBottom:4,
          }}>
            Edit Lokasi
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan lokasi"
            value={lokasi}
            onChangeText={(text) => setLokasi(text)}
          />
          <Text style={{
            fontSize: 20,
            color: "#266937",
            fontWeight: "bold",
            marginTop: 10,
            marginBottom:4,
          }}>
            Edit Token
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan token"
            autoCapitalize="none"
            keyboardType="default"
            returnKeyType="next"
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
            secureTextEntry={!showToken}
            value={token}
            onChangeText={(text) => setToken(text)}
          />
          <TouchableOpacity 
          style={{
            alignItems: 'flex-end',
            marginRight: 20,
            marginTop:5,
          }}
           onPress={handleShowToken}>
            <Text
            style={{
              textDecorationLine: 'underline',
              fontWeight: '500',
              color: '#266937',
            }}>{showToken ? 'Sembunyikan Token' : 'Tampilkan Token'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleButtonPress}
          >
            <Text style={styles.buttonTextStyle}>Update Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditMediaScreen;


const styles = StyleSheet.create({
  buttonStyle: {
    minWidth: 300,
    backgroundColor: "#266937",
    borderWidth: 0,
    color: "#FFFFFF",
    height: 40,
    alignItems: "center",
    borderRadius: 10,
    marginRight: 20,
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
  buttonTextStyle2: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
  header2Text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#266937',
  },
  input: {
    flex: 1,
    color: "#266937",
    paddingLeft: 15,
    paddingRight: 15,
    marginRight:20,
    borderWidth: 1,
    borderRadius: 10,
    height:40,
    borderColor: "#266937",
  },
});
