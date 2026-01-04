"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, Sparkles, X, Mic, MicOff } from "lucide-react"

// Import from data layer and response handlers
import { SUDHANSHU_DATA } from "@/data/user-data"
import { QUICK_QUESTIONS } from "@/lib/chatbot-responses" // Keep quick questions for UI
import { AIModelSelector } from "@/components/ai-model-selector"
import { DEFAULT_MODEL } from "@/lib/ai/config"
import { AIModel, ChatMessage } from "@/lib/ai/types"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
}

const INITIAL_MESSAGE: Message = {
  id: "1",
  text: `🌟 Namaste ${SUDHANSHU_DATA.name}! I'm your Cosmic Guide. I can access Google Gemini, Groq, and OpenRouter to answer your astrological queries with the latest AI models. How can I guide you today?`,
  isBot: true,
  timestamp: new Date(),
}

import { useAstrologyStore, useIsChatOpen, useChatMessages, useIsTyping } from "@/stores/astrology-store"

export default function AstroChatbot() {
  const isOpen = useIsChatOpen()
  const messages = useChatMessages()
  const isTyping = useIsTyping()

  // Local state for input only
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [selectedModel, setSelectedModel] = useState<AIModel>(DEFAULT_MODEL)

  const { setChatOpen, addChatMessage, setIsTyping: setStoreTyping } = useAstrologyStore()

  // Sync local/global typing state if needed, or just use store
  const setIsTyping = setStoreTyping

  // Initialize store if empty? (INITIAL_MESSAGE)
  useEffect(() => {
    if (messages.length === 0) {
      addChatMessage({
        text: INITIAL_MESSAGE.text,
        isBot: true
      })
    }
  }, [])


  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<unknown>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onresult = (event: { results: { 0: { 0: { transcript: string } } } }) => {
          const transcript = event.results[0][0].transcript
          setInputValue(transcript)
          setIsListening(false)
        }

        recognition.onerror = () => {
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }

    return () => {
      if (recognitionRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (recognitionRef.current as any).abort?.()
      }
    }
  }, [])

  const toggleVoiceInput = useCallback(() => {
    if (!recognitionRef.current) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = recognitionRef.current as any

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)
    }
  }, [isListening])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom, isTyping])

  const handleSendMessage = useCallback(async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim()
    if (!textToSend) return

    addChatMessage({
      text: textToSend,
      isBot: false
    })
    setInputValue("")
    setIsTyping(true)

    try {
      // Construct chat history for the API
      const apiMessages: ChatMessage[] = messages.map(m => ({
        role: m.isBot ? 'assistant' : 'user',
        content: m.text
      }));
      // Add the new user message
      apiMessages.push({ role: 'user', content: textToSend });

      // Add system context about the user's astrology data
      // We prepend this as a system message (or first user message content)
      const { userData } = useAstrologyStore.getState()

      const systemContext = `You are a Vedic Astrology AI assistant. 
        User Data: ${JSON.stringify(userData)}.
        Answer questions based on this birth chart data. Be helpful, mystical, and accurate.`;

      apiMessages.unshift({ role: 'system', content: systemContext });

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          provider: selectedModel.provider,
          modelId: selectedModel.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      addChatMessage({
        text: data.text,
        isBot: true
      });

    } catch (error) {
      console.error('Chat error:', error);
      addChatMessage({
        text: "I apologize, but I'm having trouble connecting to the cosmic consciousness (API Error). Please check your API keys or try again.",
        isBot: true
      });
    } finally {
      setIsTyping(false);
    }

  }, [inputValue, messages, selectedModel])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div className="fixed bottom-6 right-6 z-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setChatOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-lg border-0"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="bot"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Bot className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[600px] sm:h-[85vh] z-50"
          >
            <Card className="h-full bg-gradient-to-br from-slate-900/95 to-purple-900/95 border-purple-500/30 backdrop-blur-sm shadow-2xl flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-purple-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Cosmic Guide</h3>
                      <p className="text-xs text-gray-400">AI Vedic Astrologer</p>
                    </div>
                  </div>
                </div>

                {/* Model Selector */}
                <div className="w-full">
                  <AIModelSelector onModelChange={setSelectedModel} currentModel={selectedModel} />
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-lg break-words overflow-wrap-anywhere ${message.isBot
                        ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white"
                        : "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-white"
                        }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              <div className="p-3 border-t border-purple-500/30">
                <div className="flex flex-wrap gap-2 mb-3">
                  {QUICK_QUESTIONS.slice(0, 3).map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage(question.text)}
                      className="text-xs bg-slate-800/50 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white"
                    >
                      <span className="mr-1">{question.icon}</span>
                      {question.text}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-purple-500/30">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isListening ? "Listening..." : "Ask your question..."}
                    className={`flex-1 bg-slate-800/50 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-400 ${isListening ? 'border-red-400' : ''}`}
                  />
                  <Button
                    onClick={toggleVoiceInput}
                    variant="outline"
                    className={`border-purple-500/30 ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-purple-400 hover:bg-purple-500/10'}`}
                    aria-label={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim()}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 border-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
