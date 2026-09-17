CREATE OR REPLACE FUNCTION public.create_booking(
  p_full_name text,
  p_phone text,
  p_level text,
  p_booking_date date,
  p_hours integer[],
  p_price_per_hour integer,
  p_total_price integer,
  p_address text DEFAULT NULL,
  p_latitude double precision DEFAULT NULL,
  p_longitude double precision DEFAULT NULL
)
RETURNS TABLE (id uuid, cancel_token uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conflict_count integer;
BEGIN
  SELECT count(*) INTO conflict_count
  FROM public.bookings b
  WHERE b.booking_date = p_booking_date
    AND b.hours && p_hours;
  IF conflict_count > 0 THEN
    RAISE EXCEPTION 'One or more selected hours are already booked for this day';
  END IF;
  RETURN QUERY
  INSERT INTO public.bookings (
    full_name, phone, level, booking_date, hours,
    price_per_hour, total_price, address, latitude, longitude
  )
  VALUES (
    p_full_name, p_phone, p_level, p_booking_date, p_hours,
    p_price_per_hour, p_total_price, p_address, p_latitude, p_longitude
  )
  RETURNING bookings.id, bookings.cancel_token;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_booking(
  text, text, text, date, integer[], integer, integer, text, double precision, double precision
) TO anon, authenticated;