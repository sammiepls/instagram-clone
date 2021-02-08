import React, { useEffect } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/actions/";
import { Feather } from "@expo/vector-icons";

import FeedScreen from "./main/Feed";
import ProfileScreen from "./main/Profile";

const EmptyScreen = () => null;

export default function Main() {
  const Tab = createMaterialBottomTabNavigator();

  const dispatch = useDispatch();
  const { currentUser } = useSelector(({ userState }) => ({
    currentUser: userState.currentUser,
  }));

  useEffect(() => {
    dispatch(fetchUser());
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
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
