import { View, Text } from "@/components/Themed";
import React from "react";
import { Image } from "react-native";
import * as Print from "expo-print";
import { TouchableOpacity } from "react-native";
import { shareAsync } from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HistoryCard = ({ result, fetchResults }) => {
  const [uri, setUri] = React.useState("");

  function deleteHistory() {
    AsyncStorage.getItem("results").then((value) => {
      let results = [];
      if (value) {
        results = JSON.parse(value);
      }
      results = results.filter((res) => res.savedOn !== result.savedOn);
      AsyncStorage.setItem("results", JSON.stringify(results));
      fetchResults();
    });
  }

  function saveAsPdf() {
    const htmlContent = `
      <html>
        <head>
          <title>Result</title>
        </head>
        <body>
          <h1>${result.resClass
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}</h1>
          <img src="${result.img}" width="300" height="300" />
          <p>Confidence Level: ${(result.confidence * 100).toFixed(2) + "%"}</p>
          <p>Date: ${result.savedOn ? result.savedOn : "No Available Date"}</p>
        </body>
      </html>
    `;
    Print.printToFileAsync({ html: htmlContent }).then((res) => {
      alert(`PDF Saved Successfully to ${res.uri}`);
      setUri(res.uri);
    });
  }

  async function sharePDF() {
    if (uri === "") {
      alert("Please save the PDF first");
      return;
    }
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  }

  return (
    <View
      darkColor="#13293D"
      lightColor="#f5f5f5"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        gap: 10,
      }}
    >
      <Image
        source={{ uri: result.img }}
        style={{ width: 300, height: 300, borderRadius: 30 }}
      />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        {result.resClass
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())}
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        The Confidence level was {(result.confidence * 100).toFixed(2) + "%"}
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        Date:{" "}
        {result.savedOn
          ? `${result.savedOn.split("T")[0]}  ${
              result.savedOn.split("T")[1].split(".")[0]
            }
        `
          : "No Available Date"}
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 20,
          backgroundColor: "transparent",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            sharePDF();
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
            Share
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            saveAsPdf();
          }}
        >
          <Text
            style={{
              color: "white",
              backgroundColor: "blue",
              padding: 10,
              borderRadius: 5,
            }}
          >
            Save as PDF
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            deleteHistory();
          }}
        >
          <Text
            style={{
              color: "white",
              backgroundColor: "red",
              padding: 10,
              borderRadius: 5,
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HistoryCard;
