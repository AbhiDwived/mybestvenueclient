import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetAllBlogsQuery,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
} from '../../features/blogs/blogsAPI';
import { Calendar, Eye, Pencil, Trash } from 'lucide-react';

export default function IdeaBlog() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetAllBlogsQuery();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const [deletingId, setDeletingId] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Editable Fields
  const [editedTitle, setEditedTitle] = useState('');
  const [editedExcerpt, setEditedExcerpt] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [editedImage, setEditedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  const blogCategories = [
    'General',
    'Wedding Tips',
    'Technology',
    'Travel',
    'Lifestyle',
    'Health',
  ];

  // Format blogs and build correct image URLs
  const blogs = Array.isArray(data) ? data : data?.blogs || [];

  const formattedBlogs = useMemo(() => {
    return blogs.map((blog) => {
      let imageUrl;

      if (blog.featuredImage) {
        if (blog.featuredImage.startsWith('http')) {
          imageUrl = blog.featuredImage;
        } else {
          // ✅ Backend already provides correct path like "/uploads/vendors/filename.jpg"
          const baseUrl = import.meta.env.VITE_API_URL.replace('/api/v1', '');
          imageUrl = `${baseUrl}${blog.featuredImage}`; // Just concatenate base + path
        }
      } else {
        imageUrl = 'https://via.placeholder.com/400x200?text=No+Image';
      }

      return {
        id: blog._id,
        title: blog.title,
        excerpt: blog.excerpt || '',
        description: blog.excerpt || (blog.content ? blog.content.slice(0, 150) + '...' : ''),
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
    } catch (err) {
      console.error('Failed to delete blog:', err);
      alert('Failed to delete blog: ' + (err?.data?.message || err.error || 'Unknown error'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setEditedTitle(blog.title);
    setEditedExcerpt(blog.excerpt);
    setEditedContent(blog.fullContent);
    setEditedCategory(blog.category);
    setPreviewImage(blog.image); // This uses the correct image URL now
    setEditMode(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const closeModal = () => {
    setEditMode(false);
    setSelectedBlog(null);
    setEditedTitle('');
    setEditedExcerpt('');
    setEditedContent('');
    setEditedCategory('');
    setEditedImage(null);
    setPreviewImage('');
  };

  const handleSaveChanges = async () => {
    if (!editedTitle.trim() || !editedExcerpt.trim() || !editedContent.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', editedTitle);
    formData.append('excerpt', editedExcerpt);
    formData.append('content', editedContent);
    formData.append('category', editedCategory);

    if (editedImage) {
      formData.append('featuredImage', editedImage);
    }

    try {
      await updateBlog({ id: selectedBlog.id, updatedData: formData }).unwrap();
      closeModal();
    } catch (err) {
      console.error('Failed to update blog:', err);
      alert('Failed to save changes: ' + (err?.data?.message || 'Unknown error'));
    }
  };

  return (
    <>
      {/* Header & New Post Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div>
          <h1 className="text-xl font-semibold">Blog Management</h1>
          <p className="text-gray-600">Create and manage blog posts</p>
        </div>
        <button
          onClick={() => navigate('/vendor/add-blog-post')}
          className="bg-[#00478F] text-white px-4 py-2 rounded text-sm flex items-center gap-2" 
        >
          <Pencil size={16} /> New Blog Post
        </button>
      </div>

      {/* Blog Cards */}
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
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error';
                    }}
                  />
                  <span className="absolute top-3 left-4 bg-blue-900 text-white text-xs font-medium px-2 py-1 rounded-full capitalize">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-col justify-between flex-grow px-4 pt-4 pb-3">
                  <div className="mb-4">
                    <h5 className="text-lg font-semibold mb-1">{post.title}</h5>
                    <p className="text-sm text-gray-600 mt-2">{post.description}</p>
                  </div>
                  <div className="flex justify-between gap-2 mb-3">
                    <button
                      className="py-2 px-3 bg-blue-100 text-blue-800 rounded-md flex items-center gap-1"
                      onClick={() => {
                        setSelectedBlog(post);
                        setEditMode(false);
                      }}
                    >
                      <Eye size={16} /> View
                    </button>
                    <button
                      className="py-2 px-3 bg-yellow-100 text-yellow-800 rounded-md flex items-center gap-1"
                      onClick={() => handleEditBlog(post)}
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      className="py-2 px-3 bg-red-100 text-red-800 rounded-md flex items-center gap-1"
                      onClick={() => handleDelete(post.id)}
                      disabled={isDeleting && deletingId === post.id}
                    >
                      <Trash size={16} />
                      {isDeleting && deletingId === post.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-600">No articles found.</p>
          )}
        </div>
      </div>

      {/* Modal for View/Edit */}
      {selectedBlog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editMode ? 'Edit Blog' : 'View Blog'}
            </h2>

            {editMode ? (
              <>
                {/* Edit Mode */}
                <label className="block mb-2 font-medium">Title *</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full mb-4 p-2 border rounded"
                />

                <label className="block mb-2 font-medium">Excerpt (max 300 chars) *</label>
                <input
                  type="text"
                  value={editedExcerpt}
                  onChange={(e) => setEditedExcerpt(e.target.value)}
                  maxLength={300}
                  className="w-full mb-4 p-2 border rounded"
                />

                <label className="block mb-2 font-medium">Content *</label>
                <textarea
                  rows="8"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full mb-4 p-2 border rounded"
                ></textarea>

                <label className="block mb-2 font-medium">Category *</label>
                <select
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                  className="w-full mb-4 p-2 border rounded"
                >
                  {blogCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <label className="block mb-2 font-medium">Image Upload</label>
                <div className="mb-4">
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="mt-2 w-full h-auto max-h-60 object-contain border rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error';
                      }}
                    />
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveChanges}
                    disabled={isUpdating}
                    className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* View Mode */}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">{selectedBlog.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedBlog.category}</p>
                </div>
                {selectedBlog.image && (
                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    className="w-full h-auto max-h-60 object-contain mb-4 rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error';
                    }}
                  />
                )}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Excerpt:</h4>
                  <p className="text-gray-700">{selectedBlog.excerpt}</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Content:</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedBlog.fullContent}</p>
                </div>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
                </>
            )}
          </div>
        </div>
      )}
    </>
  );
}