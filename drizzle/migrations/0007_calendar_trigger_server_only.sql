REVOKE ALL ON FUNCTION public.crm_after_booking_created() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.crm_after_booking_created() TO service_role;
