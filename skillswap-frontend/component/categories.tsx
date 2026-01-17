import { Code, Palette, Video, Music, Megaphone, Edit, BarChart, Globe } from 'lucide-react';

const categories = [
  { name: 'Programming & Tech', icon: Code, color: 'bg-purple-100 text-purple-600' },
  { name: 'Graphics & Design', icon: Palette, color: 'bg-pink-100 text-pink-600' },
  { name: 'Digital Marketing', icon: Megaphone, color: 'bg-green-100 text-green-600' },
  { name: 'Video & Animation', icon: Video, color: 'bg-orange-100 text-orange-600' },
  { name: 'Music & Audio', icon: Music, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Writing & Translation', icon: Edit, color: 'bg-blue-100 text-blue-600' },
  { name: 'Business', icon: BarChart, color: 'bg-red-100 text-red-600' },
  { name: 'AI Services', icon: Globe, color: 'bg-indigo-100 text-indigo-600' },
];


export default function Categories(){
    return(
        <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-center mb-12">
          Browse by Category
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.name}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className={`${category.color} size-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="size-6" />
                </div>
                <h3 className="text-lg">
                  {category.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
    )
}