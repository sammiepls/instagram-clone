import React, { useState } from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/firebase-storage';
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';

export default function Save({ route, navigation }) {
  const { image } = route.params;
  const [caption, setCaption] = useState('');

  const uploadImage = async () => {
    const response = await fetch(image);
    const blob = await response.blob();
    const task = firebase
      .storage()
      .ref()
      .child(
        `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`,
      )
      .put(blob);

    const taskProgress = (snapshot) =>
      console.log('transferred: ' + snapshot.bytesTransferred);

    const taskCompleted = () =>
      task.snapshot.ref
        .getDownloadURL()
        .then((snapshot) => savePostData(snapshot));

    const taskError = (snapshot) => console.log(snapshot);

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

  const savePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(firebase.auth().currentUser.uid)
      .collection('userPosts')
      .add({
        downloadURL,
        caption,
        likesCount: 0,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => navigation.popToTop());
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: image }} />
      <View style={styles.captionContainer}>
        <Text style={styles.header}>Write a caption:</Text>
        <TextInput
          style={styles.caption}
          value={caption}
          placeholder="..."
          onChangeText={setCaption}
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => uploadImage()}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: 20 },
  image: {
    flex: 1,
  },
  captionContainer: {
    margin: 10,
  },
  caption: { marginTop: 10, marginBottom: 20 },
  header: { fontWeight: 'bold', letterSpacing: 3, textTransform: 'uppercase' },
  saveButton: {
    backgroundColor: '#5b6abf',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 5,
  },
});
