"use client";

import { Clock, RefreshCw, MapPin, Coins } from "lucide-react";
import MessageChatBox from "@/component/messagechatbox";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProposalModal from "@/component/proposalmodal";

export default function PostPage() {
  const params = useParams();
  const postId = params?.id;

  const [singleService, setSingleService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatUser, setChatUser] = useState<{ id: number; name: string } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string>('');
  const [showProposalModal, setShowProposalModal] = useState(false);

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
        const res = await fetch(`https://skillswapservice.up.railway.app/posts/${postId}`);
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
        const res = await fetch(`https://skillswapservice.up.railway.app/comments/${postId}`, {
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
      const res = await fetch(`https://skillswapservice.up.railway.app/comments/${postId}`, {
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
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white pt-20 md:pt-28 pb-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">{singleService.title}</h1>

          {/* USER INFO & RATING - Wrapped for mobile */}
          <div className="flex flex-wrap items-center gap-3 md:gap-5 mb-6 text-blue-200">
            <Link href={`/profile/${singleService.username}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg md:text-xl overflow-hidden">
                {singleService.profile_picture_url ? (
                  <img src={singleService.profile_picture_url} alt={singleService.username} className="w-full h-full object-cover" />
                ) : (
                  userInitial
                )}
              </div>
              <span className="text-lg md:text-xl text-white font-bold">{singleService.username}</span>
            </Link>
            <div className="hidden sm:block text-white opacity-70">|</div>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl text-yellow-500 font-bold">★</span>
              <span className="text-xl md:text-2xl font-bold text-white">
                {(commentStats?.average_rating ?? 0).toFixed(1)}
              </span>
              <span className="text-sm md:text-xl">({commentStats?.total_comments ?? 0} reviews)</span>
            </div>
          </div>

          {/* SERVICE DETAILS - Grid for mobile, Flex for desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:flex md:items-center md:gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-300" />
              <span className="text-sm">Delivery In {singleService.delivery_time || "2-3 Days"}</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-300" />
              <span className="text-sm">Up To {singleService.revisions || 5} Revisions</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-300" />
              <span className="text-sm">{singleService.location || "Kathmandu, Nepal"}</span>
            </div>
          </div>

          {/* HERO PRICE BOX - Made responsive width */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 w-full mt-10 border border-white/20">
            <div className="text-center mb-4">
              <p className="text-blue-100 text-sm">{isFree ? "Offer Type" : "Service Price"}</p>
              {isFree ? (
                <p className="text-green-400 font-black text-4xl drop-shadow-sm tracking-tight">FREE</p>
              ) : (
                <p className="text-white font-bold text-3xl"><Coins className="inline mr-1 text-yellow-500" size={20} /> {singleService.price}</p>
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
          {/* IMAGES - Improved Horizontal Scroll */}
          {singleService.images && singleService.images.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex gap-4">
                  {singleService.images.map((img: string, index: number) => (
                    <img
                      key={index}
                      src={`https://skillswapservice.up.railway.app/${img}`}
                      alt={`Image ${index + 1}`}
                      className="h-60 w-80 md:h-[400px] md:w-[600px] flex-shrink-0 rounded-lg object-cover shadow-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About This Service</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{singleService.description}</p>

            {/* COMMENT SECTION */}
            <div className="bg-gray-50 rounded-xl p-4 md:p-6 mt-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Comments ({commentStats?.total_comments ?? 0})
              </h2>

              {/* Add Comment */}
              {currentUserId && (
                <div className="mb-6">
                  <textarea
                    value={commentInput}
                    onChange={e => setCommentInput(e.target.value)}
                    placeholder="Write your comment..."
                    className="w-full border border-gray-300 rounded-lg p-3 mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(n => (
                          <button
                            key={n}
                            onClick={() => setRatingInput(n)}
                            className={`text-2xl transition ${n <= ratingInput ? "text-yellow-500" : "text-gray-300"}`}
                          >★</button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={submitComment}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}

              {/* Existing Comments */}
              <ul className="space-y-4">
                {comments.map(c => (
                  <li key={c.id} className="border-b border-gray-200 last:border-0 pb-4">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-900">{c.username}</p>
                      <span className="text-yellow-500 font-bold">{c.rating} ★</span>
                    </div>
                    <p className="text-gray-700 mb-2">{c.content}</p>
                    <p className="text-gray-400 text-xs">{new Date(c.created_at).toLocaleString()}</p>
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

        {/* RIGHT SIDEBAR - Moves below content on mobile */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6  lg:top-24 border border-gray-100">
            <p className="text-gray-500 text-sm mb-1">{isFree ? "Status" : "Service Price"}</p>
            {isFree ? (
              <p className="text-3xl font-black text-green-600 mb-4">FREE</p>
            ) : (
              <p className="text-3xl font-bold text-gray-900 mb-4">Rs {singleService.price}</p>
            )}

            <div className="space-y-3">

              <button 
                onClick={() => setShowProposalModal(true)}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition shadow-md active:scale-[0.98]">
                {isFree ? "Claim Service" : "Order Now"}
              </button>
              <button
                onClick={() => setChatUser(sellerUser)}
                className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
              >
                Contact Seller
              </button>
            </div>
          </div>

          {/* SELLER INFO */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Seller Info</h3>
            <Link href={`/profile/${singleService.username}`} className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:bg-blue-600 transition-colors overflow-hidden">
                {singleService.profile_picture_url ? (
                  <img src={singleService.profile_picture_url} alt={singleService.username} className="w-full h-full object-cover" />
                ) : (
                  userInitial
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{singleService.username}</p>
                <p className="text-gray-500 text-sm">Member since {new Date(singleService.created_at).toLocaleDateString()}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* MESSAGE CHAT BOX */}
      {currentUserId && token && chatUser && (
        <div className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] sm:w-auto">
          <MessageChatBox
            user={chatUser}
            onClose={() => setChatUser(null)}
            currentUserId={currentUserId}
            token={token}
          />
        </div>
      )}

      {/* PROPOSAL MODAL */}
      {showProposalModal && currentUserId && token && singleService && (
        <ProposalModal
          postId={singleService.id}
          postTitle={singleService.title}
          postType={singleService.post_type}
          token={token}
          currentUserId={currentUserId}
          onClose={() => setShowProposalModal(false)}
          onSuccess={() => {
            setShowProposalModal(false);
          }}
        />
      )}
    </div>
  );
}