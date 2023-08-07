import React, { useEffect, useState, Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image
} from "react-native";
import auth from "@react-native-firebase/auth";
import Suhu from './components/Suhu';
import Kelembapan from './components/Kelembapan';
import { ScrollView } from "react-native-gesture-handler";

const Media1Screen = ({ navigation }) => {
  
  const [user, setUser] = useState();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      console.log("user", JSON.stringify(user));
      setUser(user);
    });
    return subscriber;
  }, []);

  return (
    <SafeAreaView style={{height: '100%'}}>
    <ScrollView style={{height: '100%'}}>
      <View style={{ flex: 1, padding: 16 }}>
        <View>
          <Suhu/>
          <Kelembapan/>
          {/* <FirebaseData/> */}
        </View>
      </View>
    </ScrollView>
    <View style={{
        height:50,
        backgroundColor:'#429C59',
        borderTopWidth:2,
        borderTopColor:'white',
        borderBottomWidth:2,
        borderBottomColor:'white',
        flexDirection:'row',
    }}>
    <TouchableOpacity style={{
        borderRightWidth:2,
        borderRightColor:'white',
        flex:0.25,
        alignItems:'center',}}              
        onPress={() =>
        navigation.navigate("KontrolScreen")
        }  
    >
        <Image
          source={require("./img/controlicon.png")}
          style={{
              height:20,
              width:'80%',
              resizeMode: 'contain',
              marginLeft:5,
              marginTop:5,
        }}/>
        <Text style={styles.buttonTextStyle2}>
            Kontrol
        </Text>
    </TouchableOpacity>
    <TouchableOpacity style={{
        borderWidth:2.5,
        borderColor:'#224229',
        flex:0.25,
        alignItems:'center',}}  
        onPress={() =>
          navigation.navigate("MonitoringScreen")}            
    >
        <Image
          source={require("./img/monitoringicon.png")}
          style={{
              height:20,
              width:'80%',
              resizeMode: 'contain',
              marginLeft:5,
              marginTop:5,
        }}/>
        <Text style={styles.buttonTextStyle2}>
            Monitoring
        </Text>
    </TouchableOpacity>
    <TouchableOpacity style={{
        borderRightWidth:2,
        borderRightColor:'white',
        flex:0.25,
        alignItems:'center',}}
        onPress={() =>
          navigation.navigate("DataRecordScreen")}               
    >
        <Image
          source={require("./img/datarecordicon.png")}
          style={{
              height:20,
              width:'80%',
              resizeMode: 'contain',
              marginLeft:5,
              marginTop:5,
        }}/>
        <Text style={styles.buttonTextStyle2}>
            Data Record
        </Text>
    </TouchableOpacity>    
    <TouchableOpacity style={{
        borderLeftWidth:2,
        borderLeftColor:'white',
        flex:0.25,
        alignItems:'center',}}
        onPress={() =>
          navigation.navigate("AktuatorScreen")}               
    >
        <Image
          source={require("./img/actuatoricon.png")}
          style={{
              height:20,
              width:'80%',
              resizeMode: 'contain',
              marginLeft:5,
              marginTop:5,
        }}/>
        <Text style={styles.buttonTextStyle2}>
            Aktuator
        </Text>
    </TouchableOpacity>
    </View>

    </SafeAreaView>
  );
};

export default Media1Screen;

const styles = StyleSheet.create({
  buttonStyle: {
    minWidth: 300,
    backgroundColor: "#00875A",
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
  buttonTextStyle2: {
    color: "#FFFFFF",
    paddingTop: 0,
    fontWeight: "bold",
    fontSize:12,
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
    color: "#07432F",
    paddingBottom: 3,
    paddingTop: 5,
    paddingLeft: 0,
  },
  welcomeTextStyle2: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "left",
    color: "#CD800C",
    paddingBottom: 20,
    paddingLeft: 0,
  },
});