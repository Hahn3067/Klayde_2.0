
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  Loader2,
  FileText,
  User,
  Bot,
  Sparkles,
  ExternalLink,
  AlertTriangle 
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 
import { Link } from 'react-router-dom'; 

import { aiChat } from "@/api/functions";
import { UsageLog } from "@/api/entities"; 
import { createPageUrl } from '@/utils'; // New import for createPageUrl

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your AI research assistant. I can answer questions about your documents, help you find information, and provide insights from your lab's knowledge base. What would you like to know?",
      timestamp: new Date(),
      sources: []
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [tokensAtLimit, setTokensAtLimit] = useState(false); // New state for token limit

  const categoryColors = {
    research_paper: "bg-blue-100 text-blue-800",
    protocol: "bg-green-100 text-green-800",
    data_analysis: "bg-purple-100 text-purple-800",
    meeting_notes: "bg-yellow-100 text-yellow-800",
    grant_proposal: "bg-red-100 text-red-800",
    lab_manual: "bg-indigo-100 text-indigo-800",
    literature_review: "bg-pink-100 text-pink-800",
    experiment_log: "bg-orange-100 text-orange-800",
    other: "bg-gray-100 text-gray-800"
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to check token limits on component mount
  useEffect(() => {
    const checkTokenLimits = async () => {
      try {
        const usageData = await UsageLog.list(); // Assuming UsageLog.list() fetches current month's usage
        const totalTokens = usageData.reduce((sum, log) => sum + (log.token_count || 0), 0); // Ensure token_count is a number
        const maxTokens = 20000; // Define maximum token limit
        setTokensAtLimit(totalTokens >= maxTokens);
      } catch (error) {
        console.error("Failed to check token limits:", error);
        // Optionally, handle error state or set tokensAtLimit to true to prevent overuse
      }
    };
    checkTokenLimits();
  }, []); // Empty dependency array means this runs once on mount

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (tokensAtLimit) {
      const errorMessage = {
        id: Date.now(),
        type: 'ai',
        content: "I'm sorry, but you've reached your monthly AI token limit. Please upgrade your plan to continue our conversation.",
        timestamp: new Date(),
        sources: []
      };
      setMessages(prev => [...prev, errorMessage]);
      setInputMessage(""); // Clear input even if limit reached
      return; // Stop message sending process
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      sources: []
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      console.log('Starting AI chat with query:', inputMessage.trim());
      const { data } = await aiChat({ query: inputMessage.trim() });
      console.log('AI chat response:', data);

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.answer || "I couldn't generate a response. Please try rephrasing your question.",
        timestamp: new Date(),
        sources: data.sources || []
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
        sources: []
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What are the key findings from our recent research?",
    "Summarize the protocols for cell culture experiments",
    "What methodologies were used in our data analysis?",
    "Tell me about the grant requirements mentioned in our proposals",
    "What are the main topics covered in our meeting notes?"
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto p-6 lg:p-8 w-full flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight mb-4 flex items-center gap-3">
            <Bot className="w-10 h-10 text-purple-600" />
            AI Chat Assistant
          </h1>
          <p className="text-gray-600 text-lg">
            Have a conversation with your documents. Ask questions and get intelligent answers based on your lab's knowledge base.
          </p>
        </motion.div>

        {/* Token Limit Warning */}
        {tokensAtLimit && (
          <Alert className="border-red-300 bg-red-50 mb-6">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800 font-bold">AI Token Limit Reached</AlertTitle>
            <AlertDescription className="text-red-700">
              You have exhausted your monthly AI tokens.
              <Link to={createPageUrl("Pricing")} className="underline font-medium ml-1">
                Upgrade your plan
              </Link> to continue chatting with your documents.
            </AlertDescription>
          </Alert>
        )}

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="shadow-sm border-gray-200 bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Try asking me about:
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="w-full text-left h-auto p-3 bg-white border border-gray-200 hover:bg-gray-50 hover:border-purple-300 rounded-md transition-colors flex items-start gap-3"
                      onClick={() => setInputMessage(question)}
                      style={{ fontFamily: 'system-ui, sans-serif' }}
                      disabled={tokensAtLimit} // Disable suggested questions if limit reached
                    >
                      <MessageCircle className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{question}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto space-y-6 pb-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-4 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div className={`max-w-[80%] ${
                    message.type === 'user' ? 'order-2' : 'order-1'
                  }`}>
                    <Card className={`shadow-sm ${
                      message.type === 'user'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white border-gray-200'
                    }`}>
                      <CardContent className="p-4">
                        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>

                        {/* Sources for AI messages */}
                        {message.type === 'ai' && message.sources && message.sources.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs font-semibold text-gray-600 mb-2">Sources:</p>
                            <div className="space-y-2">
                              {message.sources.slice(0, 3).map((doc, index) => (
                                <div
                                  key={index}
                                  className="text-xs bg-gray-50 rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition-colors"
                                  onClick={() => window.open(doc.file_url, '_blank')}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-gray-800 truncate">{doc.title}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        {doc.category && (
                                          <Badge
                                            variant="secondary"
                                            className={`text-xs ${categoryColors[doc.category] || categoryColors.other}`}
                                          >
                                            {doc.category.replace(/_/g, ' ')}
                                          </Badge>
                                        )}
                                        <span className="text-xs text-gray-500">
                                          {Math.round(doc.similarity * 100)}% match
                                        </span>
                                      </div>
                                    </div>
                                    <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <p className="text-xs text-gray-400 mt-2">
                          {format(message.timestamp, 'HH:mm')}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 order-3">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 justify-start"
                >
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <Card className="bg-white border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>
        </div>

        {/* Input Area */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder={tokensAtLimit ? "AI token limit reached - upgrade to continue..." : "Ask me anything about your documents..."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border-0 focus:ring-0 text-base"
                disabled={isLoading || tokensAtLimit} // Disable input if loading or limit reached
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim() || tokensAtLimit} // Disable button if loading, input empty, or limit reached
              className={`font-semibold px-6 py-2 rounded-md transition-colors flex items-center ${
                tokensAtLimit
                  ? 'bg-red-300 text-red-700 cursor-not-allowed' // Styling for limit reached
                  : 'bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white' // Original styling
              }`}
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : tokensAtLimit ? (
                "Limit Reached" // Button text when limit reached
              ) : (
                <Send className="w-5 h-5" /> // Original send icon
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
