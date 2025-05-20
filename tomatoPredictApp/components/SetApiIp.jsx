//import liraries
import React, { Component, useState } from "react";
import { Image, StyleSheet } from "react-native";
import { View, Text, TextInput } from "./Themed";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// create a component
const SetApiIP = ({ updateIp }) => {
  const [ip, setIp] = useState("");
  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      updateIp(value);
      alert("IP address saved successfully");
    } catch (error) {
      console.error("Error storing data:", error);
      alert("Error saving IP address");
    }
  };

  function saveIP() {
    if (ip === "") {
      alert("Please enter the IP address");
      return;
    }

    storeData("ip", ip);
  }

  return (
    <View darkColor="#151515" lightColor="#f0f0f0" style={styles.container}>
      <Text
        style={{
          fontSize: 20,
          textAlign: "center",
          marginHorizontal: 20,
          gap: 20,
        }}
      >
        Please set the IP address of the server that is running the model to get
        started.
      </Text>
      <Image
        source={{
          uri: "https://th.bing.com/th/id/R.ae366862b901b16b34deac4850f591fd?rik=sWBVRCzcMkfWyA&pid=ImgRaw&r=0&sres=1&sresct=1",
        }}
        style={{ width: 300, height: 300, resizeMode: "contain" }}
      />

      <TextInput
        darkColor="#151515"
        textContentType="URL"
        keyboardType="numeric"
        lightColor="#f0f0f0"
        placeholder="API IP Address"
        placeholderTextColor={"gray"}
        onChangeText={(text) => setIp(text)}
        style={{
          width: 300,
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          margin: 20,
          padding: 10,
          borderRadius: 5,
        }}
      />
      <TouchableOpacity
        style={{
          marginBottom: 20,
        }}
        onPress={saveIP}
      >
        <Text
          style={{
            backgroundColor: "blue",
            color: "white",
            padding: 10,
            borderRadius: 5,
          }}
        >
          Set IP
        </Text>
      </TouchableOpacity>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          padding: 10,
        }}
      >
        <Text>How to get the IP address of the server?</Text>
        <Text>1. Open the terminal</Text>
        <Text>2. Type "ifconfig" and press enter</Text>
        <Text>
          3. Look for the IP address of the network you are connected to
        </Text>
        <Text>
          4. Copy the IP address and paste it in the input field above
        </Text>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

//make this component available to the app
export default SetApiIP;
