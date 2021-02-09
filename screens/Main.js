import React, { useEffect } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { fetchUser, fetchUserPosts } from "../redux/actions/";
import { Feather } from "@expo/vector-icons";
import firebase from "firebase";

import FeedScreen from "./main/Feed";
import SearchScreen from "./main/Search";
import ProfileScreen from "./main/Profile";

const EmptyScreen = () => null;

export default function Main() {
  const Tab = createMaterialBottomTabNavigator();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchUserPosts());
  }, []);

  return (
    <Tab.Navigator initialRouteName="Feed" labeled={false}>
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="home" size={26} color={color} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="search" size={26} color={color} />,
        }}
      />
      <Tab.Screen
        name="AddContainer"
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("Add");
          },
        })}
        component={EmptyScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="plus-circle" size={26} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="user" size={26} color={color} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("Profile", { uid: firebase.auth().currentUser.uid });
          },
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
