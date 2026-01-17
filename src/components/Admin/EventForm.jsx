import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function EventForm({ event, onClose, onSuccess }) {
  const isEditing = !!event
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'art-session',
    event_date: '',
    start_time: '',
    end_time: '',
    capacity: 20,
    booked_seats: 0,
    price: 0,
    image_url: '',
    location: 'Township Green Lounge',
    instructor: '',
    is_active: true,
    is_featured: false,
    tags: '',
    materials: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  // Populate form if editing
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        event_type: event.event_type || 'art-session',
        event_date: event.event_date || '',
        start_time: event.start_time || '',
        end_time: event.end_time || '',
        capacity: event.capacity || 20,
        booked_seats: event.booked_seats || 0,
        price: event.price || 0,
        image_url: event.image_url || '',
        location: event.location || 'Township Green Lounge',
        instructor: event.instructor || '',
        is_active: event.is_active ?? true,
        is_featured: event.is_featured ?? false,
        tags: Array.isArray(event.tags) ? event.tags.join(', ') : '',
        materials: Array.isArray(event.materials) ? event.materials.join(', ') : ''
      })
      setImagePreview(event.image_url || null)
    }
  }, [event])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size must be less than 5MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }

      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return formData.image_url

    setUploadingImage(true)
    try {
      // Create unique filename
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `event-images/${fileName}`

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('events')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('events')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (err) {
      console.error('Error uploading image:', err)
      throw new Error('Failed to upload image: ' + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Upload image if new file selected
      let imageUrl = formData.image_url
      if (imageFile) {
        imageUrl = await uploadImage()
      }

      // Prepare data
      const eventData = {
        ...formData,
        image_url: imageUrl,
        capacity: parseInt(formData.capacity),
        booked_seats: parseInt(formData.booked_seats || 0),
        price: parseFloat(formData.price),
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        materials: formData.materials ? formData.materials.split(',').map(m => m.trim()).filter(Boolean) : []
      }

      let result
      if (isEditing) {
        // Update existing event
        result = await supabase
          .from('events')
          .update(eventData)
          .eq('id', event.id)
          .select()
          .single()
      } else {
        // Create new event
        result = await supabase
          .from('events')
          .insert([eventData])
          .select()
          .single()
      }

      if (result.error) throw result.error

      setSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 1500)
    } catch (err) {
      console.error('Error saving event:', err)
      setError(err.message || 'Failed to save event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#1d2d25] rounded-lg p-6 max-w-3xl w-full my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 px-4 py-3 rounded mb-4">
            Event {isEditing ? 'updated' : 'created'} successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Title */}
          <div>
            <label className="block text-white mb-2 text-sm font-medium">Event Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white mb-2 text-sm font-medium">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none resize-none"
              required
            />
          </div>

          {/* Event Type & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2 text-sm font-medium">Event Type *</label>
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none"
                required
              >
                <option value="art-session">Art Session</option>
                <option value="paint-night">Paint Night</option>
                <option value="community-event">Community Event</option>
                <option value="special-event">Special Event</option>
                <option value="private-event">Private Event</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2 text-sm font-medium">Event Date *</label>
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Time & Capacity */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-white mb-2 text-sm font-medium">Start Time *</label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2 text-sm font-medium">End Time *</label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2 text-sm font-medium">Capacity *</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2 text-sm font-medium">Booked Seats</label>
              <input
                type="number"
                name="booked_seats"
                value={formData.booked_seats}
                onChange={handleChange}
                min="0"
                max={formData.capacity || 0}
                className="w-full px-4 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none"
                title="Manually track booked seats (updates when bookings are made via website, but you can override manually)"
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.capacity - (formData.booked_seats || 0)} available
              </p>
            </div>

            <div>
              <label className="block text-white mb-2 text-sm font-medium">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2 text-sm font-medium">Event Image</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#23a867] file:text-white file:cursor-pointer hover:file:bg-opacity-90"
                  />
                  <p className="text-xs text-gray-400 mt-1">Max 5MB. Supported: JPG, PNG, GIF, WebP</p>
                </div>
              </div>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Event preview" 
                    className="w-full max-w-xs h-48 object-cover rounded-lg border border-gray-700"
                  />
                </div>
              )}
            </div>

            {/* Or paste URL */}
            <div>
              <label className="block text-white mb-2 text-sm font-medium">Or paste image URL</label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-white mb-2 text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none"
            />
          </div>

          {/* Instructor */}
          <div>
            <label className="block text-white mb-2 text-sm font-medium">Instructor</label>
            <input
              type="text"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none"
            />
          </div>

          {/* Tags & Materials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2 text-sm font-medium">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="art, painting, creative"
                className="w-full px-4 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white mb-2 text-sm font-medium">Materials (comma-separated)</label>
              <input
                type="text"
                name="materials"
                value={formData.materials}
                onChange={handleChange}
                placeholder="canvas, paint, brushes"
                className="w-full px-4 py-2 rounded bg-[#12211a] text-white border border-gray-700 focus:border-[#23a867] focus:outline-none"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-700 bg-[#12211a] text-[#23a867] focus:ring-[#23a867]"
              />
              <span className="text-white">Active</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-700 bg-[#12211a] text-[#23a867] focus:ring-[#23a867]"
              />
              <span className="text-white">Featured</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || success || uploadingImage}
              className="flex-1 bg-[#23a867] text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingImage ? 'Uploading Image...' : loading ? 'Saving...' : success ? 'Saved!' : isEditing ? 'Update Event' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 bg-gray-700 text-white py-3 rounded-lg font-bold hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
