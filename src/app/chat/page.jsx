// src/app/page.js
import ChatInterface from '@/components/ChatInterface';

export default function chatPage() {
  // ... existing code ...

  return (
    <div className="relative container mx-auto p-4">
      {/* ... existing code ... */}
      <div className="mt-6">
        <h2 className="text-xl flex justify-center mb-4 font-semibold">Chat with AI:</h2>
        <ChatInterface />
      </div>
    </div>
  );
}
