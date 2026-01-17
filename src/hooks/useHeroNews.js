import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Custom hook for managing hero news items
 * Used for the "What's happening" section on the homepage
 */
export function useHeroNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all active news items
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('hero_news')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });

      if (fetchError) throw fetchError;

      setNews(data || []);
    } catch (err) {
      console.error('Error fetching hero news:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all news items (including inactive) - for admin
  const fetchAllNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('hero_news')
        .select('*')
        .order('position', { ascending: true });

      if (fetchError) throw fetchError;

      setNews(data || []);
    } catch (err) {
      console.error('Error fetching all hero news:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new news item
  const createNews = async (newsData) => {
    try {
      const { data, error: createError } = await supabase
        .from('hero_news')
        .insert([newsData])
        .select()
        .single();

      if (createError) throw createError;

      await fetchNews();
      return { data, error: null };
    } catch (err) {
      console.error('Error creating hero news:', err);
      return { data: null, error: err.message };
    }
  };

  // Update existing news item
  const updateNews = async (id, updates) => {
    try {
      const { data, error: updateError } = await supabase
        .from('hero_news')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchNews();
      return { data, error: null };
    } catch (err) {
      console.error('Error updating hero news:', err);
      return { data: null, error: err.message };
    }
  };

  // Delete news item
  const deleteNews = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('hero_news')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchNews();
      return { error: null };
    } catch (err) {
      console.error('Error deleting hero news:', err);
      return { error: err.message };
    }
  };

  // Upload image to Supabase storage
  const uploadImage = async (file) => {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('hero-news')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('hero-news')
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
        .from('hero-news')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      return { error: null };
    } catch (err) {
      console.error('Error deleting image:', err);
      return { error: err.message };
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    loading,
    error,
    refetch: fetchNews,
    fetchAllNews,
    createNews,
    updateNews,
    deleteNews,
    uploadImage,
    deleteImage
  };
}
