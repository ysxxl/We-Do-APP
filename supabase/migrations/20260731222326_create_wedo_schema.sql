/*
# We Do — Core schema (tasks, habits, habit logs, profiles)

## Overview
Creates the multi-user data model for the We Do to-do list & habit tracker app.
Every table is owner-scoped (user_id) and protected with RLS so each authenticated
user only sees their own rows. Owner columns default to auth.uid() so frontend
inserts that omit user_id still satisfy the WITH CHECK policy.

## New Tables

### profiles
- `id` (uuid, PK, references auth.users) — one row per user, created on signup
- `full_name` (text) — display name
- `goal` (text) — onboarding goal: kuliah | kerja | habit | semua
- `theme_preference` (text) — 'light' | 'dark'
- `language` (text, default 'id')
- `notif_task`, `notif_habit`, `notif_streak`, `notif_email` (booleans, defaults)
- `onboarded` (boolean, default false)
- `created_at` (timestamptz)

### tasks
- `id` (uuid, PK)
- `user_id` (uuid, NOT NULL DEFAULT auth.uid(), FK to auth.users, ON DELETE CASCADE)
- `title` (text, NOT NULL)
- `description` (text)
- `category` (text, NOT NULL) — 'daily' | 'weekly' | 'monthly'
- `deadline` (timestamptz, NOT NULL)
- `status` (text, NOT NULL default 'todo') — 'todo' | 'done'
- `priority` (text, NOT NULL default 'medium') — 'low' | 'medium' | 'high'
- `created_at` (timestamptz)

### habits
- `id` (uuid, PK)
- `user_id` (uuid, NOT NULL DEFAULT auth.uid(), FK to auth.users, ON DELETE CASCADE)
- `title` (text, NOT NULL)
- `frequency` (text, NOT NULL default 'daily') — 'daily' | 'weekly' | 'monthly'
- `color` (text, NOT NULL default 'brand')
- `streak` (integer, NOT NULL default 0)
- `best_streak` (integer, NOT NULL default 0)
- `created_at` (timestamptz)

### habit_logs
- `id` (uuid, PK)
- `habit_id` (uuid, NOT NULL, FK to habits ON DELETE CASCADE)
- `user_id` (uuid, NOT NULL DEFAULT auth.uid(), FK to auth.users ON DELETE CASCADE)
- `log_date` (date, NOT NULL) — the day the habit was completed
- `created_at` (timestamptz)
- UNIQUE(habit_id, log_date) — one log per habit per day

## Security
- RLS enabled on all tables.
- Owner-scoped CRUD on tasks, habits, habit_logs (auth.uid() = user_id).
- Profiles: user can read/update only their own profile row (id = auth.uid()).
- habit_logs additionally scoped via user_id column (denormalized for simple policy).

## Notes
1. user_id columns default to auth.uid() so client inserts omitting user_id succeed.
2. habit_logs has a unique constraint to prevent double-logging a habit on the same day.
3. Indexes added on user_id columns and tasks(deadline) for dashboard query performance.
*/

-- profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  goal text DEFAULT '',
  theme_preference text DEFAULT 'light',
  language text DEFAULT 'id',
  notif_task boolean DEFAULT true,
  notif_habit boolean DEFAULT true,
  notif_streak boolean DEFAULT true,
  notif_email boolean DEFAULT false,
  onboarded boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- tasks
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'daily',
  deadline timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'todo',
  priority text NOT NULL DEFAULT 'medium',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_tasks" ON tasks;
CREATE POLICY "select_own_tasks" ON tasks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_tasks" ON tasks;
CREATE POLICY "insert_own_tasks" ON tasks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_tasks" ON tasks;
CREATE POLICY "update_own_tasks" ON tasks FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_tasks" ON tasks;
CREATE POLICY "delete_own_tasks" ON tasks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);

-- habits
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  frequency text NOT NULL DEFAULT 'daily',
  color text NOT NULL DEFAULT 'brand',
  streak integer NOT NULL DEFAULT 0,
  best_streak integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_habits" ON habits;
CREATE POLICY "select_own_habits" ON habits FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_habits" ON habits;
CREATE POLICY "insert_own_habits" ON habits FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_habits" ON habits;
CREATE POLICY "update_own_habits" ON habits FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_habits" ON habits;
CREATE POLICY "delete_own_habits" ON habits FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);

-- habit_logs
CREATE TABLE IF NOT EXISTS habit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, log_date)
);
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_habit_logs" ON habit_logs;
CREATE POLICY "select_own_habit_logs" ON habit_logs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_habit_logs" ON habit_logs;
CREATE POLICY "insert_own_habit_logs" ON habit_logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_habit_logs" ON habit_logs;
CREATE POLICY "delete_own_habit_logs" ON habit_logs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id ON habit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);

-- Auto-create a profile row when a new auth.users row is inserted
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();