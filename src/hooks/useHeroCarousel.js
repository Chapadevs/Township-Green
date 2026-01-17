import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useHeroCarousel() {
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCarouselImages = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('hero_carousel')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });

      if (fetchError) throw fetchError;
      setCarouselImages(data || []);
    } catch (err) {
      console.error('Error fetching carousel images:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCarouselImages = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('hero_carousel')
        .select('*')
        .order('position', { ascending: true });

      if (fetchError) throw fetchError;
      setCarouselImages(data || []);
    } catch (err) {
      console.error('Error fetching all carousel images:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCarouselImage = async (imageData) => {
    try {
      const { data, error: createError } = await supabase
        .from('hero_carousel')
        .insert([imageData])
        .select()
        .single();

      if (createError) throw createError;
      await fetchCarouselImages();
      return { data, error: null };
    } catch (err) {
      console.error('Error creating carousel image:', err);
      return { data: null, error: err.message };
    }
  };

  const updateCarouselImage = async (id, updates) => {
    try {
      const { data, error: updateError } = await supabase
        .from('hero_carousel')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      await fetchCarouselImages();
      return { data, error: null };
    } catch (err) {
      console.error('Error updating carousel image:', err);
      return { data: null, error: err.message };
    }
  };

  const deleteCarouselImage = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('hero_carousel')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchCarouselImages();
      return { error: null };
    } catch (err) {
      console.error('Error deleting carousel image:', err);
      return { error: err.message };
    }
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('hero-carousel')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('hero-carousel')
        .getPublicUrl(filePath);

      return { data: { path: filePath, url: publicUrl }, error: null };
    } catch (err) {
      console.error('Error uploading image:', err);
      return { data: null, error: err.message };
    }
  };

  const deleteImage = async (filePath) => {
    try {
      const { error: deleteError } = await supabase.storage
        .from('hero-carousel')
        .remove([filePath]);

      if (deleteError) throw deleteError;
      return { error: null };
    } catch (err) {
      console.error('Error deleting image:', err);
      return { error: err.message };
    }
  };

  useEffect(() => {
    fetchCarouselImages();
  }, []);

  return {
    carouselImages,
    loading,
    error,
    refetch: fetchCarouselImages,
    fetchAllCarouselImages,
    createCarouselImage,
    updateCarouselImage,
    deleteCarouselImage,
    uploadImage,
    deleteImage
  };
}
