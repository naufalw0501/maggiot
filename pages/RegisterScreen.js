import React, { useState, createRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import auth from "@react-native-firebase/auth";

const RegisterScreen = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errortext, setErrortext] = useState("");

  const emailInputRef = createRef();
  const passwordInputRef = createRef();

  const handleSubmitButton = () => {
    setErrortext("");
    if (!userName) return alert("Masukkan Name");
    if (!userEmail) return alert("Masukkan Email");
    if (!userPassword) return alert("Masukkan Password");

    auth()
      .createUserWithEmailAndPassword(
        userEmail,
        userPassword
      )
      .then((user) => {
        console.log(
          "Registrasi Berhasil."
        );
        console.log(user);
        if (user) {
          auth()
            .currentUser.updateProfile({
              displayName: userName,
            })
            .then(() => navigation.replace("HomeScreen"))
            .catch((error) => {
              alert(error);
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.code === "auth/email-already-in-use") {
          setErrortext(
            "Email Telah Digunakan"
          );
        } else {
          setErrortext(error.message);
        }
      });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: "center",
          alignContent: "center",
        }}
      >
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
        <KeyboardAvoidingView enabled>
          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserName) =>
                setUserName(UserName)
              }
              underlineColorAndroid="#f000"
              placeholder="Enter Name"
              placeholderTextColor="#95B9AD"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                emailInputRef.current &&
                emailInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserEmail) =>
                setUserEmail(UserEmail)
              }
              underlineColorAndroid="#f000"
              placeholder="Enter Email"
              placeholderTextColor="#95B9AD"
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current &&
                passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserPassword) =>
                setUserPassword(UserPassword)
              }
              underlineColorAndroid="#f000"
              placeholder="Enter Password"
              placeholderTextColor="#95B9AD"
              ref={passwordInputRef}
              returnKeyType="next"
              secureTextEntry={true}
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
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
            onPress={handleSubmitButton}
          >
            <Text style={styles.buttonTextStyle}>
              REGISTER
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
        }}
      >
        Kadek Wahyu Dwi Putra Subrata 21060119130062
      </Text>
      </ScrollView>
    </SafeAreaView>
  );
};
export default RegisterScreen;

const styles = StyleSheet.create({
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
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
});