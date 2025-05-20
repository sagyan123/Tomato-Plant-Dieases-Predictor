import {
  Dimensions,
  Image,
  View as NormalView,
  TextInput as NormalText,
  ScrollView,
} from "react-native";
import { View, Text } from "../Themed";
import { TouchableOpacity } from "react-native";

import React, { useEffect, useState } from "react";

const SignUp = ({ setPage, api }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
    username: "",
    name: "",
  });

  async function uploadData() {
    if (
      data.email === "" ||
      data.password === "" ||
      data.username === "" ||
      data.name === ""
    ) {
      alert("Please fill all the fields");
      return;
    } else {
      createUser(data);
    }
  }

  async function createUser(data) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    fetch(api + "user", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status === "success") {
          alert("User Created Successfully");
          setPage("login");
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
      <ScrollView
        style={{
          width: Dimensions.get("window").width,
        }}
      >
        <View
          style={{
            padding: 5,
            gap: 10,
            backgroundColor: "#13293D",
            padding: 20,
            borderRadius: 20,
            // maxHeight: Dimensions.get("window").height - 200,
          }}
        >
          <NormalView
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              gap: 10,
            }}
          >
            <Image
              source={{
                uri: "https://cdni.iconscout.com/illustration/premium/thumb/login-3305943-2757111.png",
              }}
              style={{
                width: 100,
                height: 100,
              }}
            />
          </NormalView>
          <Text
            style={{ fontSize: 38, fontWeight: "bold", textAlign: "center" }}
          >
            Sign Up
          </Text>
          <Text
            style={{
              textAlign: "center",
            }}
          >
            In order to access your account, Signup with your email and continue
            to use our services.
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
            <Text style={{ fontSize: 20 }}>Your Username</Text>
            <NormalView>
              <NormalText
                placeholder="Enter unique username"
                placeholderTextColor={"gray"}
                onChangeText={(text) => setData({ ...data, username: text })}
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
            <Text style={{ fontSize: 20 }}>Your Name</Text>
            <NormalView>
              <NormalText
                placeholder="Enter your Full Name"
                placeholderTextColor={"gray"}
                onChangeText={(text) => setData({ ...data, name: text })}
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
                onChangeText={(text) => setData({ ...data, password: text })}
                secureTextEntry={true}
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
          </NormalView>
          <NormalView
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "row",
              gap: 3,
            }}
          >
            <Text style={{ fontSize: 20 }}>Already have an Account?</Text>
            <TouchableOpacity onPress={() => setPage("login")}>
              <Text style={{ fontSize: 20, color: "#3E92CC" }}>Login</Text>
            </TouchableOpacity>
          </NormalView>

          <NormalView style={{ marginTop: 10 }}>
            <TouchableOpacity
              onPress={() => uploadData()}
              style={{
                backgroundColor: "#F2A365",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Text
                style={{ fontSize: 20, color: "white", textAlign: "center" }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </NormalView>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;
