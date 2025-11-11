import React from 'react';
import { StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
    return(
        <View style={styles.container}>
            <Text style={styles.txt}>Profile Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 43},
  txt: { color: "#fff" },
});