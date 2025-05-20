import { View, Text } from "@/components/Themed";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, TouchableOpacity } from "react-native";
import * as Updates from "expo-updates";

const Settings = () => {
  const [ip, setIp] = useState("");
  const [user, setUser] = useState({});

  function logout() {
    AsyncStorage.removeItem("user");
    Updates.reloadAsync();
  }

  function getIP() {
    AsyncStorage.getItem("ip").then((value) => {
      setIp(value);
    });
    AsyncStorage.getItem("user").then((value) => {
      setUser(JSON.parse(value));
    });
  }
  function deleteIp() {
    AsyncStorage.removeItem("ip");
    setIp("");
    Updates.reloadAsync();
  }

  useEffect(() => {
    getIP();
  }, []);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        padding: 10,
      }}
    >
      <View
        darkColor="#13293D"
        lightColor="#f5f5f5"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          padding: 10,
          borderRadius: 10,
          height: 170,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
            gap: 10,
            backgroundColor: "transparent",
          }}
        >
          <Image
            source={{ uri: user?.image }}
            style={{ width: 70, height: 70 }}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "transparent",
              gap: 5,
            }}
          >
            <View
              style={{
                backgroundColor: "transparent",
                gap: 5,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {user?.name}
              </Text>
              <Text
                style={{
                  opacity: 0.5,
                }}
              >
                (@{user?.username})
              </Text>
            </View>
            <Text>{user?.email}</Text>
          </View>
        </View>
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#f00",
              padding: 10,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              height: 50,
            }}
            onPress={logout}
          >
            <Text>LogOut</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          backgroundColor: "#0000001a",
          padding: 10,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {" "}
          Your Current API Route
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <Text>{ip}:8000</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 20,
            }}
          >
            <TouchableOpacity onPress={getIP}>
              <Text>Refresh</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteIp}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Settings;
