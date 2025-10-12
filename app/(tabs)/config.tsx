import React from 'react';
import { View, Text, StyleSheet } from "react-native";

export default function ConfigScreen() {
    return(
        <View style={styles.container}>
            <Text style={styles.txt}>Config Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 43, backgroundColor: "#181818ff" },
  txt: { color: "#fff" },
});