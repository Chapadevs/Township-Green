import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export function useAdminBookings() {
  const { isAdmin } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isAdmin) {
      fetchAllBookings()
    } else {
      setBookings([])
      setLoading(false)
    }
  }, [isAdmin])

  const fetchAllBookings = async () => {
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('bookings')
      .select(`
        *,
        event:events(*)
      `)
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching bookings:', fetchError)
      setError(fetchError)
    } else {
      setBookings(data || [])
    }
    
    setLoading(false)
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    if (!isAdmin) {
      return { data: null, error: new Error('Must be admin to update booking status') }
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId)
      .select(`
        *,
        event:events(*)
      `)
      .single()

    if (!error && data) {
      await fetchAllBookings()
    }

    return { data, error }
  }

  const fetchBookingsByStatus = async (status) => {
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('bookings')
      .select(`
        *,
        event:events(*)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching bookings by status:', fetchError)
      setError(fetchError)
    } else {
      setBookings(data || [])
    }
    
    setLoading(false)
  }

  return {
    bookings,
    loading,
    error,
    updateBookingStatus,
    fetchBookingsByStatus,
    refetch: fetchAllBookings
  }
}
