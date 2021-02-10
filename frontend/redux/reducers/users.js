import {
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  USERS_LIKES_STATE_CHANGE,
  CLEAR_DATA,
} from '../constants';

const initialState = {
  users: [],
  usersFollowingLoaded: 0,
  feed: [],
};

export const users = (state = initialState, action) => {
  switch (action.type) {
    case USERS_DATA_STATE_CHANGE:
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    case USERS_POSTS_STATE_CHANGE:
      return {
        ...state,
        usersFollowingLoaded: state.usersFollowingLoaded + 1,
        feed: [...state.feed, ...action.payload],
      };
    case USERS_LIKES_STATE_CHANGE:
      return {
        ...state,
        feed: state.feed.map((post) =>
          post.id === action.payload.postId
            ? { ...post, currentUserLike: action.payload.currentUserLike }
            : post,
        ),
      };
    case CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
};
