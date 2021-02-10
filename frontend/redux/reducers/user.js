import {
  USER_POSTS_STATE_CHANGE,
  USER_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  CLEAR_DATA,
} from '../constants';

const initialState = {
  currentUser: null,
  posts: [],
  following: [],
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_STATE_CHANGE:
      return {
        ...state,
        currentUser: action.payload,
      };
    case USER_POSTS_STATE_CHANGE:
      return {
        ...state,
        posts: action.payload,
      };
    case USER_FOLLOWING_STATE_CHANGE:
      return {
        ...state,
        following: action.payload,
      };
    case CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
};
