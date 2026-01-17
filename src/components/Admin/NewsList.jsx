import { useState } from 'react';
import { useHeroNews } from '../../hooks/useHeroNews';

export default function NewsList({ news, loading, onEdit, onRefresh }) {
  const { deleteNews } = useHeroNews();
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (newsItem) => {
    if (!confirm(`Are you sure you want to delete "${newsItem.title}"?`)) {
      return;
    }

    setDeleting(newsItem.id);
    const { error } = await deleteNews(newsItem.id);
    
    if (error) {
      alert(`Failed to delete news: ${error}`);
    } else {
      onRefresh?.();
    }
    
    setDeleting(null);
  };

  if (loading) {
    return (
      <div className="bg-[#1d2d25] rounded-lg p-8 shadow-2xl">
        <div className="flex items-center justify-center">
          <div className="text-white">Loading news...</div>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="bg-[#1d2d25] rounded-lg p-8 shadow-2xl text-center">
        <div className="text-gray-400 mb-4">
          <span className="material-symbols-outlined text-6xl">newspaper</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No News Items Yet</h3>
        <p className="text-gray-400">Create your first news item to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1d2d25] rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Hero News Items</h2>
          <button
            onClick={onRefresh}
            className="text-[#23a867] hover:text-[#1d8854] transition-colors"
            title="Refresh"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>

      {/* News Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {news.map((newsItem) => (
            <div
              key={newsItem.id}
              className="bg-[var(--background-dark)] rounded-lg overflow-hidden border border-white/5 hover:border-white/10 transition-colors"
            >
              {/* Image */}
              <div 
                className="w-full aspect-video bg-cover bg-center relative"
                style={{ backgroundImage: `url("${newsItem.image_url}")` }}
              >
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-full ${
                      newsItem.is_active
                        ? 'bg-green-500/20 text-green-500 border border-green-500/40'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/40'
                    }`}
                  >
                    {newsItem.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {/* Position Badge */}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 text-xs font-bold rounded-full bg-[#23a867]/20 text-[#23a867] border border-[#23a867]/40">
                    #{newsItem.position}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
                  {newsItem.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {newsItem.alt_text}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(newsItem)}
                    className="flex-1 px-3 py-1.5 bg-[#23a867] hover:bg-[#1d8854] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(newsItem)}
                    disabled={deleting === newsItem.id}
                    className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-500 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting === newsItem.id ? (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <span className="material-symbols-outlined text-base">delete</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="px-4 pb-4 text-xs text-gray-500">
                <div>Created: {new Date(newsItem.created_at).toLocaleDateString()}</div>
                {newsItem.updated_at !== newsItem.created_at && (
                  <div>Updated: {new Date(newsItem.updated_at).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
