"use client";
import Link from 'next/link';
import ServiceCard from "../../component/serviceCard";
import { Search, Funnel} from "lucide-react";
import { useEffect, useState } from "react";

export default function BrowseServicesPage(){
    type Service = {
    id: number;
    title: string;
    username: string; // seller in frontend
    price: number | null;
    images: string[];
    post_type: 'free' | 'paid';
  };

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/posts");
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        // Make sure data is an array
        if (Array.isArray(data)) {
          setServices(data);
        } else {
          console.error('Expected array but got:', typeof data, data);
          setServices([]);
          setError('Invalid data format received');
        }
      } catch (err) {
        console.error('Fetch error:', err);
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
    const price = [
    { id: 'All', label: 'All' },
    { id: 'free', label: 'Free' },
    { id: 'low', label: 'Under रु 100' },
    { id: 'mid', label: 'Between रु 100 and रु 500' },
    { id: 'high', label: 'Higher than रु 500' },
    ];


     return (
           <div className="min-h-screen flex flex-col">
            {/* BLUE HERO */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white pt-36 pb-20">
              <h3 className="text-3xl md:text-4xl font-bold text-center">
                Browse All Skills Available
              </h3>
            </div>

            <div className="bg-gray-100 flex-1">
              {/* Search Bar */}
              <div className="py-10">
                <div className="max-w-5xl mx-auto px-4">
                  <div className="flex items-center gap-4">
                    {/* Input */}
                    <div className="flex items-center gap-3 flex-1 bg-white border rounded-xl px-4 h-16 shadow-sm">
                      <Search className="text-gray-400" size={22} />
                      <input
                        type="text"
                        placeholder="Search For Services..."
                        className="flex-1 text-lg outline-none text-gray-700 placeholder-gray-400"
                      />
                    </div>
                    
                    {/* Button */}
                    
                    <button className="h-16 bg-blue-600 text-white px-10 rounded-xl hover:bg-blue-700 transition font-medium shadow-md flex items-center gap-2">
                      <Funnel className="opacity-90" size={22} />
                      Filter
                    </button>
        
                  </div>
                </div>
              </div>

              {/* GRID SECTION */}
              <div className="pb-16">
                <div className="max-w-8xl mx-auto px-4">
                  <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-6">

                    {/* LEFT: Filter SideBar */}
                    <aside className="bg-white rounded-xl p-4 h-fit sticky top-24 shadow-sm flex flex-col gap-8">
                      <div className='flex items-center justify-between'>
                          <p className='text-xl font-bold'>Filters</p>
                          <p className='text-sm text-blue-600 hover:underline cursor-pointer'>Clear</p>
                      </div>

                      <div className='flex flex-col gap-5'>
                        <p className='text-lg text-gray-800'>Category</p>
                          {/*Radio Using array map */}
                          {categories.map((cat)=>(
                            <div key={cat.id} className='flex gap-x-2'>
                              <input type='radio' id={cat.id} name='category-group' className="h-4 w-4 cursor-pointer text-blue-600 focus:ring-blue-500"/>
                              <label htmlFor={cat.id} className="text-sm text-gray-800 cursor-pointer select-none">{cat.label}</label>
                            </div>
                          ))}
                      </div>

                      <div className='flex flex-col gap-5'>
                        <p className='text-lg text-gray-800'>Price</p>
                          {/*Radio Using array map */}
                          {price.map((pr)=>(
                            <div key={pr.id} className='flex gap-x-2'>
                              <input type='radio' id={pr.id} name='price-group' className="h-4 w-4 cursor-pointer text-blue-600 focus:ring-blue-500"/>
                              <label htmlFor={pr.id} className="text-sm text-gray-800 cursor-pointer select-none">{pr.label}</label>
                            </div>
                          ))}
                        </div>
                    </aside>

                    {/* Right Container */}
                    <section className="space-y-6">

                      {/* FILTER HEADER */}
                      <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                        <p className="text-gray-700">
                          <span className="font-semibold">{services.length}</span> services available
                        </p>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Sort by:</span>
                          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-600">
                            <option>Recommended</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Rating</option>
                            <option>Most Reviews</option>
                          </select>
                        </div>
                      </div>

                      {/* POSTS GRID */}
                      <div className="grid grid-cols-2 gap-6">
                        {/* Loading State */}
                        {loading && (
                          <div className="col-span-2 text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600">Loading services...</p>
                          </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                          <div className="col-span-2 text-center py-20">
                            <p className="text-red-600 mb-2">{error}</p>
                            <button 
                              onClick={() => window.location.reload()} 
                              className="text-blue-600 hover:underline"
                            >
                              Try again
                            </button>
                          </div>
                        )}

                        {/* Empty State */}
                        {!loading && !error && services.length === 0 && (
                          <div className="col-span-2 text-center py-20">
                            <p className="text-gray-600 text-lg">No services available yet.</p>
                          </div>
                        )}

                        {/* Post cards */}
                        {!loading && !error && services.length > 0 && services.map((service)=>(
                          <ServiceCard
                            key={service.id}
                            service={{
                              id: service.id,
                              title: service.title,
                              seller: service.username,
                              post_type: service.post_type,
                              rating: 5.0, // temporary
                              reviews: 0,  // temporary
                              price: service.price,
                              image: service.images?.[0]
                                ? `http://localhost:5000/${service.images[0]}`
                                : null
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

     )
}