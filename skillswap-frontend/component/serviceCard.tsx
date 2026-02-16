"use client";

import React from "react";
import Link from "next/link";

export default function ServiceCard({ service }: { service: any }) {
  return (
    <Link href={`/post/${service.id}`}>
    <div className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      {/* Service Image */}
      <div className="h-48 bg-white border-b">
        {/* Optional: <img src={service.image} alt={service.title} /> */}
      </div>

      {/* Service Content */}
      <div className="p-4">
        {/* Seller Info */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
            {service.seller.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-600">{service.seller}</span>
        </div>

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

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-gray-600 text-sm">Starting at</span>
          <span className="text-xl font-bold"> रु {service.price}</span>
        </div>
      </div>
    </div>
    </Link>
  );
}
