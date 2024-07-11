"use client"
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

      // Only include artistName if it's provided and not empty
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
    <div className="flex flex-col h-[400px] border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black dark:bg-gray-700 dark:text-white'}`}>
              {message.text}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="text-center">
            <span className="inline-block p-2 rounded-lg bg-gray-200 text-black dark:bg-gray-700 dark:text-white">
              Thinking...
            </span>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex p-4">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button type="submit" className="ml-2" disabled={isLoading || !songTitle}>
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;