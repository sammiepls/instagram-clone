import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Image,
  FlatList,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import firebase from 'firebase';
import { useSelector } from 'react-redux';

export default function Feed({ navigation }) {
  const { feed, usersFollowingLoaded } = useSelector(
    (state) => state.usersState,
  );
  const { following } = useSelector((state) => state.userState);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (usersFollowingLoaded === following.length && following.length !== 0) {
      feed.sort((x, y) => x.creation - y.creation);
      setPosts(feed);
    }
  }, [usersFollowingLoaded, following, feed]);

  const onLikePress = (uid, postId) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(uid)
      .collection('userPosts')
      .doc(postId)
      .collection('likes')
      .doc(firebase.auth().currentUser.uid)
      .set({});
  };

  const onDislikePress = (uid, postId) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(uid)
      .collection('userPosts')
      .doc(postId)
      .collection('likes')
      .doc(firebase.auth().currentUser.uid)
      .delete();
  };

  return (
    <SafeAreaView style={styles.container}>
      {posts ? (
        <FlatList
          data={posts}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => {
            return (
              <View style={styles.imageContainer}>
                <Text>{item.user.name}</Text>
                <Image
                  style={styles.image}
                  source={{ uri: item.downloadURL }}
                />
                {item.currentUserLike ? (
                  <Button
                    title="Dislike"
                    onPress={() => onDislikePress(item.user.uid, item.id)}
                  />
                ) : (
                  <Button
                    title="Like"
                    onPress={() => onLikePress(item.user.uid, item.id)}
                  />
                )}
                <Text
                  onPress={() =>
                    navigation.navigate('Comments', {
                      postId: item.id,
                      uid: item.user.uid,
                    })
                  }
                >
                  View Comments
                </Text>
              </View>
            );
          }}
        />
      ) : (
        <ActivityIndicator />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
});
