import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import database from '@react-native-firebase/database';

class Average extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data: {},
        periode: 1,
        perHari: [],
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

  calculateAverages = () => {
    const { data } = this.state;
    const averages = {
      faseTelur: {
        averageSuhu: 0,
        averageKelembapan: 0,
      },
      faseLarva: {
        averageSuhu: 0,
        averageKelembapan: 0,
      },
      perHari: [],
    };
  
    for (const hari in data) {
      const readings = data[hari];
      let totalSuhu = 0;
      let totalKelembapan = 0;
      let numReadings = 0;
  
      for (const timestamp in readings) {
        if (timestamp !== 'loop') {
          const reading = readings[timestamp];
          totalSuhu += reading.suhu;
          totalKelembapan += reading.kelembapan;
          numReadings++;
        }
      }
  
      if (numReadings > 0) {
        const averageSuhu = totalSuhu / numReadings;
        const averageKelembapan = totalKelembapan / numReadings;
  
        if (parseInt(hari.slice(1)) <= 3) {
          averages.faseTelur.averageSuhu += averageSuhu;
          averages.faseTelur.averageKelembapan += averageKelembapan;
        } else {
          averages.faseLarva.averageSuhu += averageSuhu;
          averages.faseLarva.averageKelembapan += averageKelembapan;
        }
  
        averages.perHari.push({
          hari: parseInt(hari.slice(1)),
          averageSuhu,
          averageKelembapan,
        });
      }
    }
  
    const numDaysFaseTelur = Math.min(Object.keys(data).length, 3);
    const numDaysFaseLarva = Math.max(Object.keys(data).length - 3, 0);

    averages.faseTelur.averageSuhu /= numDaysFaseTelur;
    averages.faseTelur.averageKelembapan /= numDaysFaseTelur;

    averages.faseLarva.averageSuhu /= numDaysFaseLarva;
    averages.faseLarva.averageKelembapan /= numDaysFaseLarva;


    const numDays = Object.keys(data).length;
    const totalAverageSuhu = averages.perHari.reduce((total, curr) => total + curr.averageSuhu, 0);
    const totalAverageKelembapan = averages.perHari.reduce((total, curr) => total + curr.averageKelembapan, 0);
    const averagePerHari = {
      hari: 'Total',
      averageSuhu: totalAverageSuhu / numDays,
      averageKelembapan: totalAverageKelembapan / numDays,
    };
    averages.perHari.push(averagePerHari);
        
    return averages;
  };
    
  render() {
    const averages = this.calculateAverages();
    const faseTelurAverageSuhu = averages.faseTelur.averageSuhu.toFixed(2);
    const faseTelurAverageKelembapan = averages.faseTelur.averageKelembapan.toFixed(2);
    const faseLarvaAverageSuhu = averages.faseLarva.averageSuhu.toFixed(2);
    const faseLarvaAverageKelembapan = averages.faseLarva.averageKelembapan.toFixed(2);
  

    return (
      <View>
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
              {faseTelurAverageSuhu}°C
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
              {faseTelurAverageKelembapan}%
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
              {faseLarvaAverageSuhu}°C
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
              {faseLarvaAverageKelembapan}%
              </Text>
              </View>
            </View>
          </View>
          </View>
          </View>

        {/* Fase Telur */}
        <View style={styles.tablesection}>
          <Text style={styles.headerText}>Fase Telur</Text>
        <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Hari Ke-</Text>
            <Text style={styles.headerCell}>Suhu</Text>
            <Text style={styles.headerCell}>Kelembapan</Text>
        </View>
        <View style={styles.tableBody}>
        {averages.perHari
            .sort((a, b) => a.hari - b.hari)
            .map((average, index) => {
            if (average.hari <= 3) {
                return (
                <View key={index} style={styles.tableRow}>
                    <Text style={styles.cell1}>{average.hari}</Text>
                    <Text style={styles.cell2}>{average.averageSuhu.toFixed(2)}°C</Text>
                    <Text style={styles.cell2}>{average.averageKelembapan.toFixed(2)}%</Text>
                </View>
                );
            } else {
                return null;
            }
            })}
        </View>
        </View>

        {/* Fase Larva */}
        <View style={styles.tablesection}>
          <Text style={styles.headerText}>Fase Larva</Text>
        <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Hari Ke-</Text>
            <Text style={styles.headerCell}>Suhu</Text>
            <Text style={styles.headerCell}>Kelembapan</Text>
        </View>
        <View style={styles.tableBody}>
        {averages.perHari
            .sort((a, b) => a.hari - b.hari)
            .map((average, index) => {
            if (average.hari > 3) {
                return (
                <View key={index} style={styles.tableRow}>
                    <Text style={styles.cell1}>{average.hari}</Text>
                    <Text style={styles.cell2}>{average.averageSuhu.toFixed(2)}°C</Text>
                    <Text style={styles.cell2}>{average.averageKelembapan.toFixed(2)}%</Text>
                </View>
                );
            } else {
                return null;
            }
            })}
        </View>
        </View>
        
      </View>
    );
  }
}

export default Average;

const styles = StyleSheet.create({
  tablesection: {
    backgroundColor: 'white',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    height: 25,
    resizeMode: 'contain',
    marginRight: 10,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#266937',
  },
  value: {
    fontSize: 16,
    color: '#266937',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#429C59',
    marginBottom: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
    borderBottomColor: '#EE6B19',
    borderBottomWidth: 2,
    marginBottom: 5,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#266937',
  },
  tableBody: {
    marginTop: 1,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  cell1: {
    flex: 1,
    marginRight: 10,
    fontSize: 16,
    color: '#EE6B19',
  },
  cell2: {
    flex: 1,
    marginRight: 10,
    fontSize: 16,
    color: '#266937',
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
    fontSize: 13,
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
});
