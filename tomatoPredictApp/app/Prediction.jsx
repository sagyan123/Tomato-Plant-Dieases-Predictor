import { View, Text } from "@/components/Themed";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Image } from "react-native";

const photopreview = () => {
  const { id } = useLocalSearchParams();
  console.log(id);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    setImageUri(id);
  }, [id]);

  return (
    <View>
      {!!imageUri && (
        <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
      )}
      <Text>{id}</Text>
    </View>
  );
};

export default photopreview;
