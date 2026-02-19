"use client";

import { useState, useEffect } from 'react';
import { MessageCircle, Search, Clock, Eye, Heart, Share2, TrendingUp, ArrowRight } from 'lucide-react';
import MessageChatBox from '@/component/messagechatbox';
import SellerProposalsPanel from "@/component/SellerProposalsPanel";
import OrdersPanel from "@/component/OrdersPanel";
import ServiceCard from '@/component/serviceCard';

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

export default function DashboardPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // --- NEW: user posts state ---
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      const user = JSON.parse(storedUser);
      setCurrentUserId(user.id);
    }
  }, []);

  // Conversations fetch (unchanged)
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    const fetchConversations = async () => {
      try {
        const res = await fetch('https://skillswapservice.up.railway.app/conversations', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setConversations(data.conversations || []);
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

  // --- NEW: fetch user's posts from /posts/mine
  useEffect(() => {
    if (!token) { setLoadingPosts(false); return; }

    const fetchUserPosts = async () => {
      setLoadingPosts(true);
      setPostsError(null);
      try {
        const res = await fetch('https://skillswapservice.up.railway.app/posts/mine', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status} - ${text}`);
        }
        const data = await res.json();
        // data should be an array of posts
        setUserPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching user posts:', err);
        setPostsError('Failed to load your posts');
        setUserPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchUserPosts();
    // optionally you could poll / refresh on certain actions; not polling here
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

      {/* Top Row: Messages + Your Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5 items-start">

        {/* LEFT — Messages (unchanged) */}
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

        {/* RIGHT — Your Posts (replaced Post Insights) */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <TrendingUp size={15} className="text-blue-500" />
              Your Posts
            </div>
            <button
              onClick={() => {
                // optional: navigate to a full manage posts page if exists
                // e.g. router.push('/dashboard/posts') - keep no-op if not implemented
              }}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors"
            >
              Manage <ArrowRight size={12} />
            </button>
          </div>

          <div className="p-4">
            {loadingPosts ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-7 h-7 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : postsError ? (
              <div className="text-center py-10">
                <p className="text-sm text-red-500">{postsError}</p>
              </div>
            ) : userPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <TrendingUp size={40} className="text-gray-200 mb-3" />
                <p className="text-sm text-gray-400">You haven't created any posts yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-h-[420px] overflow-y-auto pr-2">
                {userPosts.map((post) => (
                  <ServiceCard
                    key={post.id}
                    service={{
                      id: post.id,
                      title: post.title,
                      seller: post.username,
                      post_type: post.post_type,
                      rating: post.average_rating,
                      reviews: post.total_comments,
                      price: post.price,
                      image: post.images?.[0] ? `https://skillswapservice.up.railway.app/${post.images[0]}` : null,
                      seller_profile_picture: post.profile_picture_url
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-4 px-4 pb-4">
            <SellerProposalsPanel token={token} onOrderCreated={() => {/* optionally refresh orders */}} />
            <OrdersPanel token={token} currentUserId={currentUserId} />
          </div>
        </div>
      </div>

      {/* Bottom Row — Connection Suggestions */}
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
