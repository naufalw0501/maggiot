import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import auth from "@react-native-firebase/auth";
import database from '@react-native-firebase/database';
import { ScrollView } from "react-native-gesture-handler";
import Aktuator from "./components/Aktuator";


const AktuatorScreen = ({ navigation }) => {
  
  const [user, setUser] = useState();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      console.log("user", JSON.stringify(user));
      setUser(user);
    });
    return subscriber;
  }, []);

  const [data, setData] = useState([]);

  useEffect(() => {
    const dataRef = database().ref('recorddata');
    dataRef.on('value', (snapshot) => {
      const records = snapshot.val();
      const recordList = [];
      for (let id in records) {
        recordList.push({ id, ...records[id] });
      }
      setData(recordList);
    });
  }, []);

  // Extract suhu and kelembapan data from records for chart
  const chartData = data.map((record) => ({
    id: record.id,
    suhu: record.suhu,
    kelembapan: record.kelembapan,
  }));

  const sortedData = data.slice().sort((a, b) => b.id.localeCompare(a.id));

  return (
    <SafeAreaView style={{height: '100%'}}>
    <ScrollView style={{height: '100%'}}>
    <View style={{
          textAlign: "center",
          backgroundColor: 'white',
          alignItems: "center",
          paddingTop: 20,
          paddingBottom: 10,
        }}>
          <Text style={{
            fontSize:22,
            color: "#224229",
            fontWeight:"bold",
          }}>
            Aktuator
          </Text>
        </View>
        <Aktuator/>
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
        borderRightWidth:2,
        borderRightColor:'white',
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
        borderWidth:2.5,
        borderColor:'#224229',
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

export default AktuatorScreen;

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
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom:5,
    borderBottomColor: '#EE6B19',
    borderBottomWidth: 2,
    flex:1,
    marginBottom: 5,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#266937',
  },
  header2Text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#266937',
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  cell1: {
    fontSize: 16,
    color:'#EE6B19',
    fontWeight: 'semibold',
  },
  cell2: {
    fontSize: 16,
    color: '#266937',
  },
});
