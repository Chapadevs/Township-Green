# Hero News Management System

## Overview

The Hero News Management System allows administrators to manage the "What's happening" section on the homepage. This system uses Supabase for data storage and image hosting, providing a complete content management solution.

## Features

### 🎯 Core Functionality

1. **Database Storage**: All news items stored in Supabase `hero_news` table
2. **Image Upload**: Direct file upload to Supabase storage bucket
3. **Admin Panel Integration**: Full CRUD operations through admin interface
4. **Real-time Updates**: Changes immediately reflected on homepage
5. **Position Control**: Order news items by position
6. **Active/Inactive Toggle**: Control visibility without deletion

## Database Schema

### Table: `hero_news`

```sql
CREATE TABLE hero_news (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  alt_text TEXT NOT NULL,
  image_url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

### Storage Bucket: `hero-news`

- **Public Access**: Yes
- **File Size Limit**: 5MB
- **Allowed Types**: JPEG, PNG, WebP, GIF
- **Path Structure**: `{random-id}-{timestamp}.{ext}`

## Row Level Security (RLS)

### Public Access
- ✅ Anyone can view **active** news items
- ✅ Public bucket for image access

### Admin Access
- ✅ View all news (including inactive)
- ✅ Create new news items
- ✅ Update existing news items
- ✅ Delete news items
- ✅ Upload/delete images

## Usage Guide

### For Administrators

#### Accessing News Management

1. Login to admin panel at `/admin`
2. Click on **"Hero News"** tab
3. View all existing news items

#### Creating New News

1. Click **"Create New News"** button
2. Fill in the form:
   - **Image**: Click "Choose Image" and select a file
   - **Title**: Enter a catchy title (e.g., "Puff n Paint")
   - **Description**: Add alt text for accessibility
   - **Position**: Set display order (0 = first)
   - **Active**: Toggle visibility
3. Click **"Create News"**
4. Image uploads to Supabase automatically
5. News appears on homepage immediately

#### Editing Existing News

1. Find the news item in the grid
2. Click **"Edit"** button
3. Modify any fields
4. Upload new image (optional)
5. Click **"Update News"**

#### Deleting News

1. Find the news item
2. Click the **trash icon** button
3. Confirm deletion
4. Image automatically removed from storage

### For Developers

#### Using the Hook

```javascript
import { useHeroNews } from '../hooks/useHeroNews';

function MyComponent() {
  const {
    news,           // Array of news items
    loading,        // Loading state
    error,          // Error message
    refetch,        // Refresh news list
    createNews,     // Create new news
    updateNews,     // Update existing news
    deleteNews,     // Delete news
    uploadImage,    // Upload image to storage
    deleteImage     // Delete image from storage
  } = useHeroNews();

  // Display news
  return (
    <div>
      {news.map(item => (
        <div key={item.id}>
          <img src={item.image_url} alt={item.alt_text} />
          <h3>{item.title}</h3>
        </div>
      ))}
    </div>
  );
}
```

#### Creating News Programmatically

```javascript
const { createNews, uploadImage } = useHeroNews();

// Upload image first
const { data: uploadData, error: uploadError } = await uploadImage(imageFile);

// Create news item
const { data, error } = await createNews({
  title: "Comedy Night",
  alt_text: "A comedian performing on stage",
  image_url: uploadData.url,
  position: 1,
  is_active: true
});
```

#### Updating News

```javascript
const { updateNews } = useHeroNews();

await updateNews(newsId, {
  title: "Updated Title",
  is_active: false
});
```

## File Structure

```
src/
├── hooks/
│   └── useHeroNews.js          # Main hook for news management
├── components/
│   ├── Admin/
│   │   ├── AdminPanel.jsx      # Main admin interface (updated)
│   │   ├── NewsForm.jsx        # Create/edit news form
│   │   └── NewsList.jsx        # Display news grid
│   └── Hero.jsx                # Homepage hero (updated to fetch news)
└── lib/
    └── supabaseClient.js       # Supabase client

supabase/
└── migrations/
    ├── create_hero_news.sql           # Database table
    └── create_hero_images_storage.sql # Storage bucket
```

## Components

### NewsForm Component

**Props:**
- `news` (object|null): News item to edit, or null for new
- `onClose` (function): Callback when form closes
- `onSuccess` (function): Callback on successful save

**Features:**
- File upload with preview
- Form validation
- Loading states
- Error handling
- Image size/type validation

### NewsList Component

**Props:**
- `news` (array): Array of news items
- `loading` (boolean): Loading state
- `onEdit` (function): Callback when edit clicked
- `onRefresh` (function): Callback to refresh list

**Features:**
- Grid layout (responsive)
- Active/inactive badges
- Position indicators
- Quick edit/delete actions
- Metadata display

## API Reference

### useHeroNews Hook

#### Methods

**fetchNews()**
- Fetches only active news items
- Ordered by position (ascending)
- Used on public homepage

**fetchAllNews()**
- Fetches all news items (including inactive)
- Used in admin panel

**createNews(newsData)**
```javascript
{
  title: string,
  alt_text: string,
  image_url: string,
  position: number,
  is_active: boolean
}
```

**updateNews(id, updates)**
```javascript
{
  title?: string,
  alt_text?: string,
  image_url?: string,
  position?: number,
  is_active?: boolean
}
```

**deleteNews(id)**
- Removes news item from database
- Does NOT automatically delete image (manual cleanup needed)

**uploadImage(file)**
- Returns: `{ data: { path, url }, error }`
- Validates file type and size
- Generates unique filename
- Uploads to `hero-news` bucket

**deleteImage(filePath)**
- Removes image from storage
- Use when deleting news or updating image

## Migration Guide

### Setting Up the Database

1. **Run Migration Scripts**

```bash
# Connect to your Supabase project
supabase db push

