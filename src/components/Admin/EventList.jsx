import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function EventList({ events, loading, onEdit, onRefresh }) {
  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }

    setDeleting(eventId)
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      onRefresh()
    } catch (err) {
      console.error('Error deleting event:', err)
      alert('Failed to delete event: ' + err.message)
    } finally {
      setDeleting(null)
    }
  }

  const handleToggleActive = async (event) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_active: !event.is_active })
        .eq('id', event.id)

      if (error) throw error

      onRefresh()
    } catch (err) {
      console.error('Error toggling event status:', err)
      alert('Failed to update event status')
    }
  }

  if (loading) {
    return (
      <div className="bg-[#1d2d25] rounded-lg p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#23a867]"></div>
        <p className="text-white mt-4">Loading events...</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="bg-[#1d2d25] rounded-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <span className="material-symbols-outlined text-5xl">event_busy</span>
        </div>
        <p className="text-white text-lg font-bold mb-2">No Events Yet</p>
        <p className="text-gray-400">Create your first event to get started!</p>
      </div>
    )
  }

  return (
    <div className="bg-[#1d2d25] rounded-lg p-6 shadow-2xl">
      <h2 className="text-xl font-bold text-white mb-4">All Events ({events.length})</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-gray-400 font-medium py-3 px-4">Event</th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">Date & Time</th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">Capacity</th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">Price</th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">Status</th>
              <th className="text-right text-gray-400 font-medium py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const availableSeats = event.capacity - (event.booked_seats || 0)
              const eventDate = new Date(event.event_date)
              
              return (
                <tr key={event.id} className="border-b border-gray-800 hover:bg-[#12211a] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {event.image_url && (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="text-white font-medium">{event.title}</p>
                        <p className="text-gray-400 text-sm">{event.event_type}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <p className="text-white text-sm">
                      {eventDate.toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {event.start_time?.slice(0, 5)} - {event.end_time?.slice(0, 5)}
                    </p>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <p className="text-white">{event.booked_seats || 0} / {event.capacity}</p>
                      <p className={`${availableSeats > 5 ? 'text-green-400' : availableSeats > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {availableSeats} available
                      </p>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <p className="text-white font-medium">
                      {event.price === 0 || event.price === '0.00' ? 'Free' : `$${parseFloat(event.price).toFixed(2)}`}
                    </p>
                  </td>
                  
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleActive(event)}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        event.is_active 
                          ? 'bg-green-500 bg-opacity-20 text-green-400' 
                          : 'bg-gray-500 bg-opacity-20 text-gray-400'
                      }`}
                    >
                      {event.is_active ? 'Active' : 'Inactive'}
                    </button>
                    {event.is_featured && (
                      <span className="ml-2 text-yellow-400 text-xs">⭐ Featured</span>
                    )}
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(event)}
                        className="p-2 text-blue-400 hover:bg-blue-500 hover:bg-opacity-20 rounded transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        disabled={deleting === event.id}
                        className="p-2 text-red-400 hover:bg-red-500 hover:bg-opacity-20 rounded transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {deleting === event.id ? 'hourglass_empty' : 'delete'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
