import { View, Text } from "@/components/Themed";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { Image } from "react-native";

const go = () => {
  const { imageUri, file } = useLocalSearchParams();
  const [loading, setLoading] = React.useState(true);
  const api = "6018bb19536be3c14ee250bedad234a6";

  async function uploadtoImgbb() {
    try {
      const response = await fetch(imageUri);
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }
      const blob = await response.blob();
      console.log(blob);
      setLoading(false);
    } catch (error) {
      console.error("Error uploading to ImgBB:", error);
      // Handle the error accordingly, e.g., display an error message to the user
      setLoading(false); // Ensure loading state is updated even in case of error
    }
  }

  useEffect(() => {
    uploadtoImgbb();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View>
      <Image
        source={{ isStatic: true, uri: imageUri }}
        style={{ width: 200, height: 200 }}
      />
      <Text>{imageUri}</Text>
    </View>
  );
};

export default go;
