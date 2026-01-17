import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useEvents } from '../../hooks/useEvents'
import { useHeroNews } from '../../hooks/useHeroNews'
import { useHeroCarousel } from '../../hooks/useHeroCarousel'
import Header from '../Header'
import EventForm from './EventForm'
import EventList from './EventList'
import NewsForm from './NewsForm'
import NewsList from './NewsList'
import CarouselForm from './CarouselForm'
import CarouselList from './CarouselList'

export default function AdminPanel() {
  const { isAdmin, loading: authLoading } = useAuth()
  const { events, loading: eventsLoading, refetch } = useEvents()
  const { news, loading: newsLoading, fetchAllNews } = useHeroNews()
  const { carouselImages, loading: carouselLoading, fetchAllCarouselImages } = useHeroCarousel()
  const [activeTab, setActiveTab] = useState('events') // 'events', 'news', or 'carousel'
  const [showForm, setShowForm] = useState(false)
  const [showNewsForm, setShowNewsForm] = useState(false)
  const [showCarouselForm, setShowCarouselForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [editingNews, setEditingNews] = useState(null)
  const [editingCarousel, setEditingCarousel] = useState(null)

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

  const handleCreateNews = () => {
    setEditingNews(null)
    setShowNewsForm(true)
  }

  const handleEditNews = (newsItem) => {
    setEditingNews(newsItem)
    setShowNewsForm(true)
  }

  const handleCloseNewsForm = () => {
    setShowNewsForm(false)
    setEditingNews(null)
    fetchAllNews() // Refresh news list
  }

  const handleCreateCarousel = () => {
    setEditingCarousel(null)
    setShowCarouselForm(true)
  }

  const handleEditCarousel = (image) => {
    setEditingCarousel(image)
    setShowCarouselForm(true)
  }

  const handleCloseCarouselForm = () => {
    setShowCarouselForm(false)
    setEditingCarousel(null)
    fetchAllCarouselImages() // Refresh carousel list
  }

  return (
    <div className="min-h-screen bg-[#12211a]">
      <Header />
      <div className="pt-24 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#1d2d25] rounded-lg p-6 mb-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
              <p className="text-gray-400">Manage events, news, carousel, and bookings</p>
            </div>
            <button
              onClick={() => {
                if (activeTab === 'events') handleCreateNew();
                else if (activeTab === 'news') handleCreateNews();
                else if (activeTab === 'carousel') handleCreateCarousel();
              }}
              className="bg-[#23a867] text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              {activeTab === 'events' ? 'Create New Event' : activeTab === 'news' ? 'Create News' : 'Create New Slide'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#1d2d25] rounded-lg mb-6 shadow-2xl overflow-hidden">
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 px-6 py-4 font-bold transition-colors ${
                activeTab === 'events'
                  ? 'bg-[#23a867] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">event</span>
                Events
              </div>
            </button>
            <button
              onClick={() => setActiveTab('carousel')}
              className={`flex-1 px-6 py-4 font-bold transition-colors ${
                activeTab === 'carousel'
                  ? 'bg-[#23a867] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">view_carousel</span>
                Hero Carousel
              </div>
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 px-6 py-4 font-bold transition-colors ${
                activeTab === 'news'
                  ? 'bg-[#23a867] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">newspaper</span>
                Hero News
              </div>
            </button>
          </div>
        </div>

        {/* Stats Cards - Events */}
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

            <div className="bg-[#1d2d25] rounded-lg p-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                  <span className="material-symbols-outlined text-green-500 text-3xl">event_available</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Available Seats</p>
                  <p className="text-white text-2xl font-bold">
                    {events.reduce((sum, e) => {
                      const capacity = e.capacity || 0;
                      const booked = e.booked_seats || 0;
                      return sum + Math.max(0, capacity - booked);
                    }, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards - Carousel */}
        {activeTab === 'carousel' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-[#1d2d25] rounded-lg p-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="bg-[#23a867] bg-opacity-20 p-3 rounded-lg">
                  <span className="material-symbols-outlined text-[#23a867] text-3xl">view_carousel</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Slides</p>
                  <p className="text-white text-2xl font-bold">{carouselImages.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1d2d25] rounded-lg p-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <span className="material-symbols-outlined text-blue-500 text-3xl">visibility</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Slides</p>
                  <p className="text-white text-2xl font-bold">
                    {carouselImages.filter(c => c.is_active).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1d2d25] rounded-lg p-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
                  <span className="material-symbols-outlined text-purple-500 text-3xl">image</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Published</p>
                  <p className="text-white text-2xl font-bold">
                    {carouselImages.filter(c => c.is_active).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards - News */}
        {activeTab === 'news' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-[#1d2d25] rounded-lg p-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="bg-[#23a867] bg-opacity-20 p-3 rounded-lg">
                  <span className="material-symbols-outlined text-[#23a867] text-3xl">newspaper</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total News</p>
                  <p className="text-white text-2xl font-bold">{news.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1d2d25] rounded-lg p-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                  <span className="material-symbols-outlined text-blue-500 text-3xl">visibility</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active News</p>
                  <p className="text-white text-2xl font-bold">
                    {news.filter(n => n.is_active).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1d2d25] rounded-lg p-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
                  <span className="material-symbols-outlined text-purple-500 text-3xl">image</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Published</p>
                  <p className="text-white text-2xl font-bold">
                    {news.filter(n => n.is_active).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event List */}
        {activeTab === 'events' && (
          <EventList
            events={events}
            loading={eventsLoading}
            onEdit={handleEdit}
            onRefresh={refetch}
          />
        )}

        {/* Carousel List */}
        {activeTab === 'carousel' && (
          <CarouselList
            carouselImages={carouselImages}
            loading={carouselLoading}
            onEdit={handleEditCarousel}
            onRefresh={fetchAllCarouselImages}
          />
        )}

        {/* News List */}
        {activeTab === 'news' && (
          <NewsList
            news={news}
            loading={newsLoading}
            onEdit={handleEditNews}
            onRefresh={fetchAllNews}
          />
        )}

        {/* Event Form Modal */}
        {showForm && (
          <EventForm
            event={editingEvent}
            onClose={handleCloseForm}
            onSuccess={handleCloseForm}
          />
        )}

        {/* Carousel Form Modal */}
        {showCarouselForm && (
          <CarouselForm
            carouselImage={editingCarousel}
            onClose={handleCloseCarouselForm}
            onSuccess={handleCloseCarouselForm}
          />
        )}

        {/* News Form Modal */}
        {showNewsForm && (
          <NewsForm
            news={editingNews}
            onClose={handleCloseNewsForm}
            onSuccess={handleCloseNewsForm}
          />
        )}
        </div>
      </div>
    </div>
  )
}
