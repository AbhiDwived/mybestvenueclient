import React, { useEffect, useState } from 'react';
import TableOfContents from './TableOfContents';
import { Clock, Eye, Calendar, Tag } from 'lucide-react';

const BlogDisplay = ({ blogId, showTOC = true }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/admin/blog/getblog-toc/${blogId}`);
      const data = await response.json();
      
      if (data.success) {
        setBlog(data.blog);
        // Add IDs to headings for TOC navigation
        addHeadingIds(data.blog.content);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  };

  const addHeadingIds = (content) => {
    // This will be handled by the TableOfContents component
    // but we can also update the DOM directly here if needed
    setTimeout(() => {
      const headings = document.querySelectorAll('.blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4, .blog-content h5, .blog-content h6');
      headings.forEach((heading, index) => {
        if (!heading.id) {
          heading.id = `heading-${index}`;
        }
      });
    }, 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Blog not found</p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
            {blog.category}
          </span>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          
          {blog.readingTime > 0 && (
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{blog.readingTime} min read</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Eye size={16} />
            <span>{blog.views} views</span>
          </div>
        </div>

        {blog.featuredImage && (
          <img 
            src={blog.featuredImage} 
            alt={blog.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        <p className="text-lg text-gray-700 leading-relaxed">{blog.excerpt}</p>
      </header>

      {/* Table of Contents */}
      {showTOC && blog.tableOfContents && (
        <TableOfContents content={blog.content} isVisible={true} />
      )}

      {/* Content */}
      <div 
        className="blog-content prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
        style={{
          lineHeight: '1.8',
          fontSize: '16px'
        }}
      />

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Author Info */}
      {blog.createdBy && (
        <div className="mt-8 pt-6 border-t">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {blog.createdBy.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{blog.createdBy.name}</p>
              <p className="text-sm text-gray-600">Admin</p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogDisplay;