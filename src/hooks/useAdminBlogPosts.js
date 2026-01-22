import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export function useAdminBlogPosts() {
  const { isAdmin } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isAdmin) {
      fetchAllPosts()

      // Subscribe to realtime changes
      const postsSubscription = supabase
        .channel('admin_blog_posts_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'blog_posts' }, 
          (payload) => {
            console.log('Blog post changed:', payload)
            fetchAllPosts()
          }
        )
        .subscribe()

      return () => {
        postsSubscription.unsubscribe()
      }
    }
  }, [isAdmin])

  const fetchAllPosts = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setPosts(data || [])
    } catch (err) {
      console.error('Error fetching blog posts:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (postData) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([postData])
      .select()
      .single()

    if (!error) {
      await fetchAllPosts()
    }

    return { data, error }
  }

  const updatePost = async (postId, postData) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(postData)
      .eq('id', postId)
      .select()
      .single()

    if (!error) {
      await fetchAllPosts()
    }

    return { data, error }
  }

  const deletePost = async (postId) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId)

    if (!error) {
      await fetchAllPosts()
    }

    return { data, error }
  }

  const togglePostStatus = async (postId, currentStatus) => {
    return updatePost(postId, { published: !currentStatus })
  }

  // Upload image to Supabase storage
  const uploadImage = async (file) => {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('blog-posts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-posts')
        .getPublicUrl(filePath);

      return { data: { path: filePath, url: publicUrl }, error: null };
    } catch (err) {
      console.error('Error uploading image:', err);
      return { data: null, error: err.message };
    }
  };

  // Delete image from storage
  const deleteImage = async (filePath) => {
    try {
      const { error: deleteError } = await supabase.storage
        .from('blog-posts')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      return { error: null };
    } catch (err) {
      console.error('Error deleting image:', err);
      return { error: err.message };
    }
  };

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    togglePostStatus,
    uploadImage,
    deleteImage,
    refetch: fetchAllPosts
  }
}
