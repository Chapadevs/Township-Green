import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useBlogPostImages(blogPostId) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchImages = async () => {
    if (!blogPostId) {
      setImages([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('blog_post_images')
        .select('*')
        .eq('blog_post_id', blogPostId)
        .order('display_order', { ascending: true })

      if (fetchError) {
        console.error('Error fetching blog post images:', fetchError)
        // If table doesn't exist, just return empty array instead of error
        if (fetchError.code === '42P01' || fetchError.message?.includes('does not exist')) {
          console.warn('blog_post_images table does not exist yet. Please run the SQL migration.')
          setImages([])
        } else {
          throw fetchError
        }
      } else {
        console.log('Fetched blog post images:', data)
        setImages(data || [])
      }
    } catch (err) {
      console.error('Error fetching blog post images:', err)
      setError(err.message)
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!blogPostId) {
      setImages([])
      setLoading(false)
      return
    }

    fetchImages()

    // Subscribe to realtime changes
    const imagesSubscription = supabase
      .channel(`blog_post_images_${blogPostId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'blog_post_images',
          filter: `blog_post_id=eq.${blogPostId}`
        }, 
        (payload) => {
          console.log('Blog post image changed:', payload)
          fetchImages()
        }
      )
      .subscribe()

    return () => {
      imagesSubscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogPostId])

  const createImage = async (imageData) => {
    const { data, error } = await supabase
      .from('blog_post_images')
      .insert([imageData])
      .select()
      .single()

    if (!error) {
      await fetchImages()
    }

    return { data, error }
  }

  const updateImage = async (imageId, imageData) => {
    const { data, error } = await supabase
      .from('blog_post_images')
      .update(imageData)
      .eq('id', imageId)
      .select()
      .single()

    if (!error) {
      await fetchImages()
    }

    return { data, error }
  }

  const deleteImage = async (imageId) => {
    const { data, error } = await supabase
      .from('blog_post_images')
      .delete()
      .eq('id', imageId)

    if (!error) {
      await fetchImages()
    }

    return { data, error }
  }

  const reorderImages = async (imageIds) => {
    // Update display_order for all images
    const updates = imageIds.map((id, index) => ({
      id,
      display_order: index
    }))

    for (const update of updates) {
      await supabase
        .from('blog_post_images')
        .update({ display_order: update.display_order })
        .eq('id', update.id)
    }

    await fetchImages()
  }

  return {
    images,
    loading,
    error,
    createImage,
    updateImage,
    deleteImage,
    reorderImages,
    refetch: fetchImages
  }
}
