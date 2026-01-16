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
    }
  }, [isAdmin])

  const fetchAllEvents = async () => {
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false })

    if (fetchError) {
      console.error('Error fetching events:', fetchError)
      setError(fetchError)
    } else {
      setEvents(data || [])
    }
    
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
