-- Create the tasks table
CREATE TABLE public.tasks (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    estimated_minutes integer NOT NULL,
    actual_minutes integer NOT NULL DEFAULT 0,
    completed boolean NOT NULL DEFAULT false,
    category text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    completed_at timestamp with time zone,
    CONSTRAINT tasks_pkey PRIMARY KEY (id),
    CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Allow users to manage their own tasks"
ON public.tasks
FOR ALL
TO authenticated
USING (auth.uid() = user_id);
