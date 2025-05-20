import { Text, View } from "@/components/Themed";
import React, { useEffect } from "react";
import {
  Button,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { router, useNavigation } from "expo-router";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

export default function TabOneScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [ip, setIp] = useState("");
  const [predictionStart, setPredictionStart] = useState(false);
  const [predictionResults, setPredictionResults] = useState({});
  const [predictionCompleted, setPredictionCompleted] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [file, setImageFile] = useState(null);
  const navigator = useNavigation();

  function getIp() {
    AsyncStorage.getItem("ip").then((value) => {
      setIp(value);
    });
  }

  useEffect(() => {
    getIp();
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // Image was selected, now convert to file
      setImageUri(result.assets[0].uri);
      const fileUri =
        Platform.OS === "ios"
          ? result.assets[0].uri.replace("file://", "")
          : result.assets[0].uri;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      const filex = {
        uri: fileUri,
        name: fileInfo.uri.split("/").pop(),
        type: "image/jpeg", // or 'image/png' depending on your needs
      };
      uploadtoBB(filex);
      setImageFile(filex);
    }
  };

  function uploadtoBB(file) {
    const api = "6018bb19536be3c14ee250bedad234a6";
    const url = `https://api.imgbb.com/1/upload?key=${api}`;
    const formdata = new FormData();
    formdata.append("image", file);
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 200) {
          predictDisease(file, result.data.display_url);
        }
        // console.log(result);
      })
      .catch((error) => console.log("error", error));
  }

  function accessCamera() {
    router.push("/camera");
  }

  function predictDisease(file, img) {
    const url = `http://${ip}:8000/predict`;
    try {
      const formdata = new FormData();
      formdata.append("file", file);

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          const { class: resClass, confidence } = result;

          if (!!resClass && !!confidence)
            navigator.navigate("Result", {
              resClass,
              img,
              confidence,
            });
          setImageUri(null);
          setPredictionStart(false);
        })
        .catch((error) => alert(error));
    } catch (err) {
      alert("Error connecting to the server, Check if the IP is correct");
      console.log(err);
    }

    setPredictionCompleted(true);
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === "granted" && mediaStatus === "granted") {
        setHasPermission(status === "granted");
      }
    })();
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Let's start by uploading an image of a tomato leaf to predict the
        disease.
      </Text>

      <View
        style={{
          flexDirection: "row",
          gap: 20,
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
            padding: 20,
            borderRadius: 10,
          }}
          darkColor="rgba(255,255,255,0.1)"
          lightColor="#eee"
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => pickImage()}
          >
            <Image
              source={{
                uri: "https://th.bing.com/th/id/OIP.SpRz1WODCmD2BwftEXWAYwAAAA?rs=1&pid=ImgDetMain",
              }}
              style={{ width: 100, height: 100 }}
            />
            <Text style={{ marginTop: 20 }}>Upload Image</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
            padding: 20,
            borderRadius: 10,
          }}
          darkColor="rgba(255,255,255,0.1)"
          lightColor="#eee"
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => accessCamera()}
          >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/641/641827.png",
              }}
              style={{ width: 100, height: 100 }}
            />
            <Text style={{ marginTop: 20 }}>Camera Roll</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "rgba(0,0,0,0.9)",
          display: imageUri ? "flex" : "none",
          padding: 20,
          alignItems: "center",
          gap: 20,
        }}
      >
        <View
          style={{
            gap: 10,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Getting Results
          </Text>
        </View>
        <Image
          source={{ uri: imageUri }}
          style={{
            width: 300,
            height: 300,
          }}
        />
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.9)",
            padding: 20,
            borderRadius: 10,
            alignItems: "center",
            gap: 20,
          }}
        >
          <Text
            style={{
              color: "white",
            }}
          >
            It may take a few seconds to predict depending on the server speed.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
