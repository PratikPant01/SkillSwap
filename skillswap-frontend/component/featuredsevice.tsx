import React from "react";
import Link from "next/link";
import { PlusCircle} from "lucide-react";

const services = [
  {
    id: 1,
    title: "I will design a modern and professional website UI",
    seller: "designpro",
    rating: 4.9,
    reviews: 234,
    price: 150,
    image: "web design",
  },
  {
    id: 2,
    title: "I will create a stunning logo for your brand",
    seller: "logomaster",
    rating: 5.0,
    reviews: 567,
    price: 75,
    image: "logo design",
  },
  {
    id: 3,
    title: "I will develop a responsive WordPress website",
    seller: "webwizard",
    rating: 4.8,
    reviews: 189,
    price: 200,
    image: "wordpress website",
  },
  {
    id: 4,
    title: "I will edit and enhance your videos professionally",
    seller: "videoedit",
    rating: 4.9,
    reviews: 421,
    price: 120,
    image: "video editing",
  },
  {
    id: 5,
    title: "I will write SEO optimized content for your website",
    seller: "contentking",
    rating: 5.0,
    reviews: 312,
    price: 90,
    image: "content writing",
  },
];

export default function FeaturedService() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Popular Services</h2>

          <Link href="/post/create"><PlusCircle className="w-12 h-12 text-blue-600 hover:text-blue-800 cursor-pointer" /></Link>{/* Temporary remove this later hai */}
          <Link href="/browse">
            <button className="text-blue-600 border border-blue-600 rounded px-4 py-2 hover:bg-blue-600 hover:text-white transition-colors">
              See All
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              {/* Service Image */}
              <div className="h-48 bg-white border-b"></div>

              {/* Service Content */}
              <div className="p-4">
                {/* Seller Info */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                    {service.seller.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-600">
                    {service.seller}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-3 line-clamp-2">
                  {service.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold">{service.rating}</span>
                  <span className="text-gray-500 text-sm">
                    ({service.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-gray-600 text-sm">Starting at</span>
                  <span className="text-xl font-bold"> रु {service.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
