import { ADD_TASK, DELETE_TASK, MARK_TASK_AS_DONE } from "./actions";
import { SET_THEME } from "./actions";
import { SET_LANGUAGE } from "./actions";

const initialState = {
  tasks: [],
  theme: 'light',
  language: 'vn',
};

export const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK:
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case DELETE_TASK:
      return { ...state, tasks: state.tasks.filter(task => task.content.data.id !== action.payload.content.data.id) };
    case MARK_TASK_AS_DONE:
      return { 
        ...state, 
        tasks: state.tasks.map(task => {
          if (task.content.data.id !== action.payload.content.data.id) {
            return task;
          }

          return {
            ...task,
            content: {
              ...task.content,
              data: {
                ...task.content.data,
                taskDone: true,
              }
            }
          }
        })
        .sort((a, b) => a.content.data.taskDone === b.content.data.taskDone ? 0 : a.content.data.taskDone ? 1 : -1)
      };
    default:
      return state;
  }
};

export const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_THEME:
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};

export const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LANGUAGE:
      return { ...state, language: action.payload };
    default:
      return state;
  }
};