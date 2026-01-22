import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function BookingList({ bookings, loading, onStatusUpdate, onRefresh }) {
  const [statusFilter, setStatusFilter] = useState('all')
  const [updating, setUpdating] = useState(null)

  const handleStatusChange = async (bookingId, newStatus) => {
    if (!confirm(`Are you sure you want to change this booking status to "${newStatus}"?`)) {
      return
    }

    setUpdating(bookingId)
    try {
      const { error } = await onStatusUpdate(bookingId, newStatus)
      if (error) throw error
      if (onRefresh) {
        await onRefresh()
      }
    } catch (err) {
      console.error('Error updating booking status:', err)
      alert('Failed to update booking status: ' + err.message)
    } finally {
      setUpdating(null)
    }
  }

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter)

  if (loading) {
    return (
      <div className="bg-[#1d2d25] rounded-lg p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#23a867]"></div>
        <p className="text-white mt-4">Loading bookings...</p>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-[#1d2d25] rounded-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <span className="material-symbols-outlined text-5xl">event_busy</span>
        </div>
        <p className="text-white text-lg font-bold mb-2">No Bookings Yet</p>
        <p className="text-gray-400">Bookings will appear here once customers make reservations</p>
      </div>
    )
  }

  return (
    <div className="bg-[#1d2d25] rounded-lg p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">All Bookings ({filteredBookings.length})</h2>
        <div className="flex items-center gap-3">
          <label htmlFor="status-filter" className="text-gray-400 text-sm">Filter:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#12211a] border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-[#23a867] focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-gray-400 font-medium py-3 px-4">Customer</th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">Event</th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">Date & Time</th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">Guests</th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">Confirmation</th>
              <th className="text-left text-gray-400 font-medium py-3 px-4">Status</th>
              <th className="text-right text-gray-400 font-medium py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => {
              const sessionDate = new Date(booking.session_date)
              const event = booking.event
              
              return (
                <tr key={booking.id} className="border-b border-gray-800 hover:bg-[#12211a] transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-white font-medium">{booking.customer_name}</p>
                      <p className="text-gray-400 text-sm">{booking.customer_email}</p>
                      {booking.customer_phone && (
                        <p className="text-gray-400 text-xs">{booking.customer_phone}</p>
                      )}
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <p className="text-white text-sm font-medium">{event?.title || 'Event Not Found'}</p>
                    {event?.event_type && (
                      <p className="text-gray-400 text-xs">{event.event_type}</p>
                    )}
                  </td>
                  
                  <td className="py-4 px-4">
                    <p className="text-white text-sm">
                      {sessionDate.toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {booking.session_time?.slice(0, 5)}
                    </p>
                  </td>
                  
                  <td className="py-4 px-4">
                    <p className="text-white font-medium">{booking.number_of_guests || 1}</p>
                  </td>
                  
                  <td className="py-4 px-4">
                    <p className="text-white text-sm font-mono">{booking.confirmation_code || 'N/A'}</p>
                    {booking.total_price > 0 && (
                      <p className="text-gray-400 text-xs">${parseFloat(booking.total_price).toFixed(2)}</p>
                    )}
                  </td>
                  
                  <td className="py-4 px-4">
                    <button
                      onClick={() => {
                        const statuses = ['confirmed', 'cancelled', 'completed']
                        const currentIndex = statuses.indexOf(booking.status)
                        const nextStatus = statuses[(currentIndex + 1) % statuses.length]
                        handleStatusChange(booking.id, nextStatus)
                      }}
                      disabled={updating === booking.id}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        booking.status === 'confirmed'
                          ? 'bg-green-500 bg-opacity-20 text-green-400'
                          : booking.status === 'cancelled'
                          ? 'bg-red-500 bg-opacity-20 text-red-400'
                          : 'bg-blue-500 bg-opacity-20 text-blue-400'
                      } hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed`}
                      title={`Click to change status. Current: ${booking.status}`}
                    >
                      {updating === booking.id ? (
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        </span>
                      ) : (
                        booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Unknown'
                      )}
                    </button>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {booking.special_requests && (
                        <button
                          className="p-2 text-yellow-400 hover:bg-yellow-500 hover:bg-opacity-20 rounded transition-colors"
                          title={booking.special_requests}
                          onClick={() => alert(`Special Requests:\n\n${booking.special_requests}`)}
                        >
                          <span className="material-symbols-outlined text-xl">info</span>
                        </button>
                      )}
                      <a
                        href={`mailto:${booking.customer_email}?subject=Booking ${booking.confirmation_code}`}
                        className="p-2 text-blue-400 hover:bg-blue-500 hover:bg-opacity-20 rounded transition-colors"
                        title="Send Email"
                      >
                        <span className="material-symbols-outlined text-xl">email</span>
                      </a>
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
