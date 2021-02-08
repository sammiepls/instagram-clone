import firebase from "firebase";
import "firebase/firestore";
import { USER_STATE_CHANGE } from "../constants";

export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        console.log("snapshot", snapshot.data());
        snapshot.exists ? dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() }) : console.log("No user exists");
      });
  };
}
