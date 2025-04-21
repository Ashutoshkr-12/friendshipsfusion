'use client'
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout/applayout';
import ChatList from '@/components/Chat/chatList';
import ChatWindow from '@/components/Chat/chatWindow';
import { chatConversations } from '@/mockdata/data';
import { ChatConversation } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Chat = () => {
  const [conversations] = useState<ChatConversation[]>(chatConversations);
  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null);
  const [filter, setFilter] = useState<'all' | 'dates' | 'rentals'>('all');

  const handleSelectConversation = (conversation: ChatConversation) => {
    setActiveConversation(conversation);
  };

  return (
    <AppLayout>
      <div className="container mx-auto h-screen pt-6 pb-20 md:pb-6 md:px-4 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6 px-4 md:px-0">Messages</h1>
        
        <div className="flex flex-col md:flex-row h-[calc(100vh-150px)] rounded-lg overflow-hidden border">
          <div className="w-full md:w-1/3 border-r">
            <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setFilter(value as 'all' | 'dates' | 'rentals')}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="dates">Dates</TabsTrigger>
                <TabsTrigger value="rentals">Rentals</TabsTrigger>
              </TabsList>
            </Tabs>
            <ChatList 
              conversations={conversations}
              activeConversation={activeConversation}
              onSelectConversation={handleSelectConversation}
              filter={filter}
            />
          </div>
          <div className="flex-1">
            <ChatWindow conversation={activeConversation} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Chat;