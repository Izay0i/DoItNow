export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const MARK_TASK_AS_DONE = 'MARK_TASK_AS_DONE';

export const addTask = task => dispatch => {
  dispatch({
    type: ADD_TASK,
    payload: task,
  });
};

export const deleteTask = task => dispatch => {
  dispatch({
    type: DELETE_TASK,
    payload: task,
  });
};

export const markTaskAsDone = task => dispatch => {
  dispatch({
    type: MARK_TASK_AS_DONE,
    payload: task,
  });
};