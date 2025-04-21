'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatConversation } from '@/lib/types';
import { Send, Phone, Video, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface ChatWindowProps {
  conversation: ChatConversation | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;
    
    // In a real app, you would send this to your backend
    console.log('Sending message:', newMessage, 'to:', conversation.person.name);
    
    // Clear the input
    setNewMessage('');
  };

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-accent/30">
        <div className="text-center max-w-md">
          <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
          <p className="text-gray-500">Choose a conversation from the list to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar src={conversation.person.profilePicture} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{conversation.person.name}</h3>
              {conversation.type === 'date' ? (
                <Badge variant="outline" className="bg-pink-100 text-pink-700 border-pink-200">Date Match</Badge>
              ) : (
                <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">Rental Friend</Badge>
              )}
            </div>
            <span className="text-xs text-green-500">Online</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Phone size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Video size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Info size={20} />
          </Button>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((message, index) => (
          <div 
            key={index}
            className={`flex ${message.fromMe ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] ${message.fromMe ? 'bg-primary text-primary-foreground' : 'bg-accent'} rounded-2xl p-3`}>
              <p>{message.content}</p>
              <div className={`text-xs mt-1 ${message.fromMe ? 'text-primary-foreground/70' : 'text-gray-500'}`}>
                {format(new Date(message.timestamp), 'h:mm a')}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" disabled={!newMessage.trim()}>
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;
