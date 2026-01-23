import { useState, useEffect } from 'react';
import { useAdminBlogPosts } from '../../hooks/useAdminBlogPosts';
import { useBlogPostImages } from '../../hooks/useBlogPostImages';

export default function BlogPostForm({ post, onClose, onSuccess }) {
  const { createPost, updatePost, uploadImage } = useAdminBlogPosts();
  const { images: existingSubImages, createImage: createSubImage, deleteImage: deleteSubImage, refetch: refetchSubImages } = useBlogPostImages(post?.id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [subImages, setSubImages] = useState([]);
  const [newSubImageUrl, setNewSubImageUrl] = useState('');
  const [newSubImageAlt, setNewSubImageAlt] = useState('');
  const [subImageFile, setSubImageFile] = useState(null);
  const [subImagePreview, setSubImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    published: true
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        image_url: post.image_url || '',
        published: post.published ?? true
      });
      setImagePreview(post.image_url);
    }
  }, [post]);

  useEffect(() => {
    if (existingSubImages) {
      console.log('Loading existing sub-images:', existingSubImages);
      setSubImages(existingSubImages);
    } else {
      setSubImages([]);
    }
  }, [existingSubImages]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, image_url: url }));
    setImagePreview(url);
    setImageFile(null);
  };

  const handleSubImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setSubImageFile(file);
    setNewSubImageUrl(''); // Clear URL if file is selected
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setSubImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubImage = async () => {
    if (!newSubImageUrl.trim() && !subImageFile) {
      setError('Please provide an image URL or upload a file');
      return;
    }

    if (!post || !post.id) {
      setError('Please save the post first before adding sub-images');
      return;
    }

    try {
      setError(null);
      setLoading(true);

      let imageUrl = newSubImageUrl.trim();

      // Upload file if selected
      if (subImageFile) {
        const { data: uploadData, error: uploadError } = await uploadImage(subImageFile);
        if (uploadError) {
          throw new Error(uploadError.message || 'Failed to upload image');
        }
        imageUrl = uploadData.url;
      }

      const { data, error: createError } = await createSubImage({
        blog_post_id: post.id,
        image_url: imageUrl,
        alt_text: newSubImageAlt.trim() || null,
        display_order: subImages.length
      });

      if (createError) {
        console.error('Error creating sub-image:', createError);
        throw new Error(createError.message || 'Failed to add image');
      }
      
      console.log('Sub-image created successfully:', data);
      // Reset form
      setNewSubImageUrl('');
      setNewSubImageAlt('');
      setSubImageFile(null);
      setSubImagePreview(null);
      // Reset file input
      const fileInput = document.getElementById('sub_image_file');
      if (fileInput) fileInput.value = '';
      // Refetch to update the list
      await refetchSubImages();
    } catch (err) {
      console.error('Error in handleAddSubImage:', err);
      setError(err.message || 'Failed to add image');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSubImage = async (imageId) => {
    if (!confirm('Are you sure you want to remove this image?')) {
      return;
    }

    try {
      const { error: deleteError } = await deleteSubImage(imageId);
      if (deleteError) throw new Error(deleteError.message || 'Failed to remove image');
      await refetchSubImages();
    } catch (err) {
      setError(err.message || 'Failed to remove image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = formData.image_url;

      // Upload new image if selected
      if (imageFile) {
        const { data: uploadData, error: uploadError } = await uploadImage(imageFile);
        if (uploadError) throw new Error(uploadError);
        imageUrl = uploadData.url;
      }

      const postData = {
        ...formData,
        image_url: imageUrl || null
      };

      let result;
      if (post) {
        result = await updatePost(post.id, postData);
      } else {
        result = await createPost(postData);
      }

      if (result.error) {
        throw new Error(result.error.message || 'Failed to save blog post');
      }

      onSuccess?.();
    } catch (err) {
      console.error('Error saving blog post:', err);
      setError(err.message || 'Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative bg-[#1d2d25] rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1d2d25] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">
            {post ? 'Edit Blog Post' : 'Create Blog Post'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-2"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-white">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[var(--background-dark)] border border-white/10 rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
              placeholder="Enter blog post title"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              Blog Post Image (Optional)
            </label>
            
            {/* Image Preview */}
            {imagePreview && (
              <div 
                className="w-full aspect-video bg-cover bg-center rounded-lg mb-3"
                style={{ backgroundImage: `url("${imagePreview}")` }}
              ></div>
            )}

            {/* File Input */}
            <div className="relative mb-3">
              <input
                type="file"
                id="image"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[var(--background-dark)] border border-white/10 rounded-lg text-white cursor-pointer hover:bg-white/5 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {imageFile ? imageFile.name : 'Choose Image File'}
              </label>
            </div>

            {/* Or use URL */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 border-t border-white/10"></div>
                <span className="text-xs text-gray-400">OR</span>
                <div className="flex-1 border-t border-white/10"></div>
              </div>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleImageUrlChange}
                className="w-full px-4 py-3 bg-[var(--background-dark)] border border-white/10 rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                placeholder="Or paste image URL here"
              />
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Supported formats: JPEG, PNG, WebP, GIF (Max 5MB)
            </p>
          </div>

          {/* Sub-Images Section (Only for existing posts) */}
          {post && post.id ? (
            <div className="space-y-4 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-white">
                  Additional Images (Gallery)
                </label>
                <span className="text-xs text-gray-400">{subImages.length} image{subImages.length !== 1 ? 's' : ''}</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                These images will appear in a gallery at the bottom of the blog post
              </p>

              {/* Existing Sub-Images */}
              {subImages.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {subImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-[var(--background-dark)]">
                        <img
                          src={image.image_url}
                          alt={image.alt_text || 'Sub-image'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubImage(image.id)}
                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Sub-Image */}
              <div className="space-y-3 p-4 bg-[var(--background-dark)] rounded-lg border border-white/10">
                <h4 className="text-white font-bold text-sm mb-3">Add New Gallery Image</h4>
                
                {/* Image Preview */}
                {subImagePreview && (
                  <div
                    className="w-full aspect-video bg-cover bg-center rounded-lg mb-3"
                    style={{ backgroundImage: `url("${subImagePreview}")` }}
                  ></div>
                )}

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-300">
                    Upload Image File
                  </label>
                  <input
                    type="file"
                    id="sub_image_file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleSubImageFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="sub_image_file"
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-[#12211a] border border-white/10 rounded-lg text-white text-sm cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {subImageFile ? subImageFile.name : 'Choose Image File'}
                  </label>
                </div>

                {/* Or Divider */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 border-t border-white/10"></div>
                  <span className="text-xs text-gray-400">OR</span>
                  <div className="flex-1 border-t border-white/10"></div>
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-300">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={newSubImageUrl}
                    onChange={(e) => {
                      setNewSubImageUrl(e.target.value);
                      setSubImageFile(null);
                      setSubImagePreview(null);
                      const fileInput = document.getElementById('sub_image_file');
                      if (fileInput) fileInput.value = '';
                    }}
                    className="w-full px-3 py-2 bg-[#12211a] border border-white/10 rounded-lg text-white text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-300">
                    Alt Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={newSubImageAlt}
                    onChange={(e) => setNewSubImageAlt(e.target.value)}
                    className="w-full px-3 py-2 bg-[#12211a] border border-white/10 rounded-lg text-white text-sm placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                    placeholder="Describe the image"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSubImage}
                  disabled={(!newSubImageUrl.trim() && !subImageFile) || loading}
                  className="w-full px-4 py-2 bg-[var(--primary-color)] hover:bg-opacity-90 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">add</span>
                      Add Image
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500">
                  Supported formats: JPEG, PNG, WebP, GIF (Max 5MB)
                </p>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Add additional images that will appear in a gallery at the bottom of the post
              </p>
            </div>
          ) : (
            <div className="border-t border-white/10 pt-6">
              <p className="text-xs text-gray-500 italic">
                💡 Save this post first, then edit it again to add additional gallery images
              </p>
            </div>
          )}

          {/* Content */}
          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-white">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={12}
              className="w-full px-4 py-3 bg-[var(--background-dark)] border border-white/10 rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent resize-none font-['Noto_Sans']"
              placeholder="Write your blog post content here..."
            />
          </div>

          {/* Published Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="w-5 h-5 rounded border-white/10 bg-[var(--background-dark)] text-[var(--primary-color)] focus:ring-[var(--primary-color)] focus:ring-2"
            />
            <label htmlFor="published" className="text-white text-sm font-medium">
              Published (visible on blog)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[var(--primary-color)] hover:bg-opacity-90 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                `${post ? 'Update' : 'Create'} Post`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
