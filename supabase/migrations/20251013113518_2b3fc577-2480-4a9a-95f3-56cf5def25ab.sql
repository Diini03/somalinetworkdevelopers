-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Policies for user_roles (users can view their own roles)
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Create candidates table
CREATE TABLE public.candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  photo text NOT NULL,
  skills text[] NOT NULL,
  expected_salary_min integer NOT NULL,
  expected_salary_max integer NOT NULL,
  location text NOT NULL,
  qualification text NOT NULL,
  bio text NOT NULL,
  email text NOT NULL,
  linkedin text,
  github text,
  portfolio text,
  experience text NOT NULL,
  availability text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on candidates
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Everyone can view candidates
CREATE POLICY "Anyone can view candidates"
ON public.candidates
FOR SELECT
USING (true);

-- Only admins can insert candidates
CREATE POLICY "Admins can insert candidates"
ON public.candidates
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update candidates
CREATE POLICY "Admins can update candidates"
ON public.candidates
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete candidates
CREATE POLICY "Admins can delete candidates"
ON public.candidates
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updating updated_at
CREATE TRIGGER update_candidates_updated_at
BEFORE UPDATE ON public.candidates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert 2 sample candidates
INSERT INTO public.candidates (name, title, photo, skills, expected_salary_min, expected_salary_max, location, qualification, bio, email, linkedin, github, portfolio, experience, availability)
VALUES 
(
  'Sarah Johnson',
  'Senior Full Stack Developer',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
  80000,
  120000,
  'San Francisco, CA',
  'Bachelor in Computer Science',
  'Passionate full-stack developer with 5+ years of experience building scalable web applications.',
  'sarah.johnson@example.com',
  'https://linkedin.com/in/sarahjohnson',
  'https://github.com/sarahjohnson',
  'https://sarahjohnson.dev',
  '5 years',
  'Available immediately'
),
(
  'Michael Chen',
  'Frontend Developer',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  ARRAY['React', 'Vue.js', 'CSS', 'JavaScript'],
  60000,
  90000,
  'New York, NY',
  'Bachelor in Web Design',
  'Creative frontend developer focused on creating beautiful user experiences.',
  'michael.chen@example.com',
  'https://linkedin.com/in/michaelchen',
  'https://github.com/michaelchen',
  'https://michaelchen.com',
  '3 years',
  'Available in 2 weeks'
);