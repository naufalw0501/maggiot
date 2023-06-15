// #6 Email Authentication using Firebase Authentication in React Native App
// https://aboutreact.com/react-native-firebase-authentication/

// Import React and Component
import React, { useState, createRef, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

import messaging from '@react-native-firebase/messaging';
import auth from "@react-native-firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errortext, setErrortext] = useState("");

  const passwordInputRef = createRef();

  const handleSubmitPress = () => {
    setErrortext("");
    if (!userEmail) {
      alert("Please fill Email");
      return;
    }
    if (!userPassword) {
      alert("Please fill Password");
      return;
    }
    auth()
      .signInWithEmailAndPassword(userEmail, userPassword)
      .then((user) => {
        console.log(user);
        // If server response message same as Data Matched
        if (user) navigation.replace("HomeScreen");
      })
      .catch((error) => {
        console.log(error);
        if (error.code === "auth/invalid-email")
          setErrortext(error.message);
        else if (error.code === "auth/user-not-found")
          setErrortext("No User Found");
        else {
          setErrortext(
            "Please check your email id or password"
          );
        }
      });
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  async function getToken() {
    const fcmToken = await messaging().getToken();
    console.log(fcmToken);
  }

  useEffect(() => {
    requestUserPermission();
    getToken();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.mainBody}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("./img/logomaggiot.png")}
                style={{
                  width: "50%",
                  height: 200,
                  resizeMode: "contain",
                  marginTop: 20,
                  marginBottom: 15,
                  marginHorizontal: 30,
                }}
              />
              <Text style={styles.logoTextStyle}>
              MAGGIOT
              </Text>
              <Text style={styles.logoTextStyle2}>
              Sistem Otomasi Maggot BSF Berbasis IoT
              </Text>
            </View>
            <View style={styles.sectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserEmail) =>
                  setUserEmail(UserEmail)
                }
                placeholder="Enter Email"
                placeholderTextColor="#95B9AD"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current &&
                  passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.sectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserPassword) =>
                  setUserPassword(UserPassword)
                }
                placeholder="Enter Password"
                placeholderTextColor="#95B9AD"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>
            {errortext != "" ? (
              <Text style={styles.errorTextStyle}>
                {" "}
                {errortext}{" "}
              </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}
            >
              <Text style={styles.buttonTextStyle}>
                LOGIN
              </Text>
            </TouchableOpacity>
            <Text
              style={styles.registerTextStyle}
              onPress={() =>
                navigation.navigate("RegisterScreen")
              }
            >
              Register Disini
            </Text>
          </KeyboardAvoidingView>
        </View>
      <Text
        style={{
          fontSize: 16,
          textAlign: "center",
          color: "#EE6B19",
          fontWeight: "bold",
          paddingBottom: 5,
          paddingTop: 5,
        }}
      >
        Created By :
      </Text>
      <Text
        style={{
          fontSize: 12,
          textAlign: "center",
          color: "#224229",
          paddingBottom: 5,
        }}
      >
        Naufal Wijaya 21060119120002
      </Text>
      <Text
        style={{
          fontSize: 12,
          textAlign: "center",
          color: "#224229",
          paddingBottom: 5,
        }}
      >
        Rico Dika Pamungkas 21060119120012
      </Text>
      <Text
        style={{
          fontSize: 12,
          textAlign: "center",
          color: "#224229",
          paddingBottom: 5,
          marginBottom:5,
        }}
      >
        Kadek Wahyu Dwi Putra Subrata 21060119130062
      </Text>
      </ScrollView>
      
    </SafeAreaView>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    alignContent: "center",
  },
  sectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: "#266937",
    borderWidth: 0,
    color: "#FFFFFF",
    height: 40,
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: "#266937",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#266937",
  },
  logoTextStyle: {
    color: "#EE6B19",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    paddingVertical: 2,
    alignSelf: "center",
  },
  logoTextStyle2: {
    color: "#266937",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    paddingTop: 2,
    paddingBottom: 20,
    alignSelf: "center",
  },
  registerTextStyle: {
    color: "#224229",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    alignSelf: "center",
    paddingBottom: 20,
    paddingTop: 0,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
});