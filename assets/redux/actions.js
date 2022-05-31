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

export const SET_THEME = 'SET_THEME';

export const setTheme = theme => dispatch => {
  dispatch({
    type: SET_THEME,
    payload: theme,
  });
};

export const SET_LANGUAGE = 'SET_LANGUAGE';

export const setLanguage = language => dispatch => {
  dispatch({
    type: SET_LANGUAGE,
    payload: language,
  });
};

export const SET_SECRET = 'SET_SECRET';

export const setSecret = secret => dispatch => {
  dispatch({
    type: SET_SECRET,
    payload: secret,
  });
};