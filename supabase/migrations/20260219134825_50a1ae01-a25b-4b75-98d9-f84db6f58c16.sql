
-- Create biriyani_spots table
CREATE TABLE public.biriyani_spots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  masjid_name TEXT NOT NULL,
  area TEXT NOT NULL,
  food_type TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.biriyani_spots ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view spots"
  ON public.biriyani_spots
  FOR SELECT
  USING (true);

-- Anyone can insert (no auth required for crowdsourcing)
CREATE POLICY "Anyone can insert spots"
  ON public.biriyani_spots
  FOR INSERT
  WITH CHECK (true);

-- Anyone can update upvotes/downvotes
CREATE POLICY "Anyone can update spots"
  ON public.biriyani_spots
  FOR UPDATE
  USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.biriyani_spots;

-- Enable pg_cron and pg_net extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Midnight wipe cron job (midnight Bangladesh time = 18:00 UTC)
SELECT cron.schedule(
  'midnight-wipe-biriyani-spots',
  '0 18 * * *',
  $$DELETE FROM public.biriyani_spots$$
);
