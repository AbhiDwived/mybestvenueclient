import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  useGetAllBlogsQuery,
  useDeleteBlogMutation,
} from '../../features/blogs/adminblogsAPI';
import { Calendar, Eye, Pencil, Trash, X } from 'lucide-react';
import EditBlogPost from './EditBlogPost';
import DOMPurify from 'dompurify';

export default function ContentManagement() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetAllBlogsQuery(undefined, {
    refetchOnMountOrArgChange: true
  });
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const [deletingId, setDeletingId] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [localBlogs, setLocalBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(localBlogs.length / pageSize);
  const paginatedBlogs = localBlogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  function getPaginationPages(current, total) {
    if (total <= 1) return [1];
    if (current === 1) return [1, '...', total];
    if (current === total) return [1, '...', total];
    if (current !== 1 && current !== total) return [1, '...', current, '...', total];
  }
  const paginationPages = getPaginationPages(currentPage, totalPages);

  // Format blogs and build correct image URLs
  const blogs = Array.isArray(data) ? data : data?.blogs || [];

  // Function to strip HTML tags and get plain text
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  // Update localBlogs when data changes
  React.useEffect(() => {
    if (blogs.length > 0) {
      const formattedData = blogs.map((blog) => {
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

        // Get plain text content for description
        const plainContent = stripHtml(blog.content);
        const description = blog.excerpt || (plainContent ? plainContent.slice(0, 150) + '...' : '');

        return {
          id: blog._id,
          title: blog.title,
          excerpt: blog.excerpt || '',
          description,
          category: blog.category || 'General',
          date: new Date(blog.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          image: imageUrl,
          fullContent: blog.content,
        };
      });
      setLocalBlogs(formattedData);
    }
  }, [blogs]);

  if (isLoading)
    return <p className="text-center mt-10">Loading blogs...</p>;
  if (isError) {
    const errorMessage =
      error?.data?.message || error?.error || 'Something went wrong';
    return (
      <p className="text-center mt-10 text-red-600">Error: {errorMessage}</p>
    );
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    setDeletingId(id);
    try {
      await deleteBlog(id).unwrap();
      // Update local state after successful deletion
      setLocalBlogs(prev => prev.filter(blog => blog.id !== id));
    } catch (err) {
      console.error('Failed to delete blog:', err);
      alert('Failed to delete blog: ' + (err?.data?.message || err.error || 'Unknown error'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setEditMode(true);
  };

  const handleEditSuccess = () => {
    // Refetch the blogs data
    window.location.reload();
  };

  return (
    <>
      {/* Header & New Post Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div className='mx-3'>
          <h1 className="text-xl font-semibold">Blog Management</h1>
          <p className="text-gray-600">Create and manage blog posts</p>
        </div>
        <button
          onClick={() => navigate('/admin/add-blog-post')}
          style={{ borderRadius: '5px' }}
          className="bg-[#00478F] text-white px-4 py-2 mx-3 text-sm flex items-center gap-2"
        >
          <Pencil size={16} /> New Blog Post
        </button>
      </div>

      {/* Blog Cards */}
      <div className="py-12 bg-white mx-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBlogs.map((post) => (
              <div
                key={post.id}
                className="bg-white border rounded-xl overflow-hidden flex flex-col h-full shadow-sm"
              >
                <div className="relative">
                  <Link to={`/admin/blogs/${post.id}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error';
                      }}
                    />
                  </Link>
                  <span className="absolute top-3 left-4 bg-blue-900 text-white text-sm font-medium p-2 rounded-sm capitalize">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-col justify-between flex-grow px-4 pt-4 pb-3">
                  <div className="mb-4">
                    <Link
                      to={`/admin/blogs/${post.id}`}
                      style={{ textDecoration: "none" }}
                      className="text-black transition-colors"
                    >
                      <h5 className="text-lg font-semibold mb-1">{post.title}</h5>
                    </Link>
                    <p className="text-sm text-gray-600 mt-2">{post.description}</p>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <button
                      style={{ borderRadius: '5px' }}
                      className="py-2 px-3 bg-blue-100 text-blue-800  flex items-center gap-1"
                      onClick={() => navigate(`/admin/blogs/${post.id}`)}
                    >
                      <Eye size={16} /> View
                    </button>
                    <button
                      style={{ borderRadius: '5px' }}
                      className="py-2 px-3 bg-yellow-100 text-yellow-800 rounded-md flex items-center gap-1"
                      onClick={() => handleEditBlog(post)}
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      style={{ borderRadius: '5px' }}
                      className="py-2 px-3 bg-red-100 text-red-800 rounded-md flex items-center gap-1"
                      onClick={() => handleDelete(post.id)}
                      disabled={isDeleting && deletingId === post.id}
                    >
                      <Trash size={16} /> Delete
                    </button>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    {post.date}
                  </div>
                </div>
              </div>
            ))}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1 mt-6 bg-gray-50 px-3 py-2 rounded-lg shadow border">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border transition ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              aria-label="Previous page"
            >
              Prev
            </button>
            {paginationPages.map((page, idx) =>
              page === '...'
                ? <span key={idx} className="px-2 text-gray-400">...</span>
                : <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded border transition ${currentPage === page ? 'bg-blue-100 border-blue-400 text-blue-700 font-bold' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border transition ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Edit Blog Modal */}
      {editMode && selectedBlog && (
        <EditBlogPost
          blog={selectedBlog}
          onClose={() => {
            setEditMode(false);
            setSelectedBlog(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}