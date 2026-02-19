'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
// Make sure this path points to where your ServiceCard is actually located!
import ServiceCard from "./serviceCard";

export default function FeaturedService() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularServices = async () => {
      try {
        const res = await fetch("http://localhost:5000/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");
        
        const data = await res.json();

        // Sort by highest rating first, then by most comments to determine "Popularity"
        const popularServices = data
          .sort((a: any, b: any) => {
            if (b.average_rating !== a.average_rating) {
              return b.average_rating - a.average_rating;
            }
            return b.total_comments - a.total_comments;
          })
          .slice(0, 6); // Grab only the top 6 posts

        setServices(popularServices);
      } catch (error) {
        console.error("Error fetching popular services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularServices();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* HEADER SECTION */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Popular Services</h2>

          {/* Temporary remove this later hai */}
          <Link href="/post/create">
            <PlusCircle className="w-12 h-12 text-blue-600 hover:text-blue-800 cursor-pointer" />
          </Link>
          
          <Link href="/browse">
            <button className="text-blue-600 border border-blue-600 rounded px-4 py-2 hover:bg-blue-600 hover:text-white transition-colors">
              See All
            </button>
          </Link>
        </div>

        {/* SERVICES GRID */}
        {/* Using the original lg:grid-cols-3 from your landing page layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Loading State */}
          {loading && (
            <div className="col-span-full text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Finding popular services...</p>
            </div>
          )}

          {/* Empty State (If DB is completely empty) */}
          {!loading && services.length === 0 && (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-lg">No services available right now.</p>
              <Link href="/post/create">
                <button className="text-blue-600 font-medium mt-2 hover:underline">
                  Be the first to create one!
                </button>
              </Link>
            </div>
          )}

          {/* Render ServiceCards */}
          {!loading && services.map((service) => (
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
                image: service.images?.[0] ? `http://localhost:5000/${service.images[0]}` : null
              }}
            />
          ))}
          
        </div>
      </div>
    </section>
  );
}