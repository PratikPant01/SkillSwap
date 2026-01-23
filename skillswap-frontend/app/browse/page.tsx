import Link from 'next/link';


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
     return (
           <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-6">Browse Services</h1>

                <p className="text-gray-600">
                All services will be shown here.
            </p>
            </div>
     )
}