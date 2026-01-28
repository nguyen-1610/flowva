-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public."User" (id, email, name, "avatarUrl", "createdAt", "updatedAt")
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name'),
    coalesce(new.raw_user_meta_data ->> 'avatarUrl', new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    now(),
    now()
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();