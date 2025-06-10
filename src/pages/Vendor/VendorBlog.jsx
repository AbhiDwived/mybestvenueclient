import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Eye, Pencil, Trash } from 'lucide-react';
import {
  useGetAllBlogsQuery,
  useDeleteBlogMutation,
} from '../../features/blogs/blogsAPI';

export default function IdeaBlog() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useGetAllBlogsQuery();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [deletingId, setDeletingId] = useState(null);

  const blogs = Array.isArray(data) ? data : data?.blogs || [];

  if (isLoading) return <p className="text-center mt-10">Loading blogs...</p>;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-600">
        Error: {error?.data?.message || error.error}
      </p>
    );

  const formattedBlogs = blogs.map((blog) => {
    let imageUrl;
    if (blog.featuredImage) {
      if (blog.featuredImage.startsWith('http')) {
        imageUrl = blog.featuredImage;
      } else {
        const baseUrl = import.meta.env.VITE_API_URL.replace('/api/v1', '');
        imageUrl = `${baseUrl}${blog.featuredImage}`;
      }
    } else {
      imageUrl = 'https://via.placeholder.com/400x200?text=No+Image';
    }

    return {
      id: blog._id,
      title: blog.title,
      description: blog.excerpt || (blog.content ? blog.content.slice(0, 150) + '...' : ''),
      category: blog.category || 'General',
      date: new Date(blog.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      image: imageUrl,
    };
  });

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      setDeletingId(id);
      try {
        await deleteBlog(id).unwrap();
        refetch(); // Refresh the list
      } catch (err) {
        alert('Failed to delete blog: ' + (err?.data?.message || err.error || 'Unknown error'));
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
        <div>
          <h1 className="text-xl font-semibold">Blog Management</h1>
          <p className="text-gray-600">Create and manage blog posts</p>
        </div>
        <button
          onClick={() => navigate('/vendor/add-blog-post')}
          className="bg-[#00478F] text-white px-4 py-2 rounded text-sm w-full sm:w-auto flex items-center gap-2" 
        >
          <Pencil size={16} /> New Blog Post
        </button>
      </div>

      <div className="py-12 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {formattedBlogs.length > 0 ? (
            formattedBlogs.map((post) => (
              <div
                key={post.id}
                className="bg-white border rounded-xl overflow-hidden flex flex-col h-full shadow-sm"
              >
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error';
                    }}
                  />
                  <span className="absolute top-3 left-4 bg-blue-900 text-white text-xs font-medium px-2 py-1 rounded-full capitalize">
                    {post.category}
                  </span>
                </div>

                <div className="flex flex-col justify-between flex-grow px-4 pt-4 pb-3">
                  <div className="mb-4">
                    <h5 className="text-lg font-playfair font-semibold mb-1 leading-snug">{post.title}</h5>
                    <p className="text-sm text-gray-600 mb-1 mt-2 leading-relaxed">{post.description}</p>
                  </div>
                  <div className="flex justify-between gap-2 mb-3">
                    <button
                      className="py-2 px-3 bg-blue-100 text-blue-800 rounded-md flex items-center gap-1"
                      onClick={() => navigate(`/blog/${post.id}`)}
                    >
                      <Eye size={16} /> View
                    </button>
                    <button
                      className="py-2 px-3 bg-yellow-100 text-yellow-800 rounded-md flex items-center gap-1"
                      onClick={() => navigate(`/vendor/dashboard/edit-blog-post/${post.id}`)}
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      className="py-2 px-3 bg-red-100 text-red-800 rounded-md flex items-center gap-1"
                      onClick={() => handleDelete(post.id)}
                      disabled={isDeleting && deletingId === post.id}
                    >
                      <Trash size={16} /> {isDeleting && deletingId === post.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                  <div className="border-t pt-3 mt-auto flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{post.date}</span>
                    </div>
                    <span
                      className="text-black hover:underline cursor-pointer"
                      onClick={() => navigate(`/blog/${post.id}`)}
                    >
                      Read More
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-600">No articles found.</p>
          )}
        </div>
      </div>
    </>
  );
}