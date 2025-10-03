import React, { useState, useRef, useEffect } from 'react'
import { chatbotResponses } from './data/responses'
import { 
  FaTimes, 
  FaComments, 
  FaPaperPlane, 
  FaRobot,
  FaUser,
  FaClock,
  FaHospital,
  FaAmbulance,
  FaCalendarCheck
} from 'react-icons/fa'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: 'Hello! 👋 Welcome to Civil Surgeon Office, Sindhudurg. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findResponse = (input) => {
    const lowercaseInput = input.toLowerCase()
    
    for (const [key, response] of Object.entries(chatbotResponses)) {
      const keywords = key.split('|')
      for (const keyword of keywords) {
        if (lowercaseInput.includes(keyword)) {
          return response
        }
      }
    }
    
    return "I apologize, I didn't quite understand that. You can ask me about:\n• 🏥 Hospital services\n• 📅 Appointments\n• ⏰ Visiting hours\n• 🚨 Emergency services\n• 🏢 Departments\n• 📞 Contact information"
  }

  const handleSend = () => {
    if (inputValue.trim() === '') return

    // Add user message with timestamp
    const userMessage = { 
      type: 'user', 
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse = findResponse(inputValue)
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickActions = [
    { icon: <FaCalendarCheck />, text: 'Book Appointment', color: 'bg-pink-100 hover:bg-pink-200 text-pink-700' },
    { icon: <FaAmbulance />, text: 'Emergency', color: 'bg-red-100 hover:bg-red-200 text-red-700' },
    { icon: <FaClock />, text: 'Visiting Hours', color: 'bg-purple-100 hover:bg-purple-200 text-purple-700' },
    { icon: <FaHospital />, text: 'Departments', color: 'bg-blue-100 hover:bg-blue-200 text-blue-700' }
  ]

  const handleQuickAction = (action) => {
    setInputValue(action.text)
    setTimeout(() => handleSend(), 100)
  }

  return (
    <>
      {/* Animated Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 ${isOpen ? 'bg-pink-600' : 'bg-gradient-to-r from-pink-500 to-pink-600'} text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-50 group`}
      >
        <div className="relative">
          {isOpen ? (
            <FaTimes className="w-6 h-6 transition-transform duration-300" />
          ) : (
            <>
              <FaComments className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </>
          )}
        </div>
      </button>

      {/* Chat Window with Animation */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[400px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col h-[600px] animate-slideUp">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-5 rounded-t-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <FaRobot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Healthcare Assistant</h3>
                    <p className="text-sm text-pink-100 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                      Online - Here to help!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-pink-50 to-white">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div className={`flex items-end space-x-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-pink-500' : 'bg-gray-200'
                    }`}>
                      {message.type === 'user' ? (
                        <FaUser className="w-4 h-4 text-white" />
                      ) : (
                        <FaRobot className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <div>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-br-sm'
                            : 'bg-white text-gray-800 shadow-md rounded-bl-sm border border-gray-100'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                      </div>
                      <p className={`text-xs text-gray-400 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="flex items-end space-x-2 max-w-[85%]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <FaRobot className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-md border border-gray-100">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2 font-medium">Quick Actions:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className={`flex items-center space-x-1 text-xs px-3 py-2 rounded-full transition-all duration-200 transform hover:scale-105 ${action.color}`}
                >
                  <span className="text-base">{action.icon}</span>
                  <span className="font-medium">{action.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 rounded-b-2xl">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 pr-12 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-200"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={`p-3 rounded-full transition-all duration-200 transform ${
                  inputValue.trim() 
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:shadow-lg hover:scale-110' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <FaPaperPlane className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Powered by Civil Surgeon Office, Sindhudurg
            </p>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #ec4899;
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #db2777;
        }
      `}</style>
    </>
  )
}

export default Chatbot