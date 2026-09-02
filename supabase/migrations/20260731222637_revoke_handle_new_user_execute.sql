/*
# Revoke public execute on handle_new_user trigger function

The handle_new_user() function is a SECURITY DEFINER trigger that auto-creates
a profile row when a new auth.users row is inserted. It should only be called
by the trigger, not via the REST API. Revoke EXECUTE from anon and authenticated
roles to close the advisor warning.
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
