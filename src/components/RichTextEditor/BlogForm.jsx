import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import TableOfContents from './TableOfContents';
import { toast } from 'react-toastify';

const BlogForm = ({ onSubmit, initialData = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    seoKeywords: initialData?.seoKeywords?.join(', ') || '',
    tags: initialData?.tags?.join(', ') || '',
    tableOfContents: initialData?.tableOfContents || false,
    status: initialData?.status || 'Published'
  });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(initialData?.featuredImage || '');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditorImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/v1/admin/blog/upload-editor-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        return data.url;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error('Failed to upload image');
      throw error;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    if (featuredImage) {
      submitData.append('image', featuredImage);
    }

    onSubmit(submitData);
  };

  const generateTOC = async () => {
    try {
      const response = await fetch('/api/v1/admin/blog/generate-toc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: formData.content })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Generated ${data.tableOfContents.length} headings for table of contents`);
      }
    } catch (error) {
      toast.error('Failed to generate table of contents');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">{initialData ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Title *
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Category *
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Wedding Planning">Wedding Planning</option>
              <option value="Venues">Venues</option>
              <option value="Photography">Photography</option>
              <option value="Catering">Catering</option>
              <option value="Decoration">Decoration</option>
              <option value="Fashion">Fashion</option>
              <option value="Tips & Advice">Tips & Advice</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Featured Image *
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            required={!initialData}
          />
        </label>
        {previewImage && (
          <img src={previewImage} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Excerpt *
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows="3"
            maxLength="300"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>
        <p className="text-sm text-gray-500 mt-1">{formData.excerpt.length}/300 characters</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Content *</label>
        <p className="text-sm text-gray-600 mb-3">
          💡 Use the <strong>📄 Table of Contents</strong> button in the editor toolbar to insert a TOC that will auto-update with your headings.
        </p>
        <RichTextEditor
          value={formData.content}
          onChange={handleContentChange}
          onImageUpload={handleEditorImageUpload}
        />
      </div>

      {/* SEO Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-4">SEO Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              SEO Title
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleInputChange}
                maxLength="60"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <p className="text-sm text-gray-500">{formData.seoTitle.length}/60 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              SEO Keywords (comma separated)
              <input
                type="text"
                name="seoKeywords"
                value={formData.seoKeywords}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">
            SEO Description
            <textarea
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleInputChange}
              rows="2"
              maxLength="160"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <p className="text-sm text-gray-500">{formData.seoDescription.length}/160 characters</p>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Tags (comma separated)
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Status
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </label>
        </div>

        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            name="tableOfContents"
            checked={formData.tableOfContents}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label className="text-sm font-medium">Enable Table of Contents</label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : (initialData ? 'Update Blog' : 'Create Blog')}
        </button>
      </div>
    </form>
  );
};

export default BlogForm;