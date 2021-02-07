import React, { useState } from "react";
import firebase from "firebase";
import { StyleSheet, Text, Button, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();

  const onSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => console.log(err));
  };

  return (
    <SafeAreaView>
      <Text>Name</Text>
      <TextInput placeholder="name" onChangeText={setName} />
      <Text>Email</Text>
      <TextInput placeholder="email" onChangeText={setEmail} />
      <Text>Password</Text>
      <TextInput secureTextEntry placeholder="password" onChangeText={setPassword} />
      <Button title="Register" onPress={() => onSignUp()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
