import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ArrowLeft, ArrowRight, Bot, Plus } from 'lucide-react'
import '../styles/AIChat.css'

function AIChat() {
  return (
    <div className="ai-chat">
      <Navbar />

      <main className="ai-chat-main">
        <section className="ai-chat-conversations">
          <div className="ai-chat-conversations-header">
            <label className="ai-chat-conversations-title">History</label>
            <button
              className="ai-chat-new-conversation-button"
              type="button"
              aria-label="New conversation"
              title="New conversation"
            >
              <Plus className="ai-chat-new-conversation-icon" />
            </button>
          </div>
          <label className="ai-chat-conversations-description">
            All your chats are saved here.
          </label>
        </section>

        <section className="ai-chat-chat">
          <header className="ai-chat-chat-header">
            <button className="ai-chat-back-button" type="button" aria-label="Go back" title="Go back">
              <ArrowLeft className="ai-chat-back-icon" />
            </button>
            <span className="ai-chat-assistant-icon-box">
              <Bot className="ai-chat-assistant-icon" />
            </span>
            <p className="ai-chat-chat-title">AI Assistant</p>
          </header>

          <div className="ai-chat-messages">
            <article className="ai-chat-message ai-chat-assistant-message">
              <span className="ai-chat-message-icon-box">
                <Bot className="ai-chat-message-icon" />
              </span>
              <p className="ai-chat-message-text">Hello, how can I help you today?</p>
            </article>
          </div>
        </section>

        <section className="ai-chat-text-message">
          <button className="ai-chat-attachment-button" type="button" aria-label="Add attachment" title="Add attachment">
            <Plus className="ai-chat-attachment-icon" />
          </button>
          <input
            className="ai-chat-message-input"
            type="text"
            placeholder="Ask me anything about your knowledge base..."
            aria-label="Message"
          />
          <button className="ai-chat-send-button" type="button" aria-label="Send message" title="Send message">
            <ArrowRight className="ai-chat-send-icon" />
          </button>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default AIChat
