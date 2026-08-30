import { Lightbulb } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import '../styles/AIButton.css'

function AIButton() {
  const navigate = useNavigate()

  return (
    <button onClick = {() => navigate("/ai-chat")} className="ai-button" type="button" aria-label="Open AI assistant" title="AI assistant" >
      <Lightbulb className="ai-button-icon" />
    </button>
  )
}

export default AIButton
