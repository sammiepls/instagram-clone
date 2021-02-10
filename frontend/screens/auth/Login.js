import React, { useState } from "react";
import firebase from "firebase";
import { StyleSheet, Text, Button, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const onSignIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => console.log(err));
  };

  return (
    <SafeAreaView>
      <Text>Email</Text>
      <TextInput placeholder="email" onChangeText={setEmail} />
      <Text>Password</Text>
      <TextInput secureTextEntry placeholder="password" onChangeText={setPassword} />
      <Button title="Sign in" onPress={() => onSignIn()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
