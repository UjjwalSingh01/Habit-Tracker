import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Todo from './pages/Todo'
import Tracker from './pages/Tracker'
import Login from './pages/Login'
import Register from './pages/Register'
import { Provider } from 'react-redux'
import {store} from '../redux/store'
import Homepage from './pages/Homepage'

function App() {

  return (
    <>
      <div>
      <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/homepage' element={<Homepage />} />
          <Route path='/todo' element={<Todo />} />
          <Route path='/tracker' element={<Tracker />} />
        </Routes>
      </BrowserRouter>
      </Provider>
      </div>
    </>
  )
}

export default App
