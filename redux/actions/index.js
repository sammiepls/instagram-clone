import firebase from 'firebase';
import 'firebase/firestore';
import {
  USER_POSTS_STATE_CHANGE,
  USER_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
} from '../constants';

export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        snapshot.exists
          ? dispatch({ type: USER_STATE_CHANGE, payload: snapshot.data() })
          : console.log('No user exists');
      });
  };
}

export function fetchUserPosts() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(firebase.auth().currentUser.uid)
      .collection('userPosts')
      .orderBy('creation', 'asc')
      .get()
      .then((snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch({
          type: USER_POSTS_STATE_CHANGE,
          payload: posts,
        });
      });
  };
}

export function fetchUserFollowing() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection('following')
      .doc(firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .onSnapshot((snapshot) => {
        const following = snapshot.docs.map((doc) => doc.id);
        dispatch({
          type: USER_FOLLOWING_STATE_CHANGE,
          payload: following,
        });
      });
  };
}
