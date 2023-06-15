import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import database from '@react-native-firebase/database';

export default class Status extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '1',
      timereset: '0',
    };
  }

  componentDidMount() {
    database()
    .ref('sistem1')
    .on('value', snapshot => {
      const data = snapshot.val();
      
      this.setState({
        status:data.status,
        timereset:data.timereset,
        periode:data.periode,
        });
      });
  }

  updateStatus = (value) => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin melakukan tindakan ini?',
      [
        {
          text: 'Tidak',
          style: 'cancel'
        },
        {
          text: 'Ya',
          onPress: () => {
            database()
              .ref('sistem1/status/')
              .set(value)
              .then(() => console.log('Status berhasil diupdate'))
              .catch(error => console.log('Gagal mengupdate status:', error));

            this.setState({
              status: value,
            });
          }
        }
      ]
    );
  };

  updateTimereset = (value) => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin mereset waktu kontrol menjadi Hari 0 (Fase Telur)?',
      [
        {
          text: 'Tidak',
          style: 'cancel'
        },
        {
          text: 'Ya',
          onPress: () => {
            database()
              .ref('sistem1')
              .transaction((data) => {
                if (data) {
                  data.timereset = value;
                  data.periode = (data.periode || 0) + 1; // Tambahkan 1 ke periode
                }
                return data;
              })
              .then(() => console.log('Status berhasil diupdate'))
              .catch((error) => console.log('Gagal mengupdate status:', error));
          }
        }
      ]
    );
  };
  

  getStatusText = () => {
    return this.state.status <= 1 ? 'Kontrolling Hidup' : 'Kontrolling Mati';
  }

  render() {
    return (
      <View>
        <View style={{
            borderWidth:3,
            borderRadius:10,
            marginVertical:0,
            marginHorizontal:0,
            paddingVertical:15,
            paddingHorizontal:0,
            borderColor:'#429C59',
            backgroundColor:'white',
        }}>
            <Text style={styles.statusTextStyle}>Status : {this.getStatusText()}</Text>
            <View style={{
                flexDirection: 'row',
                height: 40,
                paddingVertical: 0,
                marginVertical:2,
                paddingHorizontal: 0,

            }}>
            <TouchableOpacity onPress={() => this.updateStatus(1)} 
                style={{
                backgroundColor: '#266937', 
                padding: 10, 
                marginHorizontal:30,
                marginLeft: 10,
                marginRight: 10,
                borderRadius: 10, 
                flex: 0.33,}}>
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', alignSelf: "center",
                }}>
                Hidupkan
            </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.updateStatus(2)} 
                style={{
                backgroundColor: '#A51010', 
                padding: 10, 
                borderRadius: 10, 
                flex: 0.33,}}>
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', alignSelf: "center",
                }}>
                Matikan
            </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.updateTimereset(1)} 
                style={{
                backgroundColor: '#EE6B19', 
                padding: 10, 
                marginHorizontal:30,
                marginLeft: 10,
                marginRight: 10,
                borderRadius: 10, 
                flex: 0.34,}}>
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center', alignSelf: "center",
                }}>
                Reset Fase
            </Text>
            </TouchableOpacity>
            </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    statusTextStyle: {
      fontSize:22,
      paddingBottom: 13,
      fontWeight: "bold",
      textAlign: "left",
      color: "#224229",
      paddingLeft: 0,
      textAlign: 'center',
    },
  });
