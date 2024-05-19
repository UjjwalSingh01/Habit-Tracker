import { createSlice } from "@reduxjs/toolkit"

const currentDate = new Date()
const day = String(currentDate.getDate()).padStart(2, "0");
const month = String(currentDate.getMonth() + 1).padStart(2, "0");
const year = String(currentDate.getFullYear());

const modifiedDate = `${day}/${month}/${year}`;

const initialState = {
    todos:[],
    date: modifiedDate ,
    // user: ""
}

const todoSlice = createSlice({
    name:"todo",
    initialState:initialState,
    reducers:{
        
        // initializing todo
        // initialTodo:(state, actions) => {
        //     state.todos = actions.payload
        // },

        // setting user
        // user:(state, actions) => {
        //     state.user = actions.payload
        // },

        // setting date
        date:(state, actions) => {
            state.date = actions.payload
        },

        // adding a new todo
        // addTodo:(state, actions) => {
        //     state.todos.push({
        //         todo: actions.payload,
        //         status: false
        //     })
        // },

        // changing completion status
        // toggle:(state, actions) => {
        //     state.todos.map((todo, index)=>{
        //         if(index == actions.payload){
        //             todo.status = !todo.status;
        //         }
        //         return todo;
        //     })
        // },

        // delete:(state, actions) => {
            // state.todos.splice(action.payload,1);          // splice modifies the original array directly, which might not be suitable for Redux's immutable update principles
        //     state.todos = state.todos.filter((todo, index) => index !== actions.payload);
        // }

    }
})


//  putting all the reducers in todoSlice
export const todoReducer = todoSlice.reducer;

//  putting all the actions( add, toggle ) present in todoSlice
export const actions = todoSlice.actions;
