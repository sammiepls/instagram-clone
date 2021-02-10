import React, { useState } from "react";
import { TextInput, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import firebase from "firebase";
import "firebase/firestore";

export default function Search({ navigation }) {
  const [users, setUsers] = useState([]);

  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection("users")
      .where("name", ">=", search)
      .get()
      .then((snapshot) => setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))));
  };

  return (
    <SafeAreaView>
      <TextInput onChangeText={fetchUsers} placeholder="Search for a user" />
      <FlatList
        data={users}
        keyExtractor={(user) => user.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("Profile", { uid: item.id })}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
