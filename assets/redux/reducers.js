import { ADD_TASK } from "./actions";

const initialState = {
  tasks: [],
};

export default function tasksReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TASK:
      return { ...state, tasks: [action.payload, ...state.tasks] };
    default:
      return state;
  }
}