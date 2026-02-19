"use client";

import { useState, useEffect } from 'react';
import { MessageCircle, Search, Clock, TrendingUp, Eye, Heart, Share2, Users, ArrowRight, Star, Zap } from 'lucide-react';
import MessageChatBox from '@/component/messagechatbox';
import SellerProposalsPanel from "@/component/SellerProposalsPanel";
import OrdersPanel from "@/component/OrdersPanel";

interface Conversation {
  id: number;
  other_user_id: number;
  other_user_name: string;
  other_user_email: string;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
  updated_at: string;
}

const mockInsights = [
  { id: 1, title: "React Development Tutoring", views: 342, likes: 28, shares: 12, trend: "+18%" },
  { id: 2, title: "UI/UX Design Consultation", views: 189, likes: 15, shares: 7, trend: "+5%" },
  { id: 3, title: "Python for Beginners", views: 521, likes: 44, shares: 23, trend: "+32%" },
];

export default function DashboardPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      const user = JSON.parse(storedUser);
      setCurrentUserId(user.id);
    }
  }, []);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    const fetchConversations = async () => {
      try {
        const res = await fetch('http://localhost:5000/conversations', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setConversations(data.conversations);
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [token]);

  const filteredConversations = conversations.filter(conv =>
    conv.other_user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = conversations.filter(c => c.unread_count > 0).length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 space-y-5 py-25">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight ">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back — here's what's happening</p>
      </div>

      {/* Top Row: Messages + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5 items-start">

        {/* LEFT — Messages */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <MessageCircle size={15} className="text-blue-500" />
              Messages
            </div>
            {unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="px-4 py-3 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-[460px]">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-7 h-7 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <MessageCircle size={40} className="text-gray-200 mb-3" />
                <p className="text-sm text-gray-400">
                  {searchQuery ? 'No conversations found' : 'No messages yet. Start by messaging someone!'}
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedUser({ id: conv.other_user_id, name: conv.other_user_name })}
                  className={`flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 cursor-pointer transition-colors hover:bg-blue-50/50 ${conv.unread_count > 0 ? 'bg-blue-50' : ''}`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-white text-base">
                      {conv.other_user_name.charAt(0).toUpperCase()}
                    </div>
                    {conv.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                        {conv.unread_count > 9 ? '9+' : conv.unread_count}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm text-gray-800 mb-0.5 ${conv.unread_count > 0 ? 'font-semibold' : 'font-medium'}`}>
                      {conv.other_user_name}
                    </p>
                    <p className={`text-xs truncate ${conv.unread_count > 0 ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                      {conv.last_message || 'No messages yet'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-gray-400 text-[11px] flex-shrink-0">
                    <Clock size={11} />
                    {formatTime(conv.last_message_time)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT — Post Insights */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <TrendingUp size={15} className="text-blue-500" />
              Post Insights
            </div>
            <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors">
              View all <ArrowRight size={12} />
            </button>
          </div>

          <div className="p-4 space-y-3">
            {mockInsights.map((post, i) => (
              <div
                key={post.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 hover:translate-x-1 transition-all cursor-pointer"
              >
                <span className="text-3xl font-bold text-gray-200 w-8 text-center flex-shrink-0">
                  0{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 mb-2 truncate">{post.title}</p>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-xs text-gray-400"><Eye size={12} />{post.views} views</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400"><Heart size={12} />{post.likes}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400"><Share2 size={12} />{post.shares}</span>
                  </div>
                </div>
                <span className="bg-green-50 text-green-600 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
                  {post.trend}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-4">
            <SellerProposalsPanel token={token} onOrderCreated={() => {/* optionally refresh orders */}} />
            <OrdersPanel token={token} currentUserId={currentUserId} />
          </div>
        </div>
      </div>

      {/* Bottom Row — Connection Suggestions */}
     

        
      </div>

  
  );
}