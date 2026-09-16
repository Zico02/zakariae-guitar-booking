ALTER TABLE public.bookings
  ADD COLUMN address text,
  ADD COLUMN latitude double precision,
  ADD COLUMN longitude double precision;