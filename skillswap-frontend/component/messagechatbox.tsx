import React, { useEffect, useState, useRef } from 'react';
import { X, Send, MessageCircle, Paperclip, Smile } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  sender_id: number;
  sender_name: string;
  created_at: string;
  is_read: boolean;
}

interface Props {
  user: { id: number; name: string; isOnline?: boolean } | null;
  onClose: () => void;
  currentUserId: number;
  token: string;
}

const MessageChatBox = ({ user, onClose, currentUserId, token }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const API_URL = 'https://skillswapservice.up.railway.app';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation when user changes
  useEffect(() => {
    if (user) {
      initializeConversation();
      setIsOpen(true);
    }
    
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [user]);

  // Poll for new messages every 3 seconds when conversation is open
  useEffect(() => {
    if (isOpen && conversationId) {
      pollingInterval.current = setInterval(() => {
        fetchMessages();
      }, 3000);
    } else {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    }

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [isOpen, conversationId]);

  const initializeConversation = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      // Get or create conversation
      const response = await fetch(`${API_URL}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ otherUserId: user.id })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        setError(`Failed to create conversation (${response.status})`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setConversationId(data.conversation.id);
        await fetchMessages(data.conversation.id);
      }
    } catch (err) {
      console.error('Error initializing conversation:', err);
      setError('Failed to initialize conversation');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId?: number) => {
    const id = convId || conversationId;
    if (!id) return;

    try {
      const response = await fetch(`${API_URL}/conversations/${id}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error('Fetch messages error:', response.status);
        return; // Don't throw, just log
      }

      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSend = async () => {
    if (inputText.trim() === '' || !conversationId) return;

    const messageContent = inputText.trim();
    setInputText('');

    try {
      const response = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: messageContent })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        // Add new message to the list immediately
        setMessages(prev => [...prev, data.message]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      // Restore input if send failed
      setInputText(messageContent);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  if (!user) return null;

  // Count unread messages (messages from other user)
  const unreadCount = messages.filter(msg => msg.sender_id !== currentUserId).length;

  return (
    <>
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg hover:shadow-xl hover:bg-blue-600 transition-all duration-200 flex items-center justify-center z-50"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs font-bold">{unreadCount}</span>
            </div>
          )}
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-112.5 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200 animate-slideIn">
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {user.isOnline !== undefined && (
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                )}
              </div>
              <div>
                <h3 className="text-gray-900 font-medium text-sm">{user.name}</h3>
                {user.isOnline !== undefined && (
                  <p className="text-gray-500 text-xs">{user.isOnline ? 'Online' : 'Offline'}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-white space-y-3">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-3">
                  <X className="w-7 h-7 text-red-500" />
                </div>
                <p className="text-red-600 text-sm font-medium">{error}</p>
                <p className="text-gray-400 text-xs mt-1 max-w-50">Check console for details</p>
                <button
                  onClick={() => {
                    setError(null);
                    initializeConversation();
                  }}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <MessageCircle className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-gray-900 text-sm font-medium">{user.name}</p>
                <p className="text-gray-400 text-xs mt-1 max-w-50">Send a message to start the conversation</p>
              </div>
            ) : (
              messages.map((message) => {
                const isMe = message.sender_id === currentUserId;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}
                  >
                    {!isMe && (
                      <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-medium shrink-0 mb-0.5">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col max-w-[70%] min-w-0">
                      <div
                        className={`px-3 py-2 rounded-2xl text-sm ${
                          isMe
                            ? 'bg-blue-500 text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}
                      >
                        <p className="break-word leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <span className={`text-xs text-gray-400 mt-0.5 ${isMe ? 'text-right' : 'text-left'}`}>
                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 bg-transparent focus:outline-none text-sm text-gray-900 placeholder-gray-400"
                disabled={!!error}
              />
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <Smile className="w-4 h-4" />
              </button>
              <button
                onClick={handleSend}
                disabled={inputText.trim() === '' || loading || !!error}
                className="bg-blue-500 text-white p-1.5 rounded-md hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default MessageChatBox;