import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetBlogBySlugQuery, useGetAllBlogsQuery } from '../../features/blogs/adminblogsAPI';
import { Calendar, ArrowLeft, Clock, Tag, User } from 'lucide-react';
import DOMPurify from 'dompurify';
import Loader from "../../components/{Shared}/Loader";

export default function PublicBlogDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Get all blogs for fallback
  const { data: allBlogsData } = useGetAllBlogsQuery();
  
  const { data, isLoading, isError, error } = useGetBlogBySlugQuery(slug);
  
  // Find blog by matching title if slug API fails
  const matchingBlog = React.useMemo(() => {
    if (allBlogsData?.blogs && slug) {
      return allBlogsData.blogs.find(blog => {
        const generatedSlug = blog.title.toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
        return generatedSlug === slug;
      });
    }
    return null;
  }, [allBlogsData, slug]);
  
  // Use matching blog if API is slow
  const blog = data?.blog || matchingBlog;

  // Add smooth scrolling for TOC links - MOVED BEFORE CONDITIONAL RETURNS
  React.useEffect(() => {
    if (!blog) return;
    
    const handleTOCClick = (e) => {
      if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          targetElement.style.backgroundColor = '#fff3cd';
          targetElement.style.transition = 'background-color 0.3s ease';
          setTimeout(() => {
            targetElement.style.backgroundColor = 'transparent';
          }, 2000);
        }
      }
    };

    document.addEventListener('click', handleTOCClick);
    return () => document.removeEventListener('click', handleTOCClick);
  }, [blog]);

  // If we found a matching blog and API is still loading, show the blog immediately
  if (matchingBlog && isLoading) {
    // Use the matching blog data directly to avoid loading delay
  } else if (isLoading) {
    return <Loader fullScreen />;
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700 font-medium">Error: {error?.data?.message || 'Failed to load blog'}</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
          <p className="text-yellow-700 font-medium">Blog not found</p>
        </div>
      </div>
    );
  }

  // Format the date
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Format read time (assuming 200 words per minute)
  const wordCount = blog.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  // Construct image URL
  let imageUrl;
  if (blog.featuredImage) {
    if (blog.featuredImage.startsWith('http')) {
      imageUrl = blog.featuredImage;
    } else {
      const baseUrl = import.meta.env.VITE_API_URL.replace('/api/v1', '');
      imageUrl = `${baseUrl}${blog.featuredImage}`;
    }
  } else {
    imageUrl = 'https://via.placeholder.com/1200x600?text=No+Image';
  }

  // Sanitize and render HTML content
  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
      })
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <style>{`
        .blog-content h1, .blog-content h2, .blog-content h3, 
        .blog-content h4, .blog-content h5, .blog-content h6 {
          scroll-margin-top: 100px;
          padding-top: 10px;
          margin-top: 20px;
        }
        .blog-content a[href^="#"] {
          cursor: pointer;
        }
        .blog-content a[href^="#"]:hover {
          background-color: #e3f2fd;
          border-radius: 4px;
          padding: 2px 4px;
        }
      `}</style>
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-8"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Blogs</span>
        </button>

        {/* Blog Header */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          {/* Featured Image */}
          <div className="relative h-[400px] overflow-hidden">
            <img
              src={imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/1200x600?text=Image+Error';
              }}
            />
            {blog.category && (
              <div className="absolute top-6 right-6">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  {blog.category}
                </span>
              </div>
            )}
          </div>

          <div className="p-8">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center">
                <Calendar size={18} className="mr-2 text-blue-600" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock size={18} className="mr-2 text-blue-600" />
                <span>{readTime} min read</span>
              </div>
              <div className="flex items-center">
                <User size={18} className="mr-2 text-blue-600" />
                <span>{blog.createdBy?.name || 'Admin'}</span>
              </div>
              {blog.category && (
                <div className="flex items-center">
                  <Tag size={18} className="mr-2 text-blue-600" />
                  <span>{blog.category}</span>
                </div>
              )}
            </div>

            {/* Blog Excerpt */}
            {blog.excerpt && (
              <div className="mb-8">
                <blockquote className="text-lg text-gray-700 italic border-l-4 border-blue-500 pl-6 py-2 bg-blue-50 rounded-r-lg">
                  {blog.excerpt}
                </blockquote>
              </div>
            )}

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-[#0d1a3b] leading-relaxed blog-content"
                dangerouslySetInnerHTML={createMarkup(blog.content)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 