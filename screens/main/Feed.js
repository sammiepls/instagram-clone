import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Image,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

export default function Feed({ navigation }) {
  const { users, usersFollowingLoaded } = useSelector(
    (state) => state.usersState,
  );
  const { following } = useSelector((state) => state.userState);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let p = [];
    if (usersFollowingLoaded === following.length) {
      for (let i = 0; i < following.length; i++) {
        const user = users.find((u) => u.uid === following[i]);
        if (user) {
          p = [...p, ...user.posts];
        }
      }

      p.sort((x, y) => x.creation - y.creation);
      setPosts(p);
    }
  }, [usersFollowingLoaded, following, users]);

  return (
    <SafeAreaView style={styles.container}>
      {posts ? (
        <FlatList
          data={posts}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Text>{item.user.name}</Text>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
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
          )}
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
