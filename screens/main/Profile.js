import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import { useSelector } from 'react-redux';
import firebase from 'firebase';
import 'firebase/firestore';

export default function Profile({ route }) {
  const { uid } = route.params;
  const { currentUser, posts, following } = useSelector(
    ({ userState }) => userState,
  );

  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const isCurrentUser = uid === firebase.auth().currentUser.uid;

  useEffect(() => {
    if (isCurrentUser) {
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
          const p = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserPosts(p);
        });

      console.log(following);

      following.indexOf(uid) === -1
        ? setIsFollowing(false)
        : setIsFollowing(true);
    }
  }, [uid, following, currentUser, isCurrentUser, posts]);

  const renderFollow = () =>
    isFollowing ? (
      <Button title="Following" onPress={onUnfollow} />
    ) : (
      <Button title="Follow" onPress={onFollow} />
    );

  const onFollow = () => {
    firebase
      .firestore()
      .collection('following')
      .doc(firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .doc(uid)
      .set({});
  };

  const onUnfollow = () => {
    firebase
      .firestore()
      .collection('following')
      .doc(firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .doc(uid)
      .delete();
  };

  const onLogout = () => {
    firebase.auth().signOut();
  };

  return user ? (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
        {isCurrentUser ? (
          <Button title="Logout" onPress={onLogout} />
        ) : (
          renderFollow()
        )}
      </View>
      <View style={styles.galleryContainer}>
        <FlatList
          data={userPosts}
          numColumns={3}
          keyExtractor={(p) => p.id}
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
