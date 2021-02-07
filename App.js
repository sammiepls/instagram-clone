import React, { useState, useEffect } from "react";
import * as firebase from "firebase";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, ActivityIndicator } from "react-native";

import Landing from "./screens/auth/Landing";
import Register from "./screens/auth/Register";
import Login from "./screens/auth/Login";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      user ? setIsAuthenticated(true) : setIsAuthenticated(false);
      setIsLoading(false);
    });
  }, []);

  return (
    <SafeAreaProvider>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <NavigationContainer>
          {isAuthenticated ? (
            <View></View>
          ) : (
            <Stack.Navigator initialRouteName="Landing">
              <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}
