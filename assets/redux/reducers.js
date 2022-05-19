import { ADD_TASK, DELETE_TASK, MARK_TASK_AS_DONE } from "./actions";

const initialState = {
  tasks: [],
  task: {},
};

export default function tasksReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TASK:
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case DELETE_TASK:
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload.id) };
    case MARK_TASK_AS_DONE:
      return { 
        ...state, 
        tasks: state.tasks.map(task => {
          if (task.id !== action.payload.id) {
            return task;
          }

          return {
            ...task,
            taskDone: true,
          }
        })
      };
    default:
      return state;
  }
}