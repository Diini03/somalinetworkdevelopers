
-- Let admins view all user roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Let admins grant/revoke roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Let admins view all profiles (needed to display user list in the admin roles page)
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- List all users with their roles (admin only)
CREATE OR REPLACE FUNCTION public.admin_list_users_with_roles()
RETURNS TABLE (
  user_id uuid,
  email text,
  name text,
  created_at timestamptz,
  roles app_role[]
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  RETURN QUERY
  SELECT
    p.id AS user_id,
    p.email,
    p.name,
    p.created_at,
    COALESCE(
      (SELECT array_agg(ur.role ORDER BY ur.role) FROM public.user_roles ur WHERE ur.user_id = p.id),
      ARRAY[]::app_role[]
    ) AS roles
  FROM public.profiles p
  ORDER BY p.created_at DESC;
END;
$$;

-- Grant an admin role by email
CREATE OR REPLACE FUNCTION public.admin_grant_role(_email text, _role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  SELECT id INTO _uid FROM public.profiles WHERE lower(email) = lower(_email) LIMIT 1;
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'no user with email %', _email;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_uid, _role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- Revoke a role from a user
CREATE OR REPLACE FUNCTION public.admin_revoke_role(_user_id uuid, _role app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  -- Prevent removing the last admin
  IF _role = 'admin' THEN
    IF (SELECT count(*) FROM public.user_roles WHERE role = 'admin') <= 1 THEN
      RAISE EXCEPTION 'cannot revoke the last admin';
    END IF;
  END IF;

  DELETE FROM public.user_roles WHERE user_id = _user_id AND role = _role;
END;
$$;
