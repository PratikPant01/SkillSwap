import React, { useEffect, useState, useRef } from 'react';
import { X, Send, MessageCircle, Paperclip, Smile } from 'lucide-react';

interface Message { // for the message object structure 
  id: number;  // unique id for each message
  text: string; // actual message content
  sender: 'me' | 'them'; // either me or them 
  timestamp: Date;
}

interface Props {
  user: { id: number; name: string; isOnline?: boolean } | null;  // user info
  onClose: () => void; // to close the chat
}

const MessageChatBox = ({ user, onClose }: Props) => {

  const loadMessages = () => {  
    if (!user) return [];  
    const stored = localStorage.getItem(`chat_messages_${user.id}`);
    // from the message id get the user message 
    if (stored) {
      
      const parsed = JSON.parse(stored);
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
    return [];
  };

  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (user && messages.length > 0) {
      localStorage.setItem(`chat_messages_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  // Load messages when user changes - FIXED: Now responds to any user change
  useEffect(() => {
    if (user) {
      setMessages(loadMessages());
      setIsOpen(true);
    }
  }, [user]);

  /**
   * 📌 COUNT UNREAD MESSAGES
   * 
   * This function counts only messages from "them" (the other user).
   * - Filters messages array to only include sender: 'them'
   * - Returns the count of their messages
   * - This count appears in the red badge on the message icon
   */
  const getUnreadCount = () => {
    return messages.filter(msg => msg.sender === 'them').length;
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputText.trim(),
      sender: 'me',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  if (!user) return null;

  const unreadCount = getUnreadCount();

  return (
    <>
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg hover:shadow-xl hover:bg-blue-600 transition-all duration-200 flex items-center justify-center z-50"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          {/* Only show badge if there are messages from "them" */}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs font-bold">{unreadCount}</span>
            </div>
          )}
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-[450px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200 animate-slideIn">
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
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <MessageCircle className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-gray-900 text-sm font-medium">{user.name}</p>
                <p className="text-gray-400 text-xs mt-1 max-w-[200px]">Send a message to start the conversation</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                >
                  {message.sender === 'them' && (
                    <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-medium flex-shrink-0 mb-0.5">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col max-w-[70%] min-w-0">
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm ${
                        message.sender === 'me'
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }`}
                    >
                      <p className="break-words leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    </div>
                    <span className={`text-xs text-gray-400 mt-0.5 ${message.sender === 'me' ? 'text-right' : 'text-left'}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
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
              />
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <Smile className="w-4 h-4" />
              </button>
              <button
                onClick={handleSend}
                disabled={inputText.trim() === ''}
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