import { useState } from 'react';
import { useAdminBlogPosts } from '../../hooks/useAdminBlogPosts';

export default function BlogPostList({ posts, loading, onEdit, onRefresh }) {
  const { deletePost, togglePostStatus } = useAdminBlogPosts();
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);

  const handleDelete = async (post) => {
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) {
      return;
    }

    setDeleting(post.id);
    const { error } = await deletePost(post.id);
    
    if (error) {
      alert(`Failed to delete post: ${error.message || error}`);
    } else {
      onRefresh?.();
    }
    
    setDeleting(null);
  };

  const handleToggleStatus = async (post) => {
    setToggling(post.id);
    const { error } = await togglePostStatus(post.id, post.published);
    
    if (error) {
      alert(`Failed to update post status: ${error.message || error}`);
    } else {
      onRefresh?.();
    }
    
    setToggling(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getExcerpt = (content, maxLength = 100) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <div className="bg-[#1d2d25] rounded-lg p-8 shadow-2xl">
        <div className="flex items-center justify-center">
          <div className="text-white">Loading blog posts...</div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-[#1d2d25] rounded-lg p-8 shadow-2xl text-center">
        <div className="text-gray-400 mb-4">
          <span className="material-symbols-outlined text-6xl">article</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Blog Posts Yet</h3>
        <p className="text-gray-400">Create your first blog post to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1d2d25] rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">All Blog Posts ({posts.length})</h2>
          <button
            onClick={onRefresh}
            className="text-[#23a867] hover:text-[#1d8854] transition-colors"
            title="Refresh"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="divide-y divide-white/10">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-6 hover:bg-white/5 transition-colors"
          >
            <div className="flex gap-6">
              {/* Image Thumbnail */}
              {post.image_url && (
                <div className="flex-shrink-0">
                  <div 
                    className="w-32 h-32 rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url("${post.image_url}")` }}
                  ></div>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-1">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {getExcerpt(post.content)}
                    </p>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleToggleStatus(post)}
                      disabled={toggling === post.id}
                      className={`px-3 py-1 text-xs font-bold rounded-full transition-colors disabled:opacity-50 ${
                        post.published
                          ? 'bg-green-500/20 text-green-500 border border-green-500/40 hover:bg-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/40 hover:bg-gray-500/30'
                      }`}
                    >
                      {toggling === post.id ? '...' : post.published ? 'Published' : 'Draft'}
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span>Created: {formatDate(post.created_at)}</span>
                  {post.updated_at !== post.created_at && (
                    <span>Updated: {formatDate(post.updated_at)}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(post)}
                    className="px-4 py-2 bg-[#23a867] hover:bg-[#1d8854] text-white font-bold rounded-lg transition-colors flex items-center gap-2 text-sm"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post)}
                    disabled={deleting === post.id}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    {deleting === post.id ? (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <span className="material-symbols-outlined text-base">delete</span>
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
