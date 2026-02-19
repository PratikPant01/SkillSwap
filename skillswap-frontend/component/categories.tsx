"use client";

import { Code, Palette, Video, Music, Edit } from 'lucide-react';
import Link from 'next/link';

// Map your display names to the category IDs used in the Browse page
const categories = [
  { id: 'all', name: 'All', icon: Code, color: 'bg-purple-100 text-purple-600' },
  { id: 'design', name: 'Design', icon: Palette, color: 'bg-pink-100 text-pink-600' },
  { id: 'development', name: 'Development', icon: Code, color: 'bg-purple-200 text-purple-700' },
  { id: 'video', name: 'Video', icon: Video, color: 'bg-orange-100 text-orange-600' },
  { id: 'writing', name: 'Writing', icon: Edit, color: 'bg-blue-100 text-blue-600' },
  { id: 'audio', name: 'Audio', icon: Music, color: 'bg-yellow-100 text-yellow-600' },
];

export default function Categories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-center mb-12">
          Browse by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={`/browse?category=${category.id}`}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow group flex flex-col items-center cursor-pointer"
              >
                <div className={`${category.color} size-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="size-6" />
                </div>
                <h3 className="text-lg text-center">{category.name}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
