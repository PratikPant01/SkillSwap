"use client";

import { Clock, RefreshCw, MapPin } from "lucide-react";
import MessageChatBox from "@/component/messagechatbox";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function PostPage() {
  const params = useParams();
  const postId = params?.id;

  const [singleService, setSingleService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatUser, setChatUser] = useState<{ id: number; name: string } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string>('');

      // Inside PostPage component
  const [comments, setComments] = useState<any[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [ratingInput, setRatingInput] = useState(5);
  const [commentStats, setCommentStats] = useState({ average_rating: 0, total_comments: 0 });

  // Load user authentication data from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      const user = JSON.parse(storedUser);
      setCurrentUserId(user.id);
      console.log('Auth loaded - User ID:', user.id, 'Token exists:', !!storedToken);
    } else {
      console.warn('No authentication found - user needs to login');
    }
  }, []);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/posts/${postId}`);
        const data = await res.json();
        setSingleService(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  
  useEffect(() => {
  if (!postId) return;

  const fetchComments = async () => {
  if (!postId) return;

  try {
    const res = await fetch(`http://localhost:5000/comments/${postId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    // Check if response is JSON first
    const contentType = res.headers.get("content-type");
    let data: any;
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      console.warn("Non-JSON response:", text);
      return;
    }

    if (data.success) {
      setComments(data.comments);
      setCommentStats(data.commentStats);
    }
  } catch (err) {
    console.error("Fetch comments error:", err);
  }
};


  fetchComments();
}, [postId, token]);



  // Submit comment
  const submitComment = async () => {
    if (!commentInput || ratingInput < 1) return;
    try {
      const res = await fetch(`http://localhost:5000/comments/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ comment: commentInput, rating: ratingInput }),
      });
      const data = await res.json();
      if (data.success) {
        setCommentInput("");
        setRatingInput(5);
        setComments(prev => [data.comment, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Show loading state
  if (loading) {
    return <p className="text-center mt-20">Loading post...</p>;
  }

  // Show not found state
  if (!singleService) {
    return <p className="text-center mt-20">Post not found!</p>;
  }

  const sellerUser = {
    id: singleService.user_id,
    name: singleService.username || 'Unknown User',
  };
  const isFree = singleService.post_type === "free";
  const userInitial = singleService.username?.charAt(0).toUpperCase() || 'U';

  

  return (
    <div className="min-h-screen bg-gray-200">
      {/* BLUE HERO */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white pt-28 pb-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-4">{singleService.title}</h1>
          
          <div className="flex items-center gap-5 mb-6 text-blue-200">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                {userInitial}
              </div>
              <span className="text-xl text-white font-bold">{singleService.username}</span>
            </div>
            <div className="text-white opacity-70">|</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl text-yellow-500 font-bold">★</span>
              <span className="text-2xl font-bold text-white">67</span>
              <span className="text-xl">({singleService.reviews || 0} reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-white-100">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm">Delivery In {singleService.delivery_time || "2-3 Days"}</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              <span className="text-sm">Up To {singleService.revisions || 5} Revisions</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span className="text-sm">{singleService.location || "Kathmandu, Nepal"}</span>
            </div>
          </div>

          {/* HERO PRICE BOX */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 w-full mt-10 border border-white/20">
            <div className="text-center mb-4">
              <p className="text-blue-100 text-sm">{isFree ? "Offer Type" : "Service Price"}</p>
              {isFree ? (
                <p className="text-green-400 font-black text-4xl drop-shadow-sm tracking-tight">FREE</p>
              ) : (
                <p className="text-white font-bold text-3xl">Rs {singleService.price}</p>
              )}
            </div>
            <button
              onClick={() => setChatUser(sellerUser)}
              className="w-full mt-3 bg-transparent border border-white hover:bg-white hover:text-blue-600 text-xl text-white font-bold py-3 rounded-lg transition duration-300 cursor-pointer"
            >
              Contact Seller
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* IMAGES */}
          {singleService.images && singleService.images.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="overflow-x-auto">
                <div className="flex gap-4">
                  {singleService.images.map((img: string, index: number) => (
                    <img
                      key={index}
                      src={`http://localhost:5000/${img}`}
                      alt={`Image ${index + 1}`}
                      className="h-[400px] w-[600px] flex-shrink-0 rounded-lg object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About This Service</h2>
            <p className="text-gray-700 leading-relaxed">{singleService.description}</p>

            {/* COMMENT SECTION */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Comments ({commentStats?.total_comments ?? 0}) - Avg: {(commentStats?.average_rating ?? 0).toFixed(1)}★
              </h2>

              {/* Add Comment */}
              {currentUserId && (
                <div className="mb-4">
                  <textarea
                    value={commentInput}
                    onChange={e => setCommentInput(e.target.value)}
                    placeholder="Write your comment..."
                    className="w-full border border-gray-300 rounded-lg p-3 mb-2"
                  />
                  <div className="flex items-center gap-2 mb-2">
                    <span>Rating:</span>
                    {[1,2,3,4,5].map(n => (
                      <button
                        key={n}
                        onClick={() => setRatingInput(n)}
                        className={`text-xl ${n <= ratingInput ? "text-yellow-500" : "text-gray-300"}`}
                      >★</button>
                    ))}
                  </div>
                  <button
                    onClick={submitComment}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Submit
                  </button>
                </div>
              )}

              {/* Existing Comments */}
              <ul className="space-y-4">
                {comments.map(c => (
                  <li key={c.id} className="border-b border-gray-200 pb-2">
                    <p className="font-semibold">{c.username} - {c.rating}★</p>
                    <p>{c.content}</p>
                    <p className="text-gray-400 text-sm">{new Date(c.created_at).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            </div>


          </div>

          {/* TAGS */}
          {singleService.tags && singleService.tags.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Skills & Tags</h2>
              <div className="flex flex-wrap gap-2">
                {singleService.tags.map((tag: string, index: number) => (
                  <span
                    key={`${tag}-${index}`}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <p className="text-gray-500 text-sm mb-1">{isFree ? "Status" : "Service Price"}</p>
            {isFree ? (
              <p className="text-3xl font-black text-green-600 mb-4">FREE</p>
            ) : (
              <p className="text-3xl font-bold text-gray-900 mb-4">Rs {singleService.price}</p>
            )}
            
            <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">
              {isFree ? "Claim Service" : "Order Now"}
            </button>
            <button
              onClick={() => setChatUser(sellerUser)}
              className="w-full mt-3 border border-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Contact Seller
            </button>
          </div>

          {/* SELLER INFO */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-3">Seller Info</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {userInitial}
              </div>
              <div>
                <p className="font-semibold">{singleService.username}</p>
                <p className="text-sm text-gray-500">Level 2 Seller</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MESSAGE CHAT BOX */}
      {currentUserId && token && chatUser && (
        <MessageChatBox
          user={chatUser}
          onClose={() => setChatUser(null)}
          currentUserId={currentUserId}
          token={token}
        />
      )}
    </div>
  );
}