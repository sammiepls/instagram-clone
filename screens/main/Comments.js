import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
} from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsersData } from '../../redux/actions';

export default function Comments({ route }) {
  const { postId, uid } = route.params;
  const [comments, setComments] = useState([]);
  const [currentPostId, setCurrentPostId] = useState('');
  const [text, setText] = useState('');

  const { users } = useSelector((state) => state.usersState);
  const dispatch = useDispatch();

  useEffect(() => {
    function matchUserToComment(c) {
      for (let i = 0; i < c.length; i++) {
        if (c[i].hasOwnProperty('user')) {
          continue;
        }

        const user = users.find((x) => x.uid === c[i].creator);
        if (user === undefined) {
          console.log('madeit');
          dispatch(fetchUsersData(c[i].creator, false));
        } else {
          c[i].user = user;
        }
      }
      setComments(c);
    }

    if (postId !== currentPostId) {
      firebase
        .firestore()
        .collection('posts')
        .doc(uid)
        .collection('userPosts')
        .doc(postId)
        .collection('comments')
        .get()
        .then((snapshot) => {
          let c = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          matchUserToComment(c);
        });
      setCurrentPostId(postId);
    } else {
      matchUserToComment(comments);
    }
  }, [postId, users]);

  const onCommentSend = () => {
    firebase
      .firestore()
      .collection('posts')
      .doc(uid)
      .collection('userPosts')
      .doc(postId)
      .collection('comments')
      .add({
        creator: firebase.auth().currentUser.uid,
        text,
      });
  };

  return (
    <SafeAreaView>
      <FlatList
        data={comments}
        keyExtractor={(comment) => comment.id}
        renderItem={({ item }) => {
          return (
            <View>
              {item.user && <Text>{item.user.name}</Text>}
              <Text>{item.text}</Text>
            </View>
          );
        }}
      />
      <View>
        <Text>Leave a comment</Text>
        <TextInput placeholder="Comment" onChangeText={setText} />
        <Button title="Comment" onPress={onCommentSend} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
