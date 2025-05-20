import { View, Text } from "@/components/Themed";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Image, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Disease = [
  {
    name: "Two-spotted Spider Mite",
    cause:
      "These mites thrive in hot, dry conditions and can rapidly multiply, sucking the sap from the leaves, causing them to turn yellow and eventually die.",
    preventive_measures:
      "Keep plants well-watered, increase humidity around plants, and use insecticidal soap or neem oil to control infestations.",
  },
  {
    name: "Bacterial Spot",
    cause:
      "Caused by the bacterium Xanthomonas campestris, this disease causes dark, water-soaked spots on leaves and fruit.",
    preventive_measures:
      "Rotate crops, use disease-free seeds, and avoid overhead watering to prevent the spread of bacteria.",
  },
  {
    name: "Early Blight",
    cause:
      "Caused by the fungus Alternaria solani, this disease causes dark spots with concentric rings on lower leaves, leading to defoliation.",
    preventive_measures:
      "Remove infected leaves, space plants for better air circulation, and apply fungicides preventively.",
  },
  {
    name: "Healthy",
    cause: "This is the normal state of a tomato plant without any disease.",
    preventive_measures:
      "Maintain good plant care practices, including proper watering, fertilization, and pest control.",
  },
  {
    name: "Late Blight",
    cause:
      "Caused by the fungus Phytophthora infestans, this disease causes dark, water-soaked lesions on leaves, stems, and fruit.",
    preventive_measures:
      "Remove infected plants, avoid overhead watering, and apply fungicides preventively.",
  },
  {
    name: "Leaf Miner",
    cause:
      "Larvae of various insects tunnel into leaves, creating distinctive white trails or blotches.",
    preventive_measures:
      "Remove affected leaves, use insecticidal soap or neem oil, and practice crop rotation.",
  },
  {
    name: "Leaf Mold",
    cause:
      "Caused by the fungus Fulvia fulva, this disease causes yellowing of leaves with fuzzy, brown patches on the undersides.",
    preventive_measures:
      "Provide good air circulation, avoid overhead watering, and use fungicides preventively.",
  },
  {
    name: "Magnesium Deficiency",
    cause:
      "Lack of magnesium in the soil or poor uptake by the plant can lead to yellowing of older leaves.",
    preventive_measures:
      "Use fertilizers rich in magnesium, maintain proper soil pH, and ensure adequate watering.",
  },
  {
    name: "Mosaic Virus",
    cause:
      "Caused by various viruses, this disease causes mottling and distortion of leaves, as well as reduced fruit yield.",
    preventive_measures:
      "Use disease-free seeds, control insect vectors, and remove infected plants.",
  },
  {
    name: "Nitrogen Deficiency",
    cause:
      "Lack of nitrogen in the soil can cause yellowing of older leaves and stunted growth.",
    preventive_measures:
      "Use nitrogen-rich fertilizers, compost, and ensure proper soil pH.",
  },
  {
    name: "Potassium Deficiency",
    cause:
      "Lack of potassium in the soil can cause yellowing of leaf margins and poor fruit development.",
    preventive_measures:
      "Use potassium-rich fertilizers, maintain proper soil pH, and ensure adequate watering.",
  },
  {
    name: "Septoria Leaf Spot",
    cause:
      "Caused by the fungus Septoria lycopersici, this disease causes small, dark spots with white centers on leaves.",
    preventive_measures:
      "Remove infected leaves, avoid overhead watering, and use fungicides preventively.",
  },
  {
    name: "Spotted Wilt Virus",
    cause:
      "Transmitted by thrips, this virus causes yellowing, mottling, and stunting of plants.",
    preventive_measures:
      "Control thrips with insecticides, remove infected plants, and use disease-resistant varieties.",
  },
  {
    name: "Target Spot",
    cause:
      "Caused by the fungus Corynespora cassiicola, this disease causes dark spots with concentric rings on leaves.",
    preventive_measures:
      "Remove infected leaves, space plants for better air circulation, and apply fungicides preventively.",
  },
  {
    name: "Yellow Leaf Curl Virus",
    cause:
      "Transmitted by whiteflies, this virus causes curling, yellowing, and stunting of leaves.",
    preventive_measures:
      "Control whiteflies with insecticides, remove infected plants, and use disease-resistant varieties.",
  },
];

const Result = () => {
  const { resClass, img, confidence } = useLocalSearchParams();
  const navigator = useNavigation();
  const [saved, setSaved] = React.useState(false);

  let rclass = resClass
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const disease = Disease.find((d) => d.name === rclass);

  function saveResult() {
    const savedOn = new Date().toISOString();
    if (saved) return;
    //save the result to asyncStorage
    AsyncStorage.getItem("results").then((value) => {
      let results = [];
      if (value) {
        results = JSON.parse(value);
      }
      results.push({
        resClass,
        img,
        confidence,
        savedOn,
      });
      AsyncStorage.setItem("results", JSON.stringify(results));
    });
    alert("Result Saved Successfully");
    setSaved(true);
  }

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
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image source={{ uri: img }} style={{ width: 300, height: 300 }} />
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        Predicted Disease:{" "}
        {resClass.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        {"Confidence: " + (confidence * 100).toFixed(2) + "%"}
      </Text>

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Cause:
        </Text>
        <Text>{disease?.cause}</Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Preventive Measures:
        </Text>
        <Text>{disease?.preventive_measures}</Text>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          padding: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            saveResult();
          }}
        >
          <Text
            style={{
              color: "white",
              backgroundColor: saved ? "gray" : "blue",
              padding: 10,
              borderRadius: 5,
            }}
          >
            {saved ? "Saved" : "Save Result"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigator.navigate("index");
          }}
        >
          <Text
            style={{
              color: "white",
              backgroundColor: "green",
              padding: 10,
              borderRadius: 5,
            }}
          >
            Scan Another
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Result;
