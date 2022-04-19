export const ADD_TASK = 'ADD_TASK';

export const addTask = task => dispatch => {
  dispatch({
    type: ADD_TASK,
    payload: task,
  });
};