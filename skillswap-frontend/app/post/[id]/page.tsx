import {Clock,RefreshCw,MapPin} from "lucide-react";
export default function PostPage() {

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
                        <button className="w-full mt-3 bg-transparent border border-white hover:bg-white hover:text-blue-600 text-1xl text-white font-bold py-3 rounded-lg transition duration-300 cursor-pointer">Contact Seller</button>
                    </div>
                    
                </div>
            </div>
            {/* Main Image Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                
            </div>
        </div>
  );
}