import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { ProgressBar } from 'react-native-paper';
import database from '@react-native-firebase/database';
const crypto = require('./crypto');
global.Buffer = require('buffer').Buffer;

class Average extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}, 
      periode: 1,
    };
  }

  componentDidMount() {
    database()
      .ref('sistem1/periode')
      .once('value')
      .then((snapshot) => {
        const periode = snapshot.val();
        this.setState({ periode });
        return periode;
      })
      .then((periode) => {
        database()
          .ref(`recorddata1p${periode}`)
          .once('value')
          .then((snapshot) => {
            const data = snapshot.val();
            this.setState({ data });
            console.log(data);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }


  render() {
    const data = this.state.data;
    const periode = this.state.periode;
    const tableData = [];

    let totalSuhuTelur = 0;
    let totalKelembapanTelur = 0;
    let totalLoopTelur = 0;

    let totalSuhuLarva = 0;
    let totalKelembapanLarva = 0;
    let totalLoopLarva = 0;

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const sumsuhu = data[key].sumsuhu;
        const sumkelembapan = data[key].sumkelembapan;
        const loop = data[key].loop;

        const meansuhu = (sumsuhu / loop).toFixed(2);
        const meankelembapan = (sumkelembapan / loop).toFixed(2);
        tableData.push({
          h: `h${key}`,
          meansuhu,
          meankelembapan
        });

        if (key === 'h1' || key === 'h2' || key === 'h3') {
          totalSuhuTelur += sumsuhu;
          totalKelembapanTelur += sumkelembapan;
          totalLoopTelur += loop;
        } else {
          totalSuhuLarva += sumsuhu;
          totalKelembapanLarva += sumkelembapan;
          totalLoopLarva += loop;
        }
      }
    }

const avgSuhuTelur = (totalSuhuTelur / totalLoopTelur).toFixed(2);
const avgKelembapanTelur = (totalKelembapanTelur / totalLoopTelur).toFixed(2);

const avgSuhuLarva = (totalSuhuLarva / totalLoopLarva).toFixed(2);
const avgKelembapanLarva = (totalKelembapanLarva / totalLoopLarva).toFixed(2);


    return (
      <View style={{
        backgroundColor: 'white',
        }}>
        <View>
            <View style={{
            backgroundColor: 'white',
            }}>
            <View style={{
              backgroundColor:'#429C59',
              borderRadius:10,
              height:50,
              width:170,
              marginBottom:-30,
              marginTop:19,
              flexDirection:'row',
              marginHorizontal:10,
            }}>
            <Image
              source={require("../img/eggicon.png")}
              style={{
                height: 25,
                resizeMode:'contain',
                flex:0.3,
                marginTop:6,
                marginLeft:-4,
              }}
            />
            <Text style={{
              color:'white',
              paddingLeft:30,
              fontSize:20,
              fontWeight:'bold',
              flex:0.7,
              marginTop:5,
              marginLeft:-30
            }}>
              Fase Telur
            </Text>
            </View>
          <View
            style={{
              flexDirection: 'row',
              height: 130,
              paddingTop: 15,
              paddingBottom: 0,
              marginHorizontal:10,
              paddingHorizontal: 0,
            }}>
            <View style={{
              height: '100%',
              width: '80%',
              borderRadius: 10,
              backgroundColor: '#266937',
              marginLeft: 0,
              marginRight: 0,
              flexDirection:'row',
              flex: 1}}>
              <View
                style={{
                  flexDirection: 'column',
                  height: 100,
                  flex: 0.5,
                  marginLeft: 15,
                }}>
              <Text style={styles.nilaiTextStyle}>
                  Rata Rata Suhu
              </Text>              
              <Text style={styles.nilai2TextStyle}>
                  {avgSuhuTelur}°C
              </Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  height: 100,
                  flex:0.5,
                }}>              
              <Text style={styles.nilaiTextStyle}>
                  Rata Rata Kelembapan
              </Text>              
              <Text style={styles.nilai2TextStyle}>
                  {avgKelembapanTelur}%
              </Text>
              </View>
            </View>
          </View>
          </View>
          <View style={{
            backgroundColor: 'white',
            }}>
            <View style={{
              backgroundColor:'#429C59',
              borderRadius:10,
              height:50,
              width:170,
              marginBottom:-30,
              marginTop:19,
              flexDirection:'row',
              marginHorizontal:10,
            }}>
            <Image
              source={require("../img/maggoticon.png")}
              style={{
                height: 10,
                resizeMode:'contain',
                flex:0.3,
                marginTop:15,
                marginLeft:0,
              }}
            />
            <Text style={{
              color:'white',
              paddingLeft:30,
              fontSize:20,
              fontWeight:'bold',
              flex:0.7,
              marginTop:5,
              marginLeft:-30
            }}>
              Fase Larva
            </Text>
            </View>
          <View
            style={{
              flexDirection: 'row',
              height: 130,
              paddingTop: 15,
              paddingBottom: 0,
              marginHorizontal:10,
              paddingHorizontal: 0,
            }}>
            <View style={{
              height: '100%',
              width: '80%',
              borderRadius: 10,
              backgroundColor: '#266937',
              marginLeft: 0,
              marginRight: 0,
              flexDirection:'row',
              flex: 1}}>
              <View
                style={{
                  flexDirection: 'column',
                  height: 100,
                  flex: 0.5,
                  marginLeft: 15,
                }}>
              <Text style={styles.nilaiTextStyle}>
                  Rata Rata Suhu
              </Text>              
              <Text style={styles.nilai2TextStyle}>
                  {avgSuhuLarva}°C
              </Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  height: 100,
                  flex:0.5,
                }}>              
              <Text style={styles.nilaiTextStyle}>
                  Rata Rata Kelembapan
              </Text>              
              <Text style={styles.nilai2TextStyle}>
                  {avgKelembapanLarva}%
              </Text>
              </View>
            </View>
          </View>
          </View>
          </View>
          <View style={{
            marginLeft:10,
            marginRight:10,
            marginTop:20,
          }}>
          <Text style={styles.header0Text}>Fase Telur</Text>
          <View style={styles.header}>
            <View style={styles.headerCell}>
              <Text style={styles.header1Text}>Hari Ke-</Text>
            </View>
            <View style={styles.headerCell}>
              <Text style={styles.header2Text}>Suhu</Text>
            </View>
            <View style={styles.headerCell}>
              <Text style={styles.header2Text}>Kelembapan</Text>
            </View>
          </View>
          <View style={styles.body}>
            {tableData
              .filter(item => parseInt(item.h.slice(2)) <= 3)
              .sort((a, b) => parseInt(a.h.slice(2)) - parseInt(b.h.slice(2)))
              .map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell1}>{parseInt(item.h.slice(2))}</Text>
                  <Text style={styles.tableCell2}>{item.meansuhu}°C</Text>
                  <Text style={styles.tableCell2}>{item.meankelembapan}%</Text>
                </View>
              ))}
          </View>
          
          <Text style={styles.header0Text}>Fase Larva</Text>
          <View style={styles.header}>
            <View style={styles.headerCell}>
              <Text style={styles.header1Text}>Hari Ke-</Text>
            </View>
            <View style={styles.headerCell}>
              <Text style={styles.header2Text}>Suhu</Text>
            </View>
            <View style={styles.headerCell}>
              <Text style={styles.header2Text}>Kelembapan</Text>
            </View>
          </View>
          <View style={styles.body}>
            {tableData
              .filter(item => parseInt(item.h.slice(2)) > 3)
              .sort((a, b) => parseInt(a.h.slice(2)) - parseInt(b.h.slice(2)))
              .map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell1}>{parseInt(item.h.slice(2))}</Text>
                  <Text style={styles.tableCell2}>{item.meansuhu}°C</Text>
                  <Text style={styles.tableCell2}>{item.meankelembapan}%</Text>
                </View>
              ))}
          </View>
          </View>
        </View>
    );
  }
}

export default Average;




const styles = StyleSheet.create({
  tableHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
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
  tableCell1: {
    flex: 1,
    fontSize: 16,
    color:'#EE6B19',
    marginRight: 10,
  },
  tableCell2: {
    flex: 1,
    fontSize: 16,
    color: '#266937',
    marginRight: 10,
  },
  nilaiTextStyle: {
    height: '90%',
    width: '90%',
    borderRadius: 10,
    backgroundColor: 'white',
    color:'#003D38',
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
    paddingTop:3,
    marginTop: 30,
    marginBottom: -45,
  },
  nilai2TextStyle: {
    height: '90%',
    width: '90%',
    borderRadius: 10,
    backgroundColor: 'white',
    color:'#EE6B19',
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 35,
    marginTop: 13,
  },  
  barTextStyle: {
    color:'white',
  }
});