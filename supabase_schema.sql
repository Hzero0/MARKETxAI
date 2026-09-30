
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(255) DEFAULT 'Startup Founder',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Startup Profile Table
CREATE TABLE IF NOT EXISTS public.startup_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name VARCHAR(255) DEFAULT '',
    tagline TEXT DEFAULT '',
    industry VARCHAR(100) DEFAULT '',
    stage VARCHAR(100) DEFAULT '',
    budget DECIMAL(12, 2) DEFAULT 0,
    brand_tone VARCHAR(100) DEFAULT 'Professional',
    target_location VARCHAR(255) DEFAULT '',
    website VARCHAR(255) DEFAULT '',
    target_audience TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Marketing Campaigns Table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    objective VARCHAR(255) DEFAULT 'Brand Awareness',
    status VARCHAR(50) DEFAULT 'Draft', -- Draft, Active, Paused, Completed
    platform VARCHAR(100) DEFAULT 'LinkedIn',
    budget DECIMAL(12, 2) DEFAULT 0,
    target_audience TEXT DEFAULT '',
    duration_days INT DEFAULT 30,
    metrics JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Competitor Profiles Table
CREATE TABLE IF NOT EXISTS public.competitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    website VARCHAR(255) DEFAULT '',
    market_share VARCHAR(50) DEFAULT '',
    strengths TEXT[] DEFAULT '{}',
    weaknesses TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Target Audience Segments Table
CREATE TABLE IF NOT EXISTS public.audience_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    segment_name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    demographics JSONB DEFAULT '{}'::jsonb,
    interests TEXT[] DEFAULT '{}',
    pain_points TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Generated / Saved AI Content Table
CREATE TABLE IF NOT EXISTS public.saved_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    platform VARCHAR(100) DEFAULT 'General',
    tone VARCHAR(100) DEFAULT 'Professional',
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures users can only view, edit, and delete their own data

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audience_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_content ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Startup Profiles Policies
CREATE POLICY "Users can view own startup profile" ON public.startup_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own startup profile" ON public.startup_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own startup profile" ON public.startup_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Campaigns Policies
CREATE POLICY "Users can view own campaigns" ON public.campaigns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own campaigns" ON public.campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own campaigns" ON public.campaigns FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own campaigns" ON public.campaigns FOR DELETE USING (auth.uid() = user_id);

-- Competitors Policies
CREATE POLICY "Users can view own competitors" ON public.competitors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own competitors" ON public.competitors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own competitors" ON public.competitors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own competitors" ON public.competitors FOR DELETE USING (auth.uid() = user_id);

-- Audience Segments Policies
CREATE POLICY "Users can view own audience segments" ON public.audience_segments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own audience segments" ON public.audience_segments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own audience segments" ON public.audience_segments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own audience segments" ON public.audience_segments FOR DELETE USING (auth.uid() = user_id);

-- Saved Content Policies
CREATE POLICY "Users can view own saved content" ON public.saved_content FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved content" ON public.saved_content FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved content" ON public.saved_content FOR DELETE USING (auth.uid() = user_id);

-- AUTOMATIC PROFILE CREATION TRIGGER ON USER SIGNUP

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
    );

    INSERT INTO public.startup_profiles (user_id, name)
    VALUES (new.id, 'My New Startup');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution setup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
