import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/actions/";
import { Feather } from "@expo/vector-icons";

import FeedScreen from "./main/Feed";
import AddScreen from "./main/Add";
import ProfileScreen from "./main/Profile";

export default function Main() {
  const Tab = createBottomTabNavigator();

  const dispatch = useDispatch();
  const { currentUser } = useSelector(({ userState }) => ({
    currentUser: userState.currentUser,
  }));

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: () => <Feather name="home" size={26} />,
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={{
          tabBarIcon: () => <Feather name="plus-circle" size={26} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: () => <Feather name="user" size={26} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
