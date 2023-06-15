// #6 Email Authentication using Firebase Authentication in React Native App
// https://aboutreact.com/react-native-firebase-authentication/
import "react-native-gesture-handler";

// Import React and Component
import React, { useEffect, useState } from "react";
import {Alert} from "react-native";
// Import Navigators from React Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import Screens
import SplashScreen from "./pages/SplashScreen";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import HomeScreen from "./pages/HomeScreen";
import KontrolScreen from "./pages/KontrolScreen";
import MonitoringScreen from "./pages/MonitoringScreen";
import DataRecordScreen from "./pages/DataRecordScreen";
import EditMediaScreen from "./pages/EditMediaScreen";
import AktuatorScreen from "./pages/AktuatorScreen";
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import database from '@react-native-firebase/database';


const Stack = createStackNavigator();
const createNotificationChannel = async () => {
  const channel = await notifee.createChannel({
    id: 'channel_id',
    name: 'Channel Name'
    // Properti lainnya
  });
};
const Auth = () => {
  
  // Stack Navigator for Login and Sign up Screen
  
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          title: "Register", //Set Header Title
          headerStyle: {
            backgroundColor: "white", //Set Header color
          },
          headerTintColor: "#07432F", //Set Header text color
          headerTitleStyle: {
            fontWeight: "bold", //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

/* Main Navigator */
const App = () => {
  const [mediaId, setMediaId] = useState(""); // State untuk menyimpan id dari Firebase

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

  async function setBackgroundMessageHandler() {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });
  }

  const getMediaId = async () => {
    try {
      const snapshot = await database()
        .ref("sistem1/id")
        .once("value");
      const id = snapshot.val();
      setMediaId(id);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    requestUserPermission();
    getToken();
    setBackgroundMessageHandler();
    getMediaId();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title, 
      remoteMessage.notification?.body,
      );
    });

    return unsubscribe;

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      navigation.navigate(remoteMessage.data.type);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        setLoading(false);
      });




  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        {/* SplashScreen which will come once for 2 Seconds */}
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          // Hiding header for Splash Screen
          options={{ headerShown: false }}
        />
        {/* Auth Navigator which include Login Signup */}
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            title: "Home", //Set Header Title
            headerStyle: {
              backgroundColor: "white", //Set Header color
            },
            headerTintColor: "#266937", //Set Header text color
            headerTitleStyle: {
              fontWeight: "bold", //Set Header text style
            },
          }}
        />
        <Stack.Screen
          name="KontrolScreen"
          component={KontrolScreen}
          options={{
            title: `Media ${mediaId}`, //Set Header Title
            headerStyle: {
              backgroundColor: "white", //Set Header color
            },
            headerTintColor: "#266937", //Set Header text color
            headerTitleStyle: {
              fontWeight: "bold", //Set Header text style
            },
          }}
        />
        <Stack.Screen
          name="EditMediaScreen"
          component={EditMediaScreen}
          options={{
            title: `Media ${mediaId}`, //Set Header Title
            headerStyle: {
              backgroundColor: "white", //Set Header color
            },
            headerTintColor: "#266937", //Set Header text color
            headerTitleStyle: {
              fontWeight: "bold", //Set Header text style
            },
          }}
        />
        <Stack.Screen
          name="MonitoringScreen"
          component={MonitoringScreen}
          options={{
            title: `Media ${mediaId}`, //Set Header Title
            headerStyle: {
              backgroundColor: "white", //Set Header color
            },
            headerTintColor: "#266937", //Set Header text color
            headerTitleStyle: {
              fontWeight: "bold", //Set Header text style
            },
          }}
        />
        <Stack.Screen
          name="DataRecordScreen"
          component={DataRecordScreen}
          options={{
            title: `Media ${mediaId}`, //Set Header Title
            headerStyle: {
              backgroundColor: "white", //Set Header color
            },
            headerTintColor: "#266937", //Set Header text color
            headerTitleStyle: {
              fontWeight: "bold", //Set Header text style
            },
          }}
        />
        <Stack.Screen
          name="AktuatorScreen"
          component={AktuatorScreen}
          options={{
            title: `Media ${mediaId}`, //Set Header Title
            headerStyle: {
              backgroundColor: "white", //Set Header color
            },
            headerTintColor: "#266937", //Set Header text color
            headerTitleStyle: {
              fontWeight: "bold", //Set Header text style
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

