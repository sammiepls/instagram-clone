import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import firebase from 'firebase';
import 'firebase/firestore';

export default function Profile({ route }) {
  const { uid } = route.params;
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const { currentUser, posts } = useSelector(({ userState }) => userState);

  useEffect(() => {
    if (uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then((snapshot) => setUser(snapshot.data()));

      firebase
        .firestore()
        .collection('posts')
        .doc(uid)
        .collection('userPosts')
        .orderBy('creation', 'asc')
        .get()
        .then((snapshot) => {
          const posts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserPosts(posts);
        });
    }
  }, [uid]);

  return user ? (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
      </View>
      <View style={styles.galleryContainer}>
        <FlatList
          data={userPosts}
          numColumns={3}
          keyExtractor={(posts) => posts.id}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  ) : (
    <ActivityIndicator />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  userInfoContainer: {
    margin: 10,
  },
  galleryContainer: {
    flex: 1,
  },
  imageContainer: {
    flex: 1 / 3,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
});
