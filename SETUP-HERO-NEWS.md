# Quick Setup Guide - Hero News Management

This guide will help you set up the Hero News Management system for Township Green.

## 📋 Prerequisites

- ✅ Supabase project created
- ✅ Admin user created with `role = 'admin'`
- ✅ Environment variables configured

## 🚀 Setup Steps

### Step 1: Run Database Migrations

You have two options:

#### Option A: Using Supabase CLI (Recommended)

```bash
# Make sure you're in the project directory
cd Township-Green

# Link to your Supabase project (if not already linked)
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

#### Option B: Manual SQL Execution

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor**
4. Run these files in order:

**First: Create hero_news table**
```sql
-- Copy and run entire contents of:
supabase/migrations/create_hero_news.sql
```

**Second: Create storage bucket**
```sql
-- Copy and run entire contents of:
supabase/migrations/create_hero_images_storage.sql
```

### Step 2: Verify Database Setup

In Supabase Dashboard:

1. **Check Table**:
   - Go to **Table Editor**
   - Look for `hero_news` table
   - Should have 4 default news items

2. **Check Storage**:
   - Go to **Storage**
   - Look for `hero-news` bucket
   - Should be marked as "Public"

3. **Check RLS Policies**:
   - Go to **Authentication** > **Policies**
   - Verify policies for `hero_news` table
   - Verify policies for `storage.objects` (hero-news bucket)

### Step 3: Test Admin Access

1. **Login as Admin**:
   ```
   Navigate to: http://localhost:5173/admin
   Login with your admin credentials
   ```

2. **Access Hero News**:
   - Click on **"Hero News"** tab
   - You should see the default news items

3. **Test Create**:
   - Click **"Create New News"**
   - Upload a test image
   - Fill in title and description
   - Click "Create News"
   - Verify it appears in the grid

### Step 4: Test Homepage Display

1. Navigate to homepage: `http://localhost:5173/`
2. Scroll to **"What's happening"** section
3. Verify news items display correctly
4. Check images load properly

## 🔧 Configuration

### Environment Variables

Make sure your `.env` file has:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Storage Bucket Configuration

If you need to manually configure the storage bucket:

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Settings:
   - **Name**: `hero-news`
   - **Public**: ✅ Enabled
   - **File size limit**: 5242880 (5MB)
   - **Allowed MIME types**: 
     - `image/jpeg`
     - `image/jpg`
     - `image/png`
     - `image/webp`
     - `image/gif`

## ✅ Verification Checklist

### Database
- [ ] `hero_news` table exists
- [ ] Table has 4 default entries
- [ ] RLS policies created for `hero_news`
- [ ] Triggers set up (updated_at)

### Storage
- [ ] `hero-news` bucket exists
- [ ] Bucket is public
- [ ] RLS policies created for storage
- [ ] File size limit set to 5MB
- [ ] MIME types configured

### Admin Panel
- [ ] Can access `/admin` page
- [ ] "Hero News" tab visible
- [ ] Can see news statistics
- [ ] Can view news grid
- [ ] "Create New News" button works

### Functionality
- [ ] Can create new news item
- [ ] Can upload images
- [ ] Can edit existing news
- [ ] Can delete news items
- [ ] Changes reflect on homepage immediately

## 🐛 Common Issues

### Issue: "Table does not exist"

**Solution**: Run the migrations again
```bash
supabase db push
```

### Issue: "Permission denied for table hero_news"

**Solution**: Check RLS policies
1. Go to Authentication > Policies
2. Verify policies exist for `hero_news`
3. Make sure your user has `role = 'admin'` in profiles table

### Issue: "Storage bucket not found"

**Solution**: Create bucket manually
1. Go to Storage in Supabase Dashboard
2. Create new bucket named `hero-news`
3. Make it public
4. Run storage migration SQL

### Issue: Images not uploading

**Solution**: Check storage policies
```sql
-- Verify admin can upload
SELECT * FROM storage.objects 
WHERE bucket_id = 'hero-news';

-- Check policies
SELECT * FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%hero%';
```

### Issue: News not appearing on homepage

**Solution**: 
1. Check `is_active = true` in database
2. Verify image_url is not null
3. Check browser console for errors
4. Hard refresh the page (Ctrl+Shift+R)

## 📚 Next Steps

1. **Upload Your Images**: 
   - Go to admin panel
   - Upload actual event images
   - Update titles and descriptions

2. **Customize Display**:
   - Adjust positions for ordering
   - Toggle active/inactive status
   - Add more news items

3. **Test on Mobile**:
   - Check responsive display
   - Verify images look good
   - Test admin panel on mobile

4. **Production Deployment**:
   - Run migrations on production Supabase
   - Update environment variables
   - Test everything in production

## 🎯 Usage Tips

### Best Image Practices
- **Size**: 1920x1080 pixels (16:9)
- **Format**: WebP or PNG
- **File Size**: Under 2MB
- **Compression**: Use TinyPNG before upload

### Content Guidelines
- **Titles**: Keep short (2-4 words)
- **Alt Text**: Be descriptive for accessibility
- **Position**: Use 10, 20, 30... for easy reordering
- **Active Status**: Use to hide without deleting

### Maintenance
- Review news items monthly
- Remove outdated content
- Update images seasonally
- Keep total items under 8 for best UX

## 📞 Support

If you encounter issues:

1. Check the main documentation: `HERO-NEWS-MANAGEMENT.md`
2. Review Supabase logs in Dashboard
3. Check browser console for errors
4. Verify RLS policies are correct

## 🎉 Success!

If all checklist items are completed, your Hero News Management system is ready!

You can now:
- ✅ Manage news through admin panel
- ✅ Upload images directly
- ✅ Control what appears on homepage
- ✅ Update content anytime

---

**Setup Complete!** 🚀

Now you can manage your homepage news content without touching code!
