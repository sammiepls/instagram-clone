import React, { useState, useEffect } from "react";
import * as firebase from "firebase";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, ActivityIndicator, LogBox } from "react-native";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";
const store = createStore(rootReducer, applyMiddleware(thunk));

import LandingScreen from "./screens/auth/Landing";
import RegisterScreen from "./screens/auth/Register";
import LoginScreen from "./screens/auth/Login";
import MainScreen from "./screens/Main";
import AddScreen from "./screens/main/Add";
import SaveScreen from "./screens/main/Save";

//disable firestore timing warning
LogBox.ignoreLogs(["Setting a timer for a long period of time"]);

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
            <Provider store={store}>
              <Stack.Navigator initialRouteName="Main">
                <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Add" component={AddScreen} />
                <Stack.Screen name="Save" component={SaveScreen} />
              </Stack.Navigator>
            </Provider>
          ) : (
            <Stack.Navigator initialRouteName="Landing">
              <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}
