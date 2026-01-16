import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useEvents } from '../../hooks/useEvents'
import Header from '../Header'
import EventForm from './EventForm'
import EventList from './EventList'

export default function AdminPanel() {
  const { isAdmin, loading: authLoading } = useAuth()
  const { events, loading: eventsLoading, refetch } = useEvents()
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#12211a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  // Check if user is admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#12211a] flex items-center justify-center p-4">
        <div className="bg-[#1d2d25] rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <span className="material-symbols-outlined text-5xl">block</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">
            You don't have permission to access the admin panel.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-[#23a867] text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  const handleCreateNew = () => {
    setEditingEvent(null)
    setShowForm(true)
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingEvent(null)
    refetch() // Refresh events list
  }

  return (
    <div className="min-h-screen bg-[#12211a]">
      <Header />
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#1d2d25] rounded-lg p-6 mb-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
              <p className="text-gray-400">Manage events and bookings</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="bg-[#23a867] text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              Create New Event
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-[#1d2d25] rounded-lg p-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="bg-[#23a867] bg-opacity-20 p-3 rounded-lg">
                <span className="material-symbols-outlined text-[#23a867] text-3xl">event</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Events</p>
                <p className="text-white text-2xl font-bold">{events.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1d2d25] rounded-lg p-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                <span className="material-symbols-outlined text-blue-500 text-3xl">visibility</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Events</p>
                <p className="text-white text-2xl font-bold">
                  {events.filter(e => e.is_active).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1d2d25] rounded-lg p-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
                <span className="material-symbols-outlined text-purple-500 text-3xl">group</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Capacity</p>
                <p className="text-white text-2xl font-bold">
                  {events.reduce((sum, e) => sum + (e.capacity || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Event List */}
        <EventList
          events={events}
          loading={eventsLoading}
          onEdit={handleEdit}
          onRefresh={refetch}
        />

        {/* Event Form Modal */}
        {showForm && (
          <EventForm
            event={editingEvent}
            onClose={handleCloseForm}
            onSuccess={handleCloseForm}
          />
        )}
        </div>
      </div>
    </div>
  )
}
