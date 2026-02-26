-- SQL para crear las tablas en Supabase
-- Ejecutar en el SQL Editor de Supabase: https://supabase.com/dashboard/project/gsidmhliqzyntcjwzasg/sql/new

CREATE TABLE IF NOT EXISTS public.ortopedas_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  country TEXT NOT NULL,
  specialty TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ortopedas_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES public.ortopedas_participants(id) ON DELETE CASCADE,
  q3 INTEGER, q4 INTEGER, q5 INTEGER, q6 INTEGER, q7 INTEGER,
  q8 INTEGER, q9 INTEGER, q10 INTEGER, q11 INTEGER, q12 INTEGER,
  q13 INTEGER, q14 INTEGER, q15 INTEGER, q16 INTEGER, q17 INTEGER,
  q18 INTEGER, q19 INTEGER, q20 INTEGER, q21 INTEGER, q22 INTEGER,
  q23 INTEGER, q24 INTEGER, q25 INTEGER, q26 INTEGER, q27 INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Si deseas permitir inserciones anónimas desde el cliente (RLS)
ALTER TABLE public.ortopedas_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ortopedas_responses ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir a todos insertar, pero solo leer si eres admin (service_role)
CREATE POLICY "Permitir inserciones anónimas participants" ON public.ortopedas_participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserciones anónimas responses" ON public.ortopedas_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir lectura participants" ON public.ortopedas_participants FOR SELECT USING (true);
CREATE POLICY "Permitir lectura responses" ON public.ortopedas_responses FOR SELECT USING (true);
