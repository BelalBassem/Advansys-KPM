import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LessonsPage from './pages/LessonsPage'
import CreateLesson from './pages/CreateLesson'
import AIChat from './pages/AIChat'
import Lesson from './pages/Lesson'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<LessonsPage/>}/>
        <Route path = "/create-lesson" element = {<CreateLesson/>}/>
        <Route path = "/ai-chat" element = {<AIChat/>}/>
        <Route path = "/lesson-details" element = {<Lesson/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
