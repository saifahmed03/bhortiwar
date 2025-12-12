import React, { useState, useRef, useEffect } from 'react';
import { askAICounselor } from '../../services/geminiService';
import './AICounselor.css';

const AICounselor = ({ isOpen, onClose, userContext = {} }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Suggested questions
    const suggestions = [
        "Calculate my BUET admission eligibility",
        "Compare NSU vs BRAC University",
        "GPA 4.2 - which universities should I target?",
        "CSE vs EEE - salary comparison"
    ];

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue('');

        // Add user message
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            // Get AI response
            const aiResponse = await askAICounselor(userMessage, userContext);

            // Add AI response
            setMessages(prev => [...prev, { type: 'ai', text: aiResponse }]);
        } catch (error) {
            console.error('AI Error:', error);
            setMessages(prev => [...prev, {
                type: 'ai',
                text: "I'm having trouble right now, but don't worry! You're doing great. Keep going! 💙"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="ai-counselor-overlay" onClick={onClose}>
            <div className="ai-counselor-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="ai-counselor-header">
                    <div className="ai-counselor-header-left">
                        <div className="ai-counselor-icon">🧠</div>
                        <div>
                            <h2 className="ai-counselor-title">AI Counselor</h2>
                            <p className="ai-counselor-subtitle">Your personal admission strategist</p>
                        </div>
                    </div>
                    <button className="ai-counselor-close" onClick={onClose}>×</button>
                </div>

                {/* Chat Area */}
                <div className="ai-counselor-chat">
                    {messages.length === 0 ? (
                        <div className="ai-counselor-empty">
                            <div className="ai-counselor-empty-icon">💬</div>
                            <h3>How can I help you today?</h3>
                            <p>Ask me anything about admissions, stress, or your future!</p>
                            <div className="ai-counselor-suggestions">
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        className="suggestion-chip"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, index) => (
                                <div key={index} className={`${msg.type}-message`}>
                                    {msg.type === 'ai' && (
                                        <div className="ai-message-label">AI Counselor</div>
                                    )}
                                    {msg.text}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="typing-indicator">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div className="ai-counselor-input-area">
                    <input
                        type="text"
                        className="ai-counselor-input"
                        placeholder="Type your question here..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                    <button
                        className="ai-counselor-send-btn"
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isLoading}
                    >
                        {isLoading ? '...' : 'Send'}
                        {!isLoading && <span>→</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AICounselor;
