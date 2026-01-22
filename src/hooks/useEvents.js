import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEvents()

    // Subscribe to realtime changes for events
    const eventsSubscription = supabase
      .channel('events_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'events' }, 
        (payload) => {
          console.log('Event changed:', payload)
          fetchEvents()
        }
      )
      .subscribe()

    // Subscribe to bookings changes to refresh event capacity
    const bookingsSubscription = supabase
      .channel('bookings_changes_for_events')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' }, 
        (payload) => {
          console.log('Booking changed, refreshing events capacity:', payload)
          fetchEvents()
        }
      )
      .subscribe()

    return () => {
      eventsSubscription.unsubscribe()
      bookingsSubscription.unsubscribe()
    }
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)

    // Fetch active events
    const { data: eventsData, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('event_date', { ascending: true })

    if (fetchError) {
      console.error('Error fetching events:', fetchError)
      setError(fetchError)
      setLoading(false)
      return
    }

    // Fetch actual booking counts for each event from bookings table
    // Count confirmed bookings only (status = 'confirmed')
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('event_id, number_of_guests, status')
      .eq('status', 'confirmed')

    if (bookingsError) {
      console.error('Error fetching bookings for capacity:', bookingsError)
      // Continue with events data even if bookings fetch fails
      setEvents(eventsData || [])
      setLoading(false)
      return
    }

    // Calculate actual booked_seats from confirmed bookings
    const bookingCounts = {}
    if (bookingsData) {
      bookingsData.forEach(booking => {
        if (booking.event_id) {
          bookingCounts[booking.event_id] = (bookingCounts[booking.event_id] || 0) + (booking.number_of_guests || 1)
        }
      })
    }

    // Update events with actual booking counts
    const eventsWithActualBookings = (eventsData || []).map(event => ({
      ...event,
      booked_seats: bookingCounts[event.id] || 0
    }))

    setEvents(eventsWithActualBookings)
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
