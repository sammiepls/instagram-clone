import firebase from 'firebase';
import 'firebase/firestore';
import {
  USER_POSTS_STATE_CHANGE,
  USER_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  CLEAR_DATA,
} from '../constants';

export function clearData() {
  return (dispatch) => {
    dispatch({ type: CLEAR_DATA });
  };
}

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

        for (let i = 0; i < following.length; i++) {
          dispatch(fetchUsersData(following[i]));
        }
      });
  };
}

export function fetchUsersData(uid, getPosts) {
  return (dispatch, getState) => {
    const found = getState().usersState.users.some((u) => u.uid === uid);

    if (!found) {
      firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            const user = snapshot.data();
            user.uid = snapshot.id;
            dispatch({
              type: USERS_DATA_STATE_CHANGE,
              payload: user,
            });
            dispatch(fetchUsersFollowingPosts(user.uid));
          } else {
            console.log('No user exists');
          }
        });
      if (getPosts) {
        dispatch(fetchUsersFollowingPosts(uid));
      }
    }
  };
}

export function fetchUsersFollowingPosts(uid) {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(uid)
      .collection('userPosts')
      .orderBy('creation', 'asc')
      .get()
      .then((snapshot) => {
        const uid = snapshot.query.EP.path.segments[1];
        const user = getState().usersState.users.find((u) => u.uid === uid);

        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          user,
        }));

        dispatch({
          type: USERS_POSTS_STATE_CHANGE,
          payload: posts,
        });
      });
  };
}
