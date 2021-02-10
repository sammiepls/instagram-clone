import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';

export default function App({ navigation }) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');

      const {
        status: galleryStatus,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus === 'granted');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  if (hasCameraPermission === null || hasGalleryPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if (!camera) return;
    const data = await camera.takePictureAsync(null);
    setImage(data.uri);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {image ? (
          <View style={styles.saveContainer}>
            <Image style={styles.image} source={{ uri: image }} />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => navigation.navigate('Save', { image })}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Camera
            ref={(ref) => setCamera(ref)}
            style={styles.camera}
            type={type}
            ration="1:1"
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Feather name="image" size={36} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={takePicture}>
          <Feather name="circle" size={36} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back,
            );
          }}
        >
          <Feather name="refresh-cw" size={36} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 20,
  },
  saveContainer: { flex: 1 },
  saveButton: {
    backgroundColor: '#5b6abf',
    padding: 10,
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 5,
  },
  image: {
    flex: 1,
    position: 'relative',
  },
});
