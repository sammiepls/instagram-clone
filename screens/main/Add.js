import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if (!camera) return;
    const data = await camera.takePictureAsync(null);
    setImage(data.uri);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera ref={(ref) => setCamera(ref)} style={styles.camera} type={type} ration="1:1" />
      </View>
      <TouchableOpacity onPress={takePicture}>
        <Text>Snap</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
        }}
      >
        <Text style={styles.text}> Flip </Text>
      </TouchableOpacity>
      {image && <Image style={styles.image} source={{ uri: image }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "blue",
  },
  image: {
    flex: 1,
  },
});
