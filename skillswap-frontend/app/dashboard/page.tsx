"use client";

import { useState, useEffect } from 'react';
import { MessageCircle, Search, Clock } from 'lucide-react';
import MessageChatBox from '@/component/messagechatbox';

interface Conversation {
  id: number;
  other_user_id: number;
  other_user_name: string;
  other_user_email: string;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
  updated_at: string;3
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Load auth data
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      const user = JSON.parse(storedUser);
      setCurrentUserId(user.id);
    }
  }, []);

  // Fetch conversations
  useEffect(() => {
    if (!token) return;

    const fetchConversations = async () => {
      try {
        const response = await fetch('http://localhost:5000/conversations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setConversations(data.conversations);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [token]);

  // Filter conversations by search
  const filteredConversations = conversations.filter(conv =>
    conv.other_user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than 1 minute
    if (diff < 60000) return 'Just now';
    
    // Less than 1 hour
    if (diff < 3600000) {
      const mins = Math.floor(diff / 60000);
      return `${mins}m ago`;
    }
    
    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    
    // Less than 7 days
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    }
    
    // Show date
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </h3>
            <p className="text-gray-500">
              {searchQuery 
                ? 'Try a different search term' 
                : 'Start a conversation by messaging someone from their service page'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm divide-y">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedUser({
                  id: conversation.other_user_id,
                  name: conversation.other_user_name
                })}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  conversation.unread_count > 0 ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {conversation.other_user_name.charAt(0).toUpperCase()}
                    </div>
                    {conversation.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold text-gray-900 ${
                        conversation.unread_count > 0 ? 'font-bold' : ''
                      }`}>
                        {conversation.other_user_name}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Clock size={12} />
                        <span>{formatTime(conversation.last_message_time)}</span>
                      </div>
                    </div>
                    
                    <p className={`text-sm text-gray-600 truncate ${
                      conversation.unread_count > 0 ? 'font-semibold text-gray-900' : ''
                    }`}>
                      {conversation.last_message || 'No messages yet'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Box */}
      {currentUserId && token && selectedUser && (
        <MessageChatBox
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          currentUserId={currentUserId}
          token={token}
        />
      )}
    </div>
  );
}