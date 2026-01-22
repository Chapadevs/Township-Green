import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useBlogPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPosts()

    // Subscribe to realtime changes for blog posts
    const postsSubscription = supabase
      .channel('blog_posts_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'blog_posts' }, 
        (payload) => {
          console.log('Blog post changed:', payload)
          fetchPosts()
        }
      )
      .subscribe()

    return () => {
      postsSubscription.unsubscribe()
    }
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    setError(null)

    // Fetch published blog posts
    const { data: postsData, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching blog posts:', fetchError)
      setError(fetchError)
      setLoading(false)
      return
    }

    setPosts(postsData || [])
    setLoading(false)
  }

  const getPostById = async (postId) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .eq('published', true)
      .single()

    return { data, error }
  }

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
    getPostById
  }
}
