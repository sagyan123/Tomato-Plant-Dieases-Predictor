import { Dimensions, Image, TouchableOpacity, Platform } from "react-native";
import { Text, View } from "@/components/Themed";
import React, { useState } from "react";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { router, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

const camera = () => {
  const [hasPermission, setHasPermission] = useState(
    Camera.requestCameraPermissionsAsync()
  );
  const [camera, setCamera] = useState(null);
  const [type, setType] = React.useState(CameraType.back);
  const [flash, setFlash] = React.useState("off");
  const [imageUri, setImageUri] = useState(null);
  const [file, setImageFile] = useState();
  const [predictionResults, setPredictionResults] = useState(null);
  const [imageImgbbUri, setImageImgbbUri] = useState(null);
  const [ip, setIp] = useState("");
  const navigation = useNavigation();
  const [showModel, setShowModel] = useState(false);
  const [predictionStart, setPredictionStart] = useState(false);
  const [predictionCompleted, setPredictionCompleted] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem("ip").then((value) => {
      setIp(value);
    });
  }, []);

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }
  const takePicture = async () => {
    if (camera) {
      setLoadingImage(true);
      const data = await camera.takePictureAsync(null);
      setImageUri(data.uri);
      const fileUri =
        Platform.OS === "ios" ? data?.uri.replace("file://", "") : data?.uri;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      const filex = {
        uri: fileUri,
        name: fileInfo.uri.split("/").pop(),
        type: "image/jpeg", // or 'image/png' depending on your needs
      };
      uploadtoBB(filex);
      setImageFile(filex);
    } else {
      alert("Camera not found");
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
          setImageImgbbUri(result.data.display_url);
          predictDisease(file, result.data.display_url);
        }
      })
      .catch((error) => console.log("error", error));
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
          setLoadingImage(false);
          navigation.navigate("Result", {
            resClass,
            confidence,
            img,
          });
          setPredictionResults(result);
          setPredictionCompleted(true);
        })
        .catch((error) => alert(error));
    } catch (err) {
      alert("Error connecting to the server, Check if the IP is correct");
      console.log(err);
    }

    setPredictionCompleted(true);
  }

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Camera
        ref={(ref) => setCamera(ref)}
        type={type}
        flashMode={flash}
        style={{ width: Dimensions.get("screen").width, height: 600 }}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <TouchableOpacity
          onPress={toggleCameraType}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          <Image
            source={{
              uri: "https://static.vecteezy.com/system/resources/previews/019/858/412/original/camera-flat-color-outline-icon-free-png.png",
            }}
            style={{ width: 80, height: 80 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={takePicture}
          darkColor="white"
          lightColor="black"
          style={{
            borderRadius: 500,
          }}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/641/641827.png",
            }}
            style={{ width: 80, height: 80 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setFlash((current) =>
              current === FlashMode.torch ? FlashMode.off : FlashMode.torch
            )
          }
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          <Image
            source={{
              uri: "https://creazilla-store.fra1.digitaloceanspaces.com/emojis/45067/camera-with-flash-emoji-clipart-sm.png",
            }}
            style={{ width: 80, height: 80 }}
          />
        </TouchableOpacity>
      </View>
      <View>
        {showModel && (
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
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              Prediction Results
            </Text>
            {!predictionCompleted && (
              <Text
                style={{
                  color: "white",
                }}
              >
                Predicting...
              </Text>
            )}

            {predictionCompleted && (
              <View
                style={{
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  Predicted Disease :
                  {predictionResults?.class?.replace(/_/g, " ")}
                </Text>
                <Text>
                  Predicted Accuracy :{" "}
                  {(predictionResults?.confidence * 100).toFixed(2)}%
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 20,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 10,
                      backgroundColor: "green",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white" }}>Save Prediction</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setImageUri(null);
                      setPredictionStart(false);
                      setPredictionCompleted(false);
                    }}
                    style={{
                      width: 100,
                      backgroundColor: "red",
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white" }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
      {loadingImage && (
        <View
          style={{
            position: "absolute",
            top: 0,
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height - 100,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Image
            source={{
              uri: "https://th.bing.com/th/id/R.e42cb20be6939bc8590dede0a20cc6e0?rik=Z%2be10J5aE%2fbNQA&riu=http%3a%2f%2forig11.deviantart.net%2f03d6%2ff%2f2014%2f122%2f7%2fa%2floading_gif_by_zarzox-d7gwtxy.png&ehk=k6Hd%2bH5rAoGufy5%2fceZac7VuV1WDPSM%2bj9clzC5uzPo%3d&risl=&pid=ImgRaw&r=0",
            }}
            style={{ width: 200, height: 200 }}
          />
          <Text>
            It may take a few seconds to predict the disease, please wait.
            Please Note that It requires active internet connection.
          </Text>
        </View>
      )}
    </View>
  );
};

export default camera;