# Or manually run the SQL files
# In Supabase Dashboard > SQL Editor:
# - Copy contents of create_hero_news.sql
# - Execute
# - Copy contents of create_hero_images_storage.sql
# - Execute
```

2. **Create Storage Bucket (if not auto-created)**

Go to Supabase Dashboard > Storage:
- Click "New bucket"
- Name: `hero-news`
- Public: ✅ Yes
- File size limit: 5242880 (5MB)
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

3. **Verify RLS Policies**

Check that all policies are created:
- Anyone can view active news
- Admins can manage all news
- Anyone can view images
- Admins can upload/delete images

### Migrating Existing Data

If you have existing hardcoded news items:

```sql
-- Insert existing items
INSERT INTO hero_news (title, alt_text, image_url, position) VALUES
  ('Puff n Paint', 'A group of people painting on canvases', '/assets/hero-images/1.png', 1),
  ('Comedy Night', 'A comedian performing on stage', '/assets/hero-images/2.png', 2),
  ('Tattoo Artists', 'A tattoo artist working on a client', '/assets/hero-images/3.png', 3),
  ('Bachelorette Parties', 'Friends celebrating', '/assets/hero-images/4.png', 4);
```

## Best Practices

### Image Guidelines

1. **Optimal Dimensions**: 1920x1080 (16:9 aspect ratio)
2. **File Size**: Keep under 2MB for best performance
3. **Format**: Use WebP for best compression, fallback to PNG/JPEG
4. **Alt Text**: Write descriptive text for accessibility and SEO

### Content Management

1. **Position Numbers**: Use increments of 10 (10, 20, 30) for easier reordering
2. **Active Status**: Use instead of deleting to preserve content
3. **Regular Cleanup**: Remove old inactive news items periodically
4. **Image Cleanup**: Delete old images when uploading new ones

### Performance

1. **Limit News Items**: Keep to 4-8 items for optimal display
2. **Compress Images**: Use tools like TinyPNG before uploading
3. **Cache Strategy**: News data cached in component state
4. **Lazy Loading**: Images load as needed

## Troubleshooting

### Images Not Displaying

**Problem**: News items show but images are broken

**Solutions**:
1. Check storage bucket is public
2. Verify image URL is complete
3. Check RLS policies on storage
4. Ensure bucket name is `hero-news`

### Upload Failing

**Problem**: Image upload returns error

**Solutions**:
1. Check file size (< 5MB)
2. Verify file type (JPEG, PNG, WebP, GIF)
3. Ensure admin permissions
4. Check storage bucket exists

### News Not Appearing

**Problem**: News created but not showing on homepage

**Solutions**:
1. Check `is_active` is true
2. Verify news has valid image_url
3. Check browser console for errors
4. Refresh the page

### Permission Denied

**Problem**: "Permission denied" when creating/editing

**Solutions**:
1. Verify user is logged in
2. Check user profile has `role = 'admin'`
3. Verify RLS policies are created
4. Check authentication token is valid

## Security Considerations

### Input Validation

- ✅ Title: Max 255 characters
- ✅ Alt text: Required, no length limit
- ✅ Image: Type and size validated
- ✅ Position: Must be integer

### File Upload Security

- ✅ MIME type validation
- ✅ File size limit (5MB)
- ✅ Unique filename generation
- ✅ Admin-only upload

### SQL Injection Protection

- ✅ Using Supabase parameterized queries
- ✅ All inputs sanitized automatically

## Testing Checklist

### Admin Panel
- [ ] Can access Hero News tab
- [ ] Can see news statistics
- [ ] Can view all news items
- [ ] Create button opens form

### Creating News
- [ ] Form opens correctly
- [ ] Can select image file
- [ ] Image preview shows
- [ ] All fields validate
- [ ] Upload shows progress
- [ ] Success message appears
- [ ] New news appears in grid

### Editing News
- [ ] Edit button opens form
- [ ] Form pre-fills with data
- [ ] Can update all fields
- [ ] Can change image
- [ ] Changes save correctly
- [ ] Grid updates immediately

### Deleting News
- [ ] Delete button prompts confirmation
- [ ] Item removes from grid
- [ ] Database updated

### Homepage Display
- [ ] News items appear
- [ ] Images load correctly
- [ ] Correct order (by position)
- [ ] Only active items show
- [ ] Responsive on mobile

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Storage Guide**: https://supabase.com/docs/guides/storage
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: ✅ Production Ready
