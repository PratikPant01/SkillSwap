import React from 'react'

import { Search,  MessageCircle, Star } from 'lucide-react';

export default function HowItWorks() {
  return (
   <div className="bg-white py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How SkillSwap Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Browse & Discover</h3>
              <p className="text-gray-600">Find talented students offering the skills you need</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Connect & Order</h3>
              <p className="text-gray-600">Chat with providers and place your order securely</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Review & Build</h3>
              <p className="text-gray-600">Get your project delivered and leave a review</p>
            </div>
          </div>
        </div>
      </div>
  )
}

