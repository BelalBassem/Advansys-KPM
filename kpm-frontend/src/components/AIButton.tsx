import { Lightbulb } from 'lucide-react'
import '../styles/AIButton.css'

function AIButton() {
  return (
    <button className="ai-button" type="button" aria-label="Open AI assistant" title="AI assistant">
      <Lightbulb className="ai-button-icon" />
    </button>
  )
}

export default AIButton
