CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  level text NOT NULL,
  booking_date date NOT NULL,
  hours integer[] NOT NULL,
  price_per_hour integer NOT NULL DEFAULT 350,
  total_price integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.blocked_days (
  day date PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.blocked_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day date NOT NULL,
  hour integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (day, hour)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT INSERT ON public.bookings TO anon;
GRANT ALL ON public.bookings TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocked_days TO authenticated;
GRANT SELECT ON public.blocked_days TO anon;
GRANT ALL ON public.blocked_days TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocked_hours TO authenticated;
GRANT SELECT ON public.blocked_hours TO anon;
GRANT ALL ON public.blocked_hours TO service_role;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(auth.jwt() ->> 'email', '') = 'ahajizakariae2@gmail.com'
$$;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can create a booking" ON public.bookings
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin reads bookings" ON public.bookings
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admin updates bookings" ON public.bookings
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admin deletes bookings" ON public.bookings
  FOR DELETE TO authenticated USING (public.is_admin());

CREATE POLICY "public reads blocked days" ON public.blocked_days
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin writes blocked days" ON public.blocked_days
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "public reads blocked hours" ON public.blocked_hours
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin writes blocked hours" ON public.blocked_hours
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.taken_hours(d date)
RETURNS TABLE (hour integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT unnest(b.hours) FROM public.bookings b WHERE b.booking_date = d
$$;

GRANT EXECUTE ON FUNCTION public.taken_hours(date) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;