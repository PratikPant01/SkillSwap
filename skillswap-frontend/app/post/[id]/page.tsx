"use client";

import {Clock,RefreshCw,MapPin} from "lucide-react";
import MessageChatBox from "@/component/messagechatbox";
import { useState } from "react";
export default function PostPage() {

    const [chatUser, setChatUser]=useState<
    {
        id: number;
        name: string;
    } | null    
    >(null);



    const singleService = 
    {
        id: 1,
        title: "I will design a modern and professional website UI",
        seller: "designpro",
        rating: 4.9,
        reviews: 234,
        price: 150,
        image: "web design",
        category: "Design",
        orders: 120 // This is not fixed hai browse page ma halya xaina yo data
    }

    const sellerUser={
        id: singleService.id,
        name:singleService.seller
    }


  return (
    <div className="min-h-screen bg-gray-200">
            {/* BLUE HERO */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white pt-28 pb-10">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-sm text-blue-200 flex items-center gap-2 mb-4">
                        <span className="cursor-pointer hover:text-white">Home</span>
                        <span>/</span>
                        <span className="cursor-pointer hover:text-white">Browse</span>
                        <span>/</span>
                        <span className="cursor-pointer text-white">Post Details</span>
                    </div>    
                    <h1 className="text-4xl font-bold mb-4">
                        {singleService.title}
                    </h1>
                    <div className="flex items-center gap-5 mb-6 text-blue-200">
                        <div className="flex items-center gap-2 ">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-1xl">
                            {singleService.seller.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-1xl text-white font-bold">{singleService.seller}</span>
                        </div>
                            <div className="text-white opacity-70">|</div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl text-yellow-500 font-bold">★</span>
                            <span className="text-2xl font-bold text-white">{singleService.rating} </span>
                            <span className="text-1xl">({singleService.reviews} reviews)</span>
                        </div>
                            <div className="text-white opacity-70">|</div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl text-white font-bold">{singleService.orders}</span>
                            <span className="text-1xl"> orders completed</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-white-100">
                        <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5"/>
                                <span className="text-sm">Delivery In 2-3 Days</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <RefreshCw className="w-5 h-5"/>
                            <span className="text-sm">Up To 5 Revisions</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5"/>
                            <span className="text-sm">Kathmandu, Nepal</span>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 w-full mt-10">
                        <div className="text-center mb-4">
                            <p className="text-blue-100 text-sm">Service Price</p>
                            <p className="text-white font-bold  text-3xl">Rs 150</p>
                        </div>
                        <button className="w-full bg-white text-1xl text-blue-600 font-bold py-3 rounded-lg transition duration-300 cursor-pointer">Order Now</button>
                        <button 
                        onClick={()=> setChatUser(sellerUser)}
                        className="w-full mt-3 bg-transparent border border-white hover:bg-white hover:text-blue-600 text-1xl text-white font-bold py-3 rounded-lg transition duration-300 cursor-pointer">Contact Seller</button>
                    </div>
                    
                </div>
            </div>
            {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT CONTENT */}
            <div className="lg:col-span-2 space-y-6">

                {/* IMAGE PREVIEW */}
                <div className="bg-white rounded-xl shadow-sm p-4">

                {/* HORIZONTAL SCROLL PLACEHOLDER */}
                <div className="overflow-x-auto">
                    <div className="flex gap-4">

                    {/* Placeholder Images */}
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                        key={index}
                        className="h-[400px] w-[600px] flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-medium text-lg"
                        >
                        Image {index + 1} Placeholder
                        </div>
                    ))}

                    </div>
                </div>

                </div>


                {/* DESCRIPTION */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        About This Service
                    </h2>

                    <p className="text-gray-700 leading-relaxed">
                        I will design a modern, clean, and professional website UI tailored to your brand.
                        Includes responsive layouts, modern components, and user-focused design principles.
                    </p>
                </div>

                {/* TAGS */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Skills & Tags
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {["UI Design","React","Figma"].map(tag => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6">

                {/* ORDER CARD */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-gray-500 text-sm mb-1">Service Price</p>
                    <p className="text-3xl font-bold text-gray-900 mb-4">
                        Rs {singleService.price}
                    </p>

                    <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">
                        Order Now
                    </button>

                    <button
                    onClick={()=> setChatUser(sellerUser)}
                    className="w-full mt-3 border border-gray-300 font-semibold py-3 rounded-lg hover:bg-gray-50 transition">
                        Contact Seller
                    </button>
                </div>

                {/* SELLER INFO */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-3">Seller Info</h3>

                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {singleService.seller.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <p className="font-semibold">{singleService.seller}</p>
                            <p className="text-sm text-gray-500">Level 2 Seller</p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
<MessageChatBox
  user={chatUser}
  onClose={() => setChatUser(null)}
/>

        </div>
  );
}