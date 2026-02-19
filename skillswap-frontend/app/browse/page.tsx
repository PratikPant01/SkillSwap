"use client";
import Link from 'next/link';
import ServiceCard from "../../component/serviceCard";
import { Search, Funnel } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export default function BrowseServicesPage() {
  type Service = {
    id: number;
    title: string;
    username: string;
    price: number | null;
    images: string[];
    post_type: 'free' | 'paid';
    category: string;
    average_rating: number;
    total_comments: number;
    profile_picture_url: string | null;
  };

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- FILTER STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [sortBy, setSortBy] = useState("Recommended");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/posts");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setServices(data);
        } else {
          setServices([]);
          setError('Invalid data format received');
        }
      } catch (err) {
        setError('Failed to load services');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'design', label: 'Design' },
    { id: 'development', label: 'Development' },
    { id: 'video', label: 'Video' },
    { id: 'writing', label: 'Writing' },
    { id: 'audio', label: 'Audio' },
  ];

  const priceOptions = [
    { id: 'All', label: 'All' },
    { id: 'free', label: 'Free' },
    { id: 'low', label: 'Under रु 100' },
    { id: 'mid', label: 'रु 100 - रु 500' },
    { id: 'high', label: 'Above रु 500' },
  ];

  // --- FILTERING LOGIC ---
  const filteredServices = useMemo(() => {
    let result = [...services];

    // 1. Search Query
    if (searchQuery) {
      result = result.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Category
    if (selectedCategory !== "all") {
      result = result.filter(s => s.category?.toLowerCase() === selectedCategory);
    }

    // 3. Price/Post Type
    if (selectedPrice !== "All") {
      if (selectedPrice === "free") {
        result = result.filter(s => s.post_type === 'free');
      } else if (selectedPrice === "low") {
        result = result.filter(s => s.post_type === 'paid' && (s.price ?? 0) < 100);
      } else if (selectedPrice === "mid") {
        result = result.filter(s => s.post_type === 'paid' && (s.price ?? 0) >= 100 && (s.price ?? 0) <= 500);
      } else if (selectedPrice === "high") {
        result = result.filter(s => s.post_type === 'paid' && (s.price ?? 0) > 500);
      }
    }

    // 4. Sorting
    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else if (sortBy === "Rating") {
      result.sort((a, b) => b.average_rating - a.average_rating);
    } else if (sortBy === "Most Reviews") {
      result.sort((a, b) => b.total_comments - a.total_comments);
    }

    return result;
  }, [services, searchQuery, selectedCategory, selectedPrice, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedPrice("All");
    setSearchQuery("");
    setSortBy("Recommended");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* BLUE HERO */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white pt-24 pb-12 md:pt-36 md:pb-20 px-4">
        <h3 className="text-2xl md:text-4xl font-bold text-center">
          Browse All Skills Available
        </h3>
      </div>

      <div className="bg-gray-100 flex-1">
        {/* Search Bar Section */}
        <div className="py-6 md:py-10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              <div className="flex items-center gap-3 flex-1 bg-white border rounded-xl px-4 h-14 md:h-16 shadow-sm">
                <Search className="text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search For Services..."
                  className="flex-1 text-base md:text-lg outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                />
              </div>
              <button className="h-14 md:h-16 bg-blue-600 text-white px-8 rounded-xl hover:bg-blue-700 transition font-medium shadow-md flex items-center justify-center gap-2">
                <Funnel className="opacity-90" size={20} />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* GRID SECTION */}
        <div className="pb-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">

              {/* LEFT: Filter SideBar */}
              <aside className="bg-white rounded-xl p-6 h-fit lg:sticky lg:top-24 shadow-sm flex flex-col gap-8">
                <div className='flex items-center justify-between border-b pb-4 lg:border-none lg:pb-0'>
                  <p className='text-xl font-bold'>Filters</p>
                  <p onClick={clearFilters} className='text-sm text-blue-600 hover:underline cursor-pointer font-medium'>Clear All</p>
                </div>

                {/* Category Filter */}
                <div className='flex flex-col gap-4'>
                  <p className='text-lg font-semibold text-gray-800'>Category</p>
                  <div className='grid grid-cols-2 lg:grid-cols-1 gap-3'>
                    {categories.map((cat) => (
                      <div key={cat.id} className='flex items-center gap-x-2'>
                        <input
                          type='radio'
                          id={cat.id}
                          name='category-group'
                          checked={selectedCategory === cat.id}
                          onChange={() => setSelectedCategory(cat.id)}
                          className="h-4 w-4 cursor-pointer text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={cat.id} className="text-sm text-gray-700 cursor-pointer select-none truncate">{cat.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className='flex flex-col gap-4'>
                  <p className='text-lg font-semibold text-gray-800'>Price Range</p>
                  <div className='grid grid-cols-2 lg:grid-cols-1 gap-3'>
                    {priceOptions.map((pr) => (
                      <div key={pr.id} className='flex items-center gap-x-2'>
                        <input
                          type='radio'
                          id={pr.id}
                          name='price-group'
                          checked={selectedPrice === pr.id}
                          onChange={() => setSelectedPrice(pr.id)}
                          className="h-4 w-4 cursor-pointer text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={pr.id} className="text-sm text-gray-700 cursor-pointer select-none">{pr.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Right Container */}
              <section className="space-y-6">
                <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-gray-600">
                    Showing <span className="font-bold text-gray-900">{filteredServices.length}</span> services
                  </p>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-white"
                    >
                      <option>Recommended</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Rating</option>
                      <option>Most Reviews</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {loading && (
                    <div className="col-span-full text-center py-20">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      <p className="mt-4 text-gray-600">Finding services...</p>
                    </div>
                  )}

                  {!loading && filteredServices.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-white rounded-xl">
                      <p className="text-gray-500 text-lg">No services match your search or filters.</p>
                      <button onClick={clearFilters} className="text-blue-600 font-medium mt-2">View all services</button>
                    </div>
                  )}

                  {!loading && filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={{
                        id: service.id,
                        title: service.title,
                        seller: service.username,
                        post_type: service.post_type,
                        rating: service.average_rating,
                        reviews: service.total_comments,
                        price: service.price,
                        image: service.images?.[0] ? `http://localhost:5000/${service.images[0]}` : null,
                        seller_profile_picture: service.profile_picture_url
                      }}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}