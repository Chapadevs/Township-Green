import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEvents()

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('events_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'events' }, 
        (payload) => {
          console.log('Event changed:', payload)
          fetchEvents()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('event_date', { ascending: true })

    if (fetchError) {
      console.error('Error fetching events:', fetchError)
      setError(fetchError)
    } else {
      setEvents(data || [])
    }
    
    setLoading(false)
  }

  const getEventById = async (eventId) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    return { data, error }
  }

  const getAvailableSeats = (event) => {
    if (!event) return 0
    return Math.max(0, (event.capacity || 0) - (event.booked_seats || 0))
  }

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
    getEventById,
    getAvailableSeats
  }
}
