import { useState, useEffect } from 'react';
import { useHeroCarousel } from '../../hooks/useHeroCarousel';

export default function CarouselForm({ carouselImage, onClose, onSuccess }) {
  const { createCarouselImage, updateCarouselImage, uploadImage } = useHeroCarousel();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    alt_text: '',
    image_url: '',
    position: 0,
    is_active: true
  });

  useEffect(() => {
    if (carouselImage) {
      setFormData({
        title: carouselImage.title || '',
        alt_text: carouselImage.alt_text || '',
        image_url: carouselImage.image_url || '',
        position: carouselImage.position || 0,
        is_active: carouselImage.is_active ?? true
      });
      setImagePreview(carouselImage.image_url);
    }
  }, [carouselImage]);

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

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        const { data: uploadData, error: uploadError } = await uploadImage(imageFile);
        if (uploadError) throw new Error(uploadError);
        imageUrl = uploadData.url;
      }

      const carouselData = {
        ...formData,
        image_url: imageUrl,
        position: parseInt(formData.position)
      };

      let result;
      if (carouselImage) {
        result = await updateCarouselImage(carouselImage.id, carouselData);
      } else {
        result = await createCarouselImage(carouselData);
      }

      if (result.error) {
        throw new Error(result.error);
      }

      onSuccess?.();
    } catch (err) {
      console.error('Error saving carousel image:', err);
      setError(err.message || 'Failed to save carousel image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative bg-[#1d2d25] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#1d2d25] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">
            {carouselImage ? 'Edit Carousel Image' : 'Create New Carousel Image'}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {imagePreview && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">
                Current Image
              </label>
              <div 
                className="w-full aspect-video bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url("${imagePreview}")` }}
              ></div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              Carousel Image <span className="text-red-500">*</span>
            </label>
            <div className="relative">
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
                {imageFile ? imageFile.name : 'Choose Image'}
              </label>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Supported formats: JPEG, PNG, WebP, GIF (Max 5MB)
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-white">
              Slide Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[var(--background-dark)] border border-white/10 rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
              placeholder="Enter slide title"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="alt_text" className="block text-sm font-medium text-white">
              Image Description (Alt Text) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="alt_text"
              name="alt_text"
              value={formData.alt_text}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-[var(--background-dark)] border border-white/10 rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent resize-none"
              placeholder="Describe the image for accessibility and SEO"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="position" className="block text-sm font-medium text-white">
              Display Position
            </label>
            <input
              type="number"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 bg-[var(--background-dark)] border border-white/10 rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
              placeholder="0"
            />
            <p className="text-xs text-[var(--text-muted)]">
              Lower numbers appear first (0 = first slide)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-5 h-5 rounded border-white/10 bg-[var(--background-dark)] text-[var(--primary-color)] focus:ring-[var(--primary-color)] focus:ring-2"
            />
            <label htmlFor="is_active" className="text-white text-sm font-medium">
              Active (visible in carousel)
            </label>
          </div>

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
              disabled={loading || (!imageFile && !formData.image_url)}
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
                `${carouselImage ? 'Update' : 'Create'} Carousel Image`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
