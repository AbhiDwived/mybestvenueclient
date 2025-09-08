import React, { useEffect, useRef } from 'react';
import { useGetAllBlogsQuery } from '../../features/blogs/adminblogsAPI';
import { Link } from 'react-router-dom';
import IdeaBlogHeader from '../../assets/newPics/IdeaBlogHeader.avif';

const LatestBlogs = () => {
  const { data, isLoading, error } = useGetAllBlogsQuery();
  const sliderRef = useRef(null);

  const blogs = data?.blogs || [];
  const latestBlogs = blogs.slice(0, 10).map((blog) => {
    let imageUrl;
    if (blog.featuredImage) {
      if (blog.featuredImage.startsWith('http')) {
        imageUrl = blog.featuredImage;
      } else {
        const baseUrl = import.meta.env.VITE_API_URL.replace('/api/v1', '');
        imageUrl = `${baseUrl}${blog.featuredImage}`;
      }
    } else {
      imageUrl = IdeaBlogHeader;
    }
    
    return {
      ...blog,
      image: imageUrl,
      excerpt: blog.excerpt || (blog.content ? blog.content.slice(0, 150) + '...' : ''),
      author: { name: blog.createdBy?.name || 'Admin' }
    };
  });

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || latestBlogs.length === 0) return;

    const scroll = () => {
      if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
        slider.scrollLeft = 0;
      } else {
        slider.scrollLeft += 1;
      }
    };

    const interval = setInterval(scroll, 30);
    return () => clearInterval(interval);
  }, [latestBlogs]);

  if (isLoading) return <div className="text-center py-8">Loading blogs...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error loading blogs</div>;

  return (
    <section className="py-16 bg-gray-50">
      <div className="w-full px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Latest Blogs</h2>
          <p className="text-gray-600">Discover the latest wedding trends and tips</p>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => sliderRef.current.scrollBy({left: -320, behavior: 'smooth'})}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
          >
            ←
          </button>
          <button 
            onClick={() => sliderRef.current.scrollBy({left: 320, behavior: 'smooth'})}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
          >
            →
          </button>
          <div className="overflow-x-auto overflow-y-hidden mx-8" ref={sliderRef} style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <div className="flex gap-6 pb-4" style={{width: `${latestBlogs.length * 320}px`}}>
            {latestBlogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex-shrink-0" style={{width: '300px'}}>
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = IdeaBlogHeader;
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {blog.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>By {blog.author?.name}</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Link 
                    to={`/blog/${blog._id}`}
                    className="mt-3 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogs;