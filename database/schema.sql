-- Supabase Database Schema for Robot Control System
-- Run these SQL commands in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create robots table
CREATE TABLE IF NOT EXISTS public.robots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'general',
    location TEXT,
    status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'maintenance', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create robot_status table for real-time data
CREATE TABLE IF NOT EXISTS public.robot_status (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    robot_id UUID REFERENCES public.robots(id) ON DELETE CASCADE,
    battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100),
    temperature DECIMAL(5,2),
    position JSONB,
    speed DECIMAL(8,2),
    network_quality INTEGER CHECK (network_quality >= 0 AND network_quality <= 100),
    cpu_usage DECIMAL(5,2),
    memory_usage DECIMAL(5,2),
    disk_usage DECIMAL(5,2),
    uptime_hours INTEGER DEFAULT 0,
    distance_traveled DECIMAL(10,2) DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    robot_id UUID REFERENCES public.robots(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('critical', 'warning', 'info', 'maintenance')),
    title TEXT NOT NULL,
    message TEXT,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    is_read BOOLEAN DEFAULT FALSE,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create maintenance_logs table
CREATE TABLE IF NOT EXISTS public.maintenance_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    robot_id UUID REFERENCES public.robots(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('scheduled', 'emergency', 'diagnostic', 'repair', 'upgrade')),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics_data table
CREATE TABLE IF NOT EXISTS public.analytics_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    robot_id UUID REFERENCES public.robots(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(10,2),
    unit TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table for additional user info
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'technician')),
    department TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.robots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.robot_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users can only access their own robots
CREATE POLICY "Users can view own robots" ON public.robots
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own robots" ON public.robots
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own robots" ON public.robots
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only access robot status for their robots
CREATE POLICY "Users can view own robot status" ON public.robot_status
    FOR SELECT USING (
        robot_id IN (
            SELECT id FROM public.robots WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert robot status for own robots" ON public.robot_status
    FOR INSERT WITH CHECK (
        robot_id IN (
            SELECT id FROM public.robots WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update robot status for own robots" ON public.robot_status
    FOR UPDATE USING (
        robot_id IN (
            SELECT id FROM public.robots WHERE user_id = auth.uid()
        )
    );

-- Users can only access their own alerts
CREATE POLICY "Users can view own alerts" ON public.alerts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts" ON public.alerts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" ON public.alerts
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only access their own maintenance logs
CREATE POLICY "Users can view own maintenance logs" ON public.maintenance_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own maintenance logs" ON public.maintenance_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own maintenance logs" ON public.maintenance_logs
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only access analytics for their robots
CREATE POLICY "Users can view own analytics data" ON public.analytics_data
    FOR SELECT USING (
        robot_id IN (
            SELECT id FROM public.robots WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert analytics data for own robots" ON public.analytics_data
    FOR INSERT WITH CHECK (
        robot_id IN (
            SELECT id FROM public.robots WHERE user_id = auth.uid()
        )
    );

-- Users can access their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_robots_user_id ON public.robots(user_id);
CREATE INDEX IF NOT EXISTS idx_robot_status_robot_id ON public.robot_status(robot_id);
CREATE INDEX IF NOT EXISTS idx_robot_status_updated_at ON public.robot_status(updated_at);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_robot_id ON public.alerts(robot_id);
CREATE INDEX IF NOT EXISTS idx_alerts_is_read ON public.alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_robot_id ON public.maintenance_logs(robot_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_user_id ON public.maintenance_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_data_robot_id ON public.analytics_data(robot_id);
CREATE INDEX IF NOT EXISTS idx_analytics_data_recorded_at ON public.analytics_data(recorded_at);

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamps
CREATE TRIGGER update_robots_updated_at BEFORE UPDATE ON public.robots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
-- Note: Replace 'your-user-id' with actual user ID after user registration

-- INSERT INTO public.robots (user_id, name, type, location, status) VALUES
-- ('your-user-id', 'Robot Alpha', 'delivery', 'Building A - Floor 1', 'online'),
-- ('your-user-id', 'Robot Beta', 'security', 'Building A - Floor 2', 'online'),
-- ('your-user-id', 'Robot Gamma', 'cleaning', 'Building B - Floor 1', 'maintenance');

-- End of Schema
