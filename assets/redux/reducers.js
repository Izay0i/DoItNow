import { ADD_TASK, DELETE_TASK, MARK_TASK_AS_DONE } from "./actions";

const initialState = {
  tasks: [],
};

export default function tasksReducer(state = initialState, action) {
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
      };
    default:
      return state;
  }
}