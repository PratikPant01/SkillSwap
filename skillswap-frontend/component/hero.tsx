import React from 'react'

const Hero = () => {
  return (
   <section className='bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white py-20 relative overflow-hidden'>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl mb-6">
            Find the perfect freelance services for your business
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
             Work with talented freelancers across Nepal
          </p>
          <div className="bg-white rounded-lg shadow-2xl p-2 flex gap-2 max-w-2xl mx-auto backdrop-blur-sm">
            <div className='flex-1 flex items-center gap-2 px-2'>
                
            </div>
          </div>
          <div className='mt-8 flex flex-wrap items-center justify-center gap-3 '>
            <span className='text-blue-200 font-medium'>Popular: </span>
            {['Web Development', 'Graphic Design', 'Video Editing', 'Digital Marketing', 'Content Writing'].map((skill) => (
                <button key={skill}  className="px-4 py-1.5 border border-white/40 rounded-full hover:bg-white/20 hover:border-white/60 transition-all duration-300 text-sm backdrop-blur-sm"
                >{skill}</button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero