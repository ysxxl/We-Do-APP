/*
# Revoke PUBLIC execute on handle_new_user

Postgres grants EXECUTE on functions to PUBLIC by default. Revoke from PUBLIC
so neither anon nor authenticated can call it via REST. The trigger still works
because it runs as the function owner (SECURITY DEFINER).
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
