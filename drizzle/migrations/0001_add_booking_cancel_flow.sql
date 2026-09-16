ALTER TABLE public.bookings
  ADD COLUMN cancel_token uuid NOT NULL DEFAULT gen_random_uuid();

CREATE OR REPLACE FUNCTION public.get_booking_for_cancel(p_id uuid, p_token uuid)
RETURNS TABLE (
  full_name text,
  level text,
  booking_date date,
  hours integer[],
  total_price integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.full_name, b.level, b.booking_date, b.hours, b.total_price
  FROM public.bookings b
  WHERE b.id = p_id AND b.cancel_token = p_token
$$;

CREATE OR REPLACE FUNCTION public.cancel_own_booking(p_id uuid, p_token uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.bookings WHERE id = p_id AND cancel_token = p_token;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_booking_for_cancel(uuid, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_own_booking(uuid, uuid) TO anon, authenticated;