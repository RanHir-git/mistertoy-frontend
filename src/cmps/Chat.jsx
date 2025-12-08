import { useState, useRef, useEffect } from 'react'

/**
 * Chat Component
 * 
 * A simple chat interface that allows users to enter messages.
 * Automatically responds to user messages after a short delay.
 * 
 * Features:
 * - Local state for messages (not persisted)
 * - Input field to add new messages
 * - Auto-response feature (simulates a bot response)
 */
export function Chat() {
    const [msgs, setMsgs] = useState([])
    const [inputValue, setInputValue] = useState('')
    const messagesEndRef = useRef(null)
    
    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [msgs])
    
    function handleSubmit(event) {
        event.preventDefault()
        
        if (!inputValue.trim()) return // Don't add empty messages
        
        // Add user message
        const userMsg = {
            id: Date.now(),
            txt: inputValue,
            by: 'You',
            timestamp: new Date().toLocaleTimeString()
        }
        
        setMsgs(prevMsgs => [...prevMsgs, userMsg])
        setInputValue('') // Clear input
        
        // Auto-respond after a short delay (simulating a bot)
        setTimeout(() => {
            const botMsg = {
                id: Date.now() + 1,
                txt: `Thanks for your message: "${userMsg.txt}"! How can I help you?`,
                by: 'Bot',
                timestamp: new Date().toLocaleTimeString()
            }
            setMsgs(prevMsgs => [...prevMsgs, botMsg])
        }, 1000) // 1 second delay
    }
    
    return (
        <div className="chat-container">
            <div className="chat-messages">
                {msgs.length === 0 ? (
                    <div className="chat-empty">No messages yet. Start chatting!</div>
                ) : (
                    msgs.map(msg => (
                        <div key={msg.id} className={`chat-message ${msg.by === 'You' ? 'chat-message-user' : 'chat-message-bot'}`}>
                            <div className="chat-message-header">
                                <strong>{msg.by}:</strong>
                                <span className="chat-timestamp">{msg.timestamp}</span>
                            </div>
                            <div className="chat-message-text">{msg.txt}</div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} /> {/* Invisible element to scroll to */}
            </div>
            
            <form className="chat-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="chat-input"
                />
                <button type="submit" className="chat-send-btn">Send</button>
            </form>
        </div>
    )
}

