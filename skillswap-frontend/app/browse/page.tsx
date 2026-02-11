import Link from 'next/link';
import ServiceCard from "../../component/serviceCard";
import { Search, Funnel} from "lucide-react";



const allServices = [
  {
    id: 1,
    title: "I will design a modern and professional website UI",
    seller: "designpro",
    rating: 4.9,
    reviews: 234,
    price: 150,
    image: "web design",
    category: "Design"
  },
  {
    id: 2,
    title: "I will create a stunning logo for your brand",
    seller: "logomaster",
    rating: 5.0,
    reviews: 567,
    price: 75,
    image: "logo design",
    category: "Design"
  },
  {
    id: 3,
    title: 'I will develop a responsive WordPress website',
    seller: 'webwizard',
    rating: 4.8,
    reviews: 189,
    price: 200,
    image: 'wordpress website',
    category: 'Development'
  },
  {
    id: 4,
    title: 'I will edit and enhance your videos professionally',
    seller: 'videoedit',
    rating: 4.9,
    reviews: 421,
    price: 120,
    image: 'video editing',
    category: 'Video & Animation'
  },
  {
    id: 5,
    title: 'I will write SEO optimized content for your website',
    seller: 'contentking',
    rating: 5.0,
    reviews: 312,
    price: 90,
    image: 'content writing',
    category: 'Writing'
  },
  {
    id: 6,
    title: 'I will create custom illustrations for your project',
    seller: 'artmaster',
    rating: 4.9,
    reviews: 145,
    price: 180,
    image: 'illustration',
    category: 'Design'
  },
  {
    id: 7,
    title: 'I will build a full-stack web application',
    seller: 'codegenius',
    rating: 5.0,
    reviews: 289,
    price: 500,
    image: 'web app',
    category: 'Development'
  },
  {
    id: 8,
    title: 'I will manage your social media accounts',
    seller: 'socialwhiz',
    rating: 4.7,
    reviews: 198,
    price: 250,
    image: 'social media',
    category: 'Marketing'
  },
  {
    id: 9,
    title: 'I will create 3D product renders',
    seller: 'render3d',
    rating: 4.8,
    reviews: 167,
    price: 220,
    image: '3d rendering',
    category: 'Design'
  },
  {
    id: 10,
    title: 'I will develop a mobile app for iOS and Android',
    seller: 'appbuilder',
    rating: 4.9,
    reviews: 342,
    price: 800,
    image: 'mobile app',
    category: 'Development'
  },
  {
    id: 11,
    title: 'I will compose original music for your project',
    seller: 'musicmaker',
    rating: 5.0,
    reviews: 223,
    price: 350,
    image: 'music composition',
    category: 'Music & Audio'
  },
  {
    id: 12,
    title: 'I will do professional product photography',
    seller: 'photopro',
    rating: 4.9,
    reviews: 401,
    price: 175,
    image: 'photography',
    category: 'Photography'
  },
];


export default function BrowseServicesPage(){

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
    { id: 'high', label: 'Highter than रु 500' },
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
                          <p className='text-1xl font-bold'>Filters</p>
                          <p className='text-sm text-blue-600 hover:underline'>Clear</p>
                      </div>

                      <div className='flex flex-col gap-5'>
                        <p className='text-1xl text-gray-800'>Category</p>
                          {/*Radio Using array map */}
                          {categories.map((cat)=>(
                            <div key={cat.id} className='flex gap-x-2'>
                              <input type='radio' id={cat.id} name='category-group' className="h-4 w-4 cursor-pointer text-blue-600 focus:ring-blue-500"/>
                              <label htmlFor={cat.id} className="text-sm text-gray-800 cursor-pointer select-none">{cat.label}</label>
                            </div>
                          ))}
                      </div>

                      <div className='flex flex-col gap-5'>
                        <p className='text-1xl text-gray-800'>Price</p>
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
                          <span className="font-semibold">12</span> services available
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
                        {/* Post cards */}
                        {allServices.map((service)=>(
                          <ServiceCard key={service.id} service={service}/>
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