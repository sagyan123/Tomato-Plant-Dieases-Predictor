import { View, Text } from "../Themed";
import React from "react";
import { useState } from "react";
import Loginpage from "./Loginpage";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { Platform } from "react-native";
import { StatusBar } from "react-native";
import { Dimensions } from "react-native";
import SignupPage from "./Signup";

const Mainpage = ({ updateUser }) => {
  const [page, setPage] = useState("login");
  const api = "http://192.168.1.37:4000/";
  return (
    <SafeAreaView
      style={{
        height: Dimensions.get("screen").height,
        paddingTop:
          Platform.OS === "android" ? StatusBar.currentHeight + 10 : 10,
      }}
    >
      {page === "login" ? (
        <Loginpage setPage={setPage} updateUser={updateUser} api={api} />
      ) : (
        <SignupPage setPage={setPage} api={api} />
      )}
    </SafeAreaView>
  );
};

export default Mainpage;
