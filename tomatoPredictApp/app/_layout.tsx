import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SetApiIP from "@/components/SetApiIp";
import { View, Text } from "@/components/Themed";
import Mainpage from "@/components/login/Mainpage";

import { useColorScheme } from "@/components/useColorScheme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [ip, setIp] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);

  function updateUser(user: string) {
    setUser(user);
    const strUser = JSON.stringify(user);
    AsyncStorage.setItem("user", strUser);
  }

  function updateIP(ip: string) {
    setIp(ip);
    AsyncStorage.setItem("ip", ip);
  }
  useEffect(() => {
    (async () => {
      const ip = await AsyncStorage.getItem("ip");
      const user = await AsyncStorage.getItem("user");
      if (ip) {
        setIp(ip);
      }
      if (user) {
        setUser(JSON.parse(user));
      }
    })();
  }, []);
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {!!user ? (
        <View style={{ backgroundColor: "red", flex: 1 }}>
          {(!!ip && (
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            </Stack>
          )) || <SetApiIP updateIp={updateIP} />}
        </View>
      ) : (
        <Mainpage updateUser={updateUser} />
      )}
    </ThemeProvider>
  );
}
