
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ChatConversation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ChatListProps {
  conversations: ChatConversation[];
  activeConversation: ChatConversation | null;
  onSelectConversation: (conversation: ChatConversation) => void;
  filter: 'all' | 'dates' | 'rentals';
}

const ChatList: React.FC<ChatListProps> = ({ 
  conversations, 
  activeConversation, 
  onSelectConversation,
  filter
}) => {
  const filteredConversations = conversations.filter(convo => {
    if (filter === 'all') return true;
    if (filter === 'dates') return convo.type === 'date';
    if (filter === 'rentals') return convo.type === 'rental';
    return true;
  });

  return (
    <div className="h-full overflow-y-auto">
      {filteredConversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <p className="text-gray-500">No conversations found</p>
        </div>
      ) : (
        <ul className="divide-y">
          {filteredConversations.map((conversation) => (
            <li 
              key={conversation.id}
              className={cn(
                "cursor-pointer hover:bg-accent/50 transition-colors",
                activeConversation?.id === conversation.id && "bg-accent"
              )}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="flex items-start gap-3 p-4">
                <div className="relative">
                  <Avatar src={conversation.person.profilePicture}>
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium truncate">{conversation.person.name}</h4>
                    <span className="text-xs text-gray-500">
                      {format(new Date(conversation.lastMessageTime), 'h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                </div>
              </div>
              <div className="flex px-4 pb-2">
                {conversation.type === 'date' ? (
                  <Badge variant="outline" className="bg-pink-100 text-pink-700 border-pink-200">Date Match</Badge>
                ) : (
                  <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">Rental Friend</Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;