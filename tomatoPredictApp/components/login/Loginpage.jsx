import {
  Dimensions,
  Image,
  View as NormalView,
  TextInput as NormalText,
} from "react-native";
import { View, Text } from "../Themed";
import { TouchableOpacity } from "react-native";

import React, { useEffect, useState } from "react";

const Loginpage = ({ setPage, updateUser, api }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  function checkValid() {
    if (data.email === "" || data.password === "") {
      alert("Please fill all the fields");
      return;
    } else {
      // Login User
      loginUser(data);
    }
  }

  async function loginUser(data) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    await fetch(api + "user/login", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status === "success") {
          updateUser(result.data);
        } else {
          alert(result.error);
        }
      })
      .catch((error) => console.log("error", error));
  }

  return (
    <View
      style={{
        gap: 20,
        height: "100%",
        width: Dimensions.get("window").width,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          padding: 5,
          gap: 10,
          backgroundColor: "#9A7AA0",
          padding: 20,
          borderRadius: 20,
        }}
      >
        <NormalView
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            gap: 10,
            paddingTop: 30,
          }}
        >
          <Image
            source={{
              uri: "https://cdni.iconscout.com/illustration/premium/thumb/login-3305943-2757111.png",
            }}
            style={{ width: 100, height: 100, position: "absolute", top: -80 }}
          />
        </NormalView>
        <Text style={{ fontSize: 38, fontWeight: "bold", textAlign: "center" }}>
          Welcome Back
        </Text>
        <Text
          style={{
            textAlign: "center",
          }}
        >
          In order to access your account, please enter your email address and
          password.
        </Text>
        <NormalView
          style={{
            padding: 5,
            marginTop: 10,
            gap: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 20 }}>Email Address</Text>
          <NormalView>
            <NormalText
              placeholder="Enter your email"
              placeholderTextColor={"gray"}
              onChangeText={(text) => setData({ ...data, email: text })}
              style={{
                fontSize: 20,
                backgroundColor: "white",
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                marginTop: 5,
              }}
              padding={10}
            />
          </NormalView>
        </NormalView>
        <NormalView
          style={{
            padding: 5,
            marginTop: 10,
            gap: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 20 }}>Password</Text>
          <NormalView>
            <NormalText
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(text) => setData({ ...data, password: text })}
              placeholderTextColor={"gray"}
              style={{
                fontSize: 20,
                backgroundColor: "white",
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
                marginTop: 5,
              }}
              padding={10}
            />
          </NormalView>

          <NormalView
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "row",
              gap: 3,
            }}
          >
            <Text style={{ fontSize: 20 }}>Don't Have any Account?</Text>
            <TouchableOpacity onPress={() => setPage("signup")}>
              <Text style={{ fontSize: 20, color: "blue" }}>Sign Up</Text>
            </TouchableOpacity>
          </NormalView>

          <NormalView style={{ marginTop: 10 }}>
            <TouchableOpacity
              onPress={() => checkValid()}
              style={{
                backgroundColor: "#F2A365",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Text
                style={{ fontSize: 20, color: "white", textAlign: "center" }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </NormalView>
        </NormalView>
      </View>
    </View>
  );
};

export default Loginpage;
