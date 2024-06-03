import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectDate } from "../../redux/selectors/dateSelector";
import Calendar from "../components/Calendar";

export default function Todo() {

  const date = useSelector(selectDate);

  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    const fetchTodo = async () => {

      console.log("frontend: " + date);

      try {
        const response = await axios.get('http://localhost:8787/user/fetchtodo', {
          params: { date: date },
          headers: { "Authorization": localStorage.getItem("token") }
        });
        
        setTodoList(response.data.message); 
           
        // console.log("todos: ", response.data.message)    
        
      } catch (error) {
        console.error("Error in Fetching Todos: ", error);
      }
    };

    fetchTodo();
  }, [date]);    


  async function handleCheckboxChange(utodo) {

    const updatedList = todoList.map((todo) => {
      return todo.id === utodo.id ? { ...todo, status: !todo.status } : todo;
    });

    setTodoList(updatedList);

    try {
        
      await axios.patch('http://localhost:8787/updatetodo', {
        index: utodo.id,
        completed: !utodo.status       
      });

    } catch(error) {
      console.error("Error in Updating Todos: ", error);
    }
  };


  async function handleDelete(id) {
    const updatedList = todoList.filter((todo) => todo.id !== id);
    setTodoList(updatedList);

    try {
      const response = await axios.delete(`http://localhost:8787/deletetodo?id=${id}`);
    } catch(error) {
      console.error("Error in Deleting Todos: ", error);
    }
  };


  async function handleAdd(){
    try {
      const response = await axios.post('http://localhost:8787/user/addtodo', 
        { date: date, addTodo: todo },
        { headers: { "Authorization": localStorage.getItem('token') } }
      );

      setTodoList(prevTodos => [...prevTodos, response.data.message]);
      console.log("added");

      setTodo("");

    } catch(error) {
      console.error("Error in Adding Todo: ", error);
    }
  };

  return (
    <div className="bg-custom-200 h-screen">
      <div className="flex gap-3 justify-center items-center">
        <input className="border-2 rounded-2xl h-14 px-6 my-5 mx-3" onChange={(e) => setTodo(e.target.value)} value={todo} placeholder="Add Task" required />
        <button className="border-2 rounded-3xl bg-emerald-400 w-16 ml-4 h-10 hover:bg-emerald-200" onClick={async () => {await handleAdd();}}> Add </button>
        <Calendar />
      </div>
      <div className="flex justify-center items-center">
        <h1 className="text-center m-4 px-4 w-fit bg-custom-300 rounded-xl p-2 text-3xl"> Tasks </h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {todoList.map((todo, index) => {
        // console.log("ayo "+todo);
        return( 
        <> 
          <div className='bg-custom-400 p-2 m-2 rounded-2xl flex flex-col justify-between' key={todo.id}>
            <label>
              <input
                className='m-3'
                type="checkbox"
                checked={todo.status}
                onChange={async () => await handleCheckboxChange(todo)}
              />
              <span className='text-lg'
                style={{
                  textDecoration: todo.status ? "line-through" : "none",
                  color: todo.status ? "lightgray" : "inherit",
                }} >
                {todo.content}
              </span>
            </label>
            <div className="flex justify-end">
              <button className='bg-red-500 border-2 h-10 rounded-xl w-24 hover:bg-red-300 m-2' onClick={async () => await handleDelete(todo.id)}> Delete </button>
            </div>
          </div>
        </>
        )     
      })}
      </div>
    </div>
  );
}
