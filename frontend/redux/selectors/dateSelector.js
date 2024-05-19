import { createSelector } from 'reselect';

const selectTodoState = state => state.todoReducer;

export const selectDate = createSelector(
  selectTodoState,
  todo => todo.date
);