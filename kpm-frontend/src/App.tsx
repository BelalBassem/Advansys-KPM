import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LessonsPage from './pages/LessonsPage'
import CreateLesson from './pages/CreateLesson'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<LessonsPage/>}/>
        <Route path = "/create-lesson" element = {<CreateLesson/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
