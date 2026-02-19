"use client";

import React from "react";
import Link from "next/link";

export default function ServiceCard({ service }: { service: any }) {
  const isFree = service.post_type === "free";
  return (
    <Link href={`/post/${service.id}`}>
      <div className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">

        {/* Service Image */}
        <div className="h-48 bg-white border-b">
          {service.image ? (
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Service Content */}
        <div className="p-4">
          {/* Seller Info */}
          <Link href={`/profile/${service.seller}`}>
            <div className="flex items-center gap-2 mb-2 group/seller">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm group-hover/seller:bg-blue-600 transition-colors">
                {service.seller?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-600 group-hover/seller:text-blue-600 transition-colors font-medium">
                {service.seller}
              </span>
            </div>
          </Link>

          {/* Title */}
          <h3 className="text-lg font-semibold mb-3 line-clamp-2">
            {service.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-yellow-500">★</span>
            <span className="font-semibold">{service.rating}</span>
            <span className="text-gray-500 text-sm">({service.reviews})</span>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between pt-3 border-t">
            <span className="text-gray-600 text-sm">
              {isFree ? "Offer Type" : "Starting at"}
            </span>
            {isFree ? (
              <span className="text-xl font-extrabold text-green-600 bg-green-50 px-3 py-1 rounded-md border border-green-200 uppercase tracking-wider">
                Free
              </span>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                रु {service.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
