-- Supabase Database Schema for GL Bajaj Alumni Connect

-- 1. Create Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'alumni', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  roll_number TEXT UNIQUE NOT NULL,
  branch TEXT NOT NULL,
  batch_year TEXT NOT NULL,
  academic_info TEXT,
  skills TEXT[] DEFAULT '{}',
  interests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Alumni table
CREATE TABLE IF NOT EXISTS public.alumni (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  roll_number TEXT UNIQUE NOT NULL,
  branch TEXT NOT NULL,
  batch_year TEXT NOT NULL,
  current_company TEXT,
  current_designation TEXT,
  industry TEXT,
  location TEXT,
  skills TEXT[] DEFAULT '{}',
  bio TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  website_url TEXT,
  is_available_for_mentorship BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  career_history JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  department TEXT DEFAULT 'Dean Alumni Relations',
  designation TEXT DEFAULT 'Administrator',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Notices table
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  target_audience TEXT DEFAULT 'all',
  published_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  venue TEXT,
  category TEXT NOT NULL,
  rsvps TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create Achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alumni_id UUID REFERENCES public.alumni(id) ON DELETE CASCADE,
  alumni_name TEXT NOT NULL,
  alumni_batch TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  media_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Create Mentorship Requests table
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_roll TEXT NOT NULL,
  student_branch TEXT,
  alumni_id UUID REFERENCES public.alumni(id) ON DELETE CASCADE,
  alumni_name TEXT NOT NULL,
  topic TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  response_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Create Messages table (Real-time Chat)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentorship_id UUID REFERENCES public.mentorship_requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Opportunities table (Jobs & Internships)
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  posted_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('Full-time', 'Internship', 'Referral')),
  location TEXT NOT NULL,
  description TEXT,
  apply_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- 12. Permissive RLS Policies for authenticated users
CREATE POLICY "Public profiles are viewable by authenticated users" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Students directory viewable by authenticated" ON public.students FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Students can update own record" ON public.students FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Alumni directory viewable by authenticated" ON public.alumni FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Alumni can update own record" ON public.alumni FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Notices viewable by authenticated" ON public.notices FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Events viewable by authenticated" ON public.events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Achievements viewable by authenticated" ON public.achievements FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Opportunities viewable by authenticated" ON public.opportunities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Mentorship requests viewable by participants" ON public.mentorship_requests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Messages viewable by participants" ON public.messages FOR ALL USING (auth.role() = 'authenticated');
