import { ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import HistoryCard from "@/components/History/HistoryCard";
import { useNavigation } from "expo-router";

export default function TabTwoScreen() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigation();

  function fetchResults() {
    AsyncStorage.getItem("results")
      .then((res) => {
        if (res) {
          setResults(JSON.parse(res));
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Scan History</Text>
      {results.length !== 0 ? (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            paddingTop: 10,
            paddingBottom: 50,
          }}
        >
          {results.map((result, index) => (
            <HistoryCard
              key={index}
              result={result}
              fetchResults={fetchResults}
            />
          ))}
        </View>
      ) : (
        <View
          style={{
            padding: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 500,
          }}
        >
          <Image
            source={{
              uri: "https://cdni.iconscout.com/illustration/premium/thumb/concept-of-error-404-and-robot-not-working-2112236-1779236.png",
            }}
            style={{ width: 300, height: 300 }}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            No History Found
          </Text>
          <TouchableOpacity onPress={fetchResults}>
            <Text style={{ color: "blue" }}>Refresh</Text>
          </TouchableOpacity>
          <View style={{ height: 50 }} />
          <TouchableOpacity onPress={() => navigate.navigate("index")}>
            <Text
              style={{
                padding: 10,
                borderRadius: 30,
                backgroundColor: "#2A628F",
                color: "white",
                fontSize: 20,
              }}
            >
              Start Prediction
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {error && <Text>{error}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
