import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser, posts } = useSelector(({ userState }) => userState);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text>{currentUser.name}</Text>
        <Text>{currentUser.email}</Text>
      </View>
      <View style={styles.galleryContainer}>
        <FlatList
          data={posts}
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
