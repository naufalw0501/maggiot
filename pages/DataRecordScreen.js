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
import Average from './components/Average';


const DataRecordScreen = ({ navigation }) => {
  
  const [user, setUser] = useState();
  const [periode, setPeriode] = useState(1);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      console.log("user", JSON.stringify(user));
      setUser(user);
    });
    return subscriber;
  }, []);

  useEffect(() => {
    const periodeRef = database().ref('sistem1/periode');
    periodeRef.on('value', (snapshot) => {
      const periodeValue = snapshot.val();
      setPeriode(periodeValue); // Mengupdate nilai periode dari database
    });
  }, []);

  const [data, setData] = useState([]);


  return (
    <SafeAreaView style={{height: '100%'}}>
    <ScrollView style={{height: '100%'}}>
    <Text style={{
            fontSize:22,
            color: "#224229",
            fontWeight:"bold",
            backgroundColor: 'white',
            textAlign:'center',
            paddingTop:10,
          }}>
            Data Record Periode {periode}
    </Text>
    <Average/>
    <View style={{
          textAlign: "center",
          backgroundColor: 'white',
          alignItems: "center",
          paddingTop: 20,
          paddingBottom: 10,
        }}>
        </View>
        {/* <LineChart
          data={{
            labels: chartData.map((_, index) => (index + 1).toString()),
            datasets: [
              {
                data: chartData.map((record) => record.suhu),
              }
            ],
          }}
          width={400}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(34, 66, 41, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(34, 66, 41, ${opacity})`,
          }}
          bezier
        />
        <LineChart
          data={{
            labels: chartData.map((_, index) => (index + 1).toString()),
            datasets: [
              {
                data: chartData.map((record) => record.kelembapan),
              }
            ],
          }}
          width={400}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(34, 66, 41, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(34, 66, 41, ${opacity})`,
          }}
          bezier
        /> */}
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
        borderWidth:2.5,
        borderColor:'#224229',
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

export default DataRecordScreen;

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
  header0Text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#429C59',
  },
  header1Text: {
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
