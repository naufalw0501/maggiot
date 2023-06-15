// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
// } from "react-native";
// import auth from "@react-native-firebase/auth";
// import database from '@react-native-firebase/database';
// import { ScrollView } from "react-native-gesture-handler";
// import { LineChart } from "react-native-chart-kit";


// class Grafik extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       kelembapan: '0',
//       peringatankelembapan: '0',
//     };
//   }

//   componentDidMount() {
//     database()
//       .ref('sistem1')
//       .on('value', snapshot => {
//         const data = snapshot.val();
        
//         this.setState({
//           kelembapan:data.kelembapan,
//           peringatankelembapan:data.peringatankelembapan,
//         })
//       });
//   }


  
//   render() {
//     return (
//     <View style={{height: '100%'}}>
//     <ScrollView style={{height: '100%'}}>
//     <View style={{
//           textAlign: "center",
//           backgroundColor: 'white',
//           alignItems: "center",
//           paddingTop: 20,
//           paddingBottom: 10,
//         }}>
//           <Text style={{
//             fontSize:22,
//             color: "#224229",
//             fontWeight:"bold",
//           }}>
//             Grafik Data Record
//           </Text>
//         </View>
//         <LineChart
//           data={{
//             labels: chartData.map((_, index) => (index + 1).toString()),
//             datasets: [
//               {
//                 data: chartData.map((record) => record.suhu),
//               }
//             ],
//           }}
//           width={400}
//           height={220}
//           chartConfig={{
//             backgroundColor: "#ffffff",
//             backgroundGradientFrom: "#ffffff",
//             backgroundGradientTo: "#ffffff",
//             decimalPlaces: 2,
//             color: (opacity = 1) => `rgba(34, 66, 41, ${opacity})`,
//             labelColor: (opacity = 1) => `rgba(34, 66, 41, ${opacity})`,
//           }}
//           bezier
//         />
//         <LineChart
//           data={{
//             labels: chartData.map((_, index) => (index + 1).toString()),
//             datasets: [
//               {
//                 data: chartData.map((record) => record.kelembapan),
//               }
//             ],
//           }}
//           width={400}
//           height={220}
//           chartConfig={{
//             backgroundColor: "#ffffff",
//             backgroundGradientFrom: "#ffffff",
//             backgroundGradientTo: "#ffffff",
//             decimalPlaces: 2,
//             color: (opacity = 1) => `rgba(34, 66, 41, ${opacity})`,
//             labelColor: (opacity = 1) => `rgba(34, 66, 41, ${opacity})`,
//           }}
//           bezier
//         />
//         <View style={styles.container}>
//           <View style={styles.header}>
//             <Text style={styles.headerText}>No</Text>
//             <Text style={styles.headerText}>Waktu</Text>
//             <Text style={styles.header2Text}>Suhu</Text>
//             <Text style={styles.header2Text}>Kelembapan</Text>
//           </View>
//           <View style={styles.body}>
//             {data.map((record, index) => (
//               <View key={record.id} style={styles.row}>
//                 <Text style={styles.cell1}>{index + 1}</Text>
//                 <Text style={styles.cell1}>{record.id}</Text>
//                 <Text style={styles.cell2}>{record.suhu}°C</Text>
//                 <Text style={styles.cell2}>{record.kelembapan}%</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//     </ScrollView>
//     </View>      
//     );
//   }
// }

// export default Grafik;

// const styles = StyleSheet.create({
//     buttonStyle: {
//       minWidth: 300,
//       backgroundColor: "#00875A",
//       borderWidth: 0,
//       color: "#FFFFFF",
//       height: 40,
//       alignItems: "center",
//       borderRadius: 10,
//       marginLeft: 10,
//       marginRight: 10,
//       paddingRight: 10,
//       paddingLeft: 10,
//       marginTop: 20,
//       marginBottom: 25,
//     },
//     buttonTextStyle: {
//       color: "#FFFFFF",
//       paddingVertical: 10,
//       fontWeight: "bold",
//       fontSize: 16,
//     },
//     buttonTextStyle2: {
//       color: "#FFFFFF",
//       paddingVertical: 10,
//       fontWeight: "bold",
//       fontSize: 20,
//     },
//     container: {
//       flex: 1,
//       padding: 10,
//       backgroundColor: '#fff',
//     },
//     header: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       paddingBottom:5,
//       borderBottomColor: '#EE6B19',
//       borderBottomWidth: 2,
//       flex:1,
//       marginBottom: 5,
//     },
//     headerText: {
//       fontWeight: 'bold',
//       fontSize: 16,
//       color: '#266937',
//     },
//     header2Text: {
//       fontWeight: 'bold',
//       fontSize: 16,
//       color: '#266937',
//     },
//     body: {
//       flex: 1,
//       justifyContent: 'space-between',
//     },
//     row: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       borderBottomColor: '#ddd',
//       borderBottomWidth: 1,
//       paddingVertical: 5,
//     },
//     cell1: {
//       fontSize: 16,
//       color:'#EE6B19',
//       fontWeight: 'semibold',
//     },
//     cell2: {
//       fontSize: 16,
//       color: '#266937',
//     },
//   });






