"use client"
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatInterface = ({ songTitle, artistName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || !songTitle) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const requestBody = {
        message: input,
        songTitle: songTitle,
      };

      if (artistName && artistName.trim() !== '') {
        requestBody.artistName = artistName;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      const aiMessage = { text: data.response, sender: 'ai' };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = { text: `Error: ${error.message}`, sender: 'ai' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <ScrollArea className="chat-scroll-area">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${
              message.sender === 'user' ? 'user-message' : 'ai-message'
            }`}
          >
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div className="loading-message">
            Thinking...
          </div>
        )}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="input-form">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="message-input"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()} className="send-button">
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
