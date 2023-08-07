
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
} from "react-native";

import auth from "@react-native-firebase/auth";

const SplashScreen = ({ navigation }) => {
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      navigation.replace(
        auth().currentUser ? "HomeScreen" : "Auth"
      );
    }, 5000);
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <View style={styles.container}>
        <Image
          source={require("./img/logomaggiotfull.png")}
          style={{
            width: "70%",
            resizeMode: "contain",
            margin: 30,
          }}
        />
        <ActivityIndicator
          animating={animating}
          color="#FFFFFF"
          size="large"
          style={styles.activityIndicator}
        />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
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
});