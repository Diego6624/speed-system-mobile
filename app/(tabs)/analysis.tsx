import React from 'react';
import { StyleSheet, Text, View } from "react-native";

export default function AnalysisScreen() {
    return(
        <View style={styles.container}>
            <Text style={styles.txt}>Analisis Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 43, backgroundColor: "#181818ff" },
  txt: { color: "#fff" },
});