import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export function useAdminEvents() {
  const { isAdmin } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isAdmin) {
      fetchAllEvents()

      // Subscribe to bookings changes to refresh event capacity
      const bookingsSubscription = supabase
        .channel('bookings_changes_for_events')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'bookings' }, 
          (payload) => {
            console.log('Booking changed, refreshing events capacity:', payload)
            fetchAllEvents()
          }
        )
        .subscribe()

      return () => {
        bookingsSubscription.unsubscribe()
      }
    }
  }, [isAdmin])

  const fetchAllEvents = async () => {
    setLoading(true)
    setError(null)

    // Fetch all events
    const { data: eventsData, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false })

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

  const createEvent = async (eventData) => {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single()

    if (!error) {
      await fetchAllEvents()
    }

    return { data, error }
  }

  const updateEvent = async (eventId, eventData) => {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', eventId)
      .select()
      .single()

    if (!error) {
      await fetchAllEvents()
    }

    return { data, error }
  }

  const deleteEvent = async (eventId) => {
    const { data, error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)

    if (!error) {
      await fetchAllEvents()
    }

    return { data, error }
  }

  const toggleEventStatus = async (eventId, currentStatus) => {
    return updateEvent(eventId, { is_active: !currentStatus })
  }

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    toggleEventStatus,
    refetch: fetchAllEvents
  }
}
