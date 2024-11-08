import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectDate } from "../../redux/selectors/dateSelector";
import Calendar from "../components/Calendar";

export default function TodoList() {
  const selectedDate = useSelector(selectDate);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState(1);
  const [subtasks, setSubtasks] = useState([]);

  // Fetch tasks for the selected date
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:8787/user/fetchtodo", {
          params: { date: selectedDate },
          headers: { Authorization: localStorage.getItem("token") },
        });

        const sortedTasks = response.data.message.sort(
          (a, b) => a.status - b.status || a.priority - b.priority
        );

        setTasks(sortedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [selectedDate]);

  // Toggle task completion status
  const toggleTaskCompletion = async (taskToToggle) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskToToggle.id ? { ...task, status: !task.status } : task
    );

    const sortedTasks = updatedTasks.sort(
      (a, b) => a.status - b.status || a.priority - b.priority
    );

    setTasks(sortedTasks);

    try {
      await axios.patch("http://localhost:8787/user/updatetodo", {
        index: taskToToggle.id,
        completed: !taskToToggle.status,
      },{
        headers: { Authorization: localStorage.getItem("token") },
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Toggle subtask completion
  const toggleSubtaskCompletion = async (taskId, subtaskIndex) => {
    const task = tasks.find((task) => task.id === taskId);
  
    const subtask = task.subtasks[subtaskIndex];
  
    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        const updatedSubtasks = [...t.subtasks];
        updatedSubtasks[subtaskIndex].status = !updatedSubtasks[subtaskIndex].status;
        updatedSubtasks.sort((a, b) => a.status - b.status); // Move completed subtasks to the end
        return { ...t, subtasks: updatedSubtasks };
      }
      return t;
    });
  
    setTasks(updatedTasks);
  
    try {
      await axios.patch(
        "http://localhost:8787/user/updatesubtask",{
          subtaskId: subtask.id,
          completed: subtask.status,
        },{
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
    } catch (error) {
      console.error("Error updating subtask:", error);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);

    try {
      await axios.delete(`http://localhost:8787/user/deletetodo?id=${taskId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Add a new task
  const addTask = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        "http://localhost:8787/user/addtodo",
        {
          date: selectedDate,
          title: taskTitle,
          description: taskDescription,
          priority: taskPriority,
          subtasks,
        },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
  
      const updatedTasks = response.data.message.sort(
        (a, b) => a.status - b.status || a.priority - b.priority
      );
  
      setTasks(updatedTasks);
      closeModal();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };  

  // Add a new subtask
  const addSubtask = () => {
    setSubtasks([...subtasks, { content: "", status: false }]);
  };

  // Update subtask content
  const updateSubtaskContent = (index, content) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].content = content;
    setSubtasks(updatedSubtasks);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority(1);
    setSubtasks([]);
  };

  return (
    <div className="bg-gradient-to-br from-custom-100 to-custom-200 h-screen p-6">
      
      <div className="flex justify-center items-center mb-8">
        <button
          className="border-2 rounded-3xl bg-gradient-to-r from-custom-300 to-custom-400 text-white w-32 h-12 hover:bg-custom-300 shadow-md transition duration-200 transform hover:scale-105"
          onClick={() => setModalOpen(true)}
        >
          Add Task
        </button>
        <Calendar />
      </div>

      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white p-4 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 flex flex-col justify-between ${
              task.status ? "opacity-70" : ""
            }`}
          >
            <label className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={task.status}
                onChange={() => toggleTaskCompletion(task)}
                className="mr-2 h-5 w-5 rounded-full border-2 border-gray-400 checked:bg-custom-300 checked:border-custom-400 appearance-none transition duration-200 cursor-pointer"
              />
              <span
                className={`text-lg font-medium ${
                  task.status ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </span>
            </label>
            <p
              className={`text-sm mb-3 ${
                task.status ? "line-through text-gray-400" : "text-gray-600"
              }`}
            >
              {task.description}
            </p>

            {task.subtasks && (
              <ul className="pl-6 list-disc space-y-2">
                {task.subtasks.map((subtask, index) => (
                  <li key={subtask.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={subtask.status}
                      onChange={() => toggleSubtaskCompletion(task.id, index)}
                      className="mr-2 h-5 w-5 rounded-full border-2 border-gray-400 checked:bg-custom-300 checked:border-custom-400 appearance-none transition duration-200 cursor-pointer"
                    />
                    <span
                      className={`text-sm ${
                        subtask.status ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {subtask.content}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-end">
              <button
                className="bg-gradient-to-r from-custom-400 to-custom-300 border-2 h-10 rounded-xl w-24 text-white shadow-md hover:bg-custom-400 transition duration-200 transform hover:scale-105"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <form onSubmit={addTask} className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <input
              type="text"
              placeholder="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
              required
            />
            <textarea
              placeholder="Task Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
            />
            <input
              type="number"
              min="1"
              value={taskPriority}
              onChange={(e) => setTaskPriority(Number(e.target.value))}
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
              placeholder="Priority (1 = Highest)"
              required
            />
            <h3 className="font-semibold mb-2">Subtasks</h3>
            {subtasks.map((subtask, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Subtask ${index + 1}`}
                value={subtask.content}
                onChange={(e) => updateSubtaskContent(index, e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full mb-2"
              />
            ))}
            <button
              type="button"
              onClick={addSubtask}
              className="text-sm text-blue-500 hover:underline mb-4"
            >
              + Add Subtask
            </button>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-custom-400 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-custom-300 transition duration-200"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
