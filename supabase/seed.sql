-- ==============================================================================
-- PinSpace - Supabase Seed Data (Sample Pins & Categories)
-- ==============================================================================

-- Instructions:
-- 1. Ensure you have registered at least one user in your Supabase Auth dashboard or PinSpace signup.
-- 2. Replace 'YOUR_USER_UUID_HERE' with your user UUID from auth.users (or select the first user).
-- 3. Run this script in the Supabase SQL Editor.

DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Select the first existing user profile, or raise notice if no users exist yet
  SELECT id INTO target_user_id FROM public.profiles LIMIT 1;

  IF target_user_id IS NULL THEN
    RAISE NOTICE 'No user found in public.profiles. Please sign up or create a user in Supabase Auth first, then run this seed script.';
    RETURN;
  END IF;

  -- Insert Sample Boards
  INSERT INTO public.boards (id, user_id, name, description, is_private)
  VALUES
    ('b0000000-0000-0000-0000-000000000001', target_user_id, 'Dream Architecture', 'Cantilevered concrete, modernist villas, and serene skylights.', false),
    ('b0000000-0000-0000-0000-000000000002', target_user_id, 'Nordic & Japandi Living', 'Wabi-sabi spaces with low profile oak carpentry and linen textures.', false),
    ('b0000000-0000-0000-0000-000000000003', target_user_id, 'Graphic Design & 3D', 'Polychromatic typography, chrome renders, and poster art.', false)
  ON CONFLICT (id) DO NOTHING;

  -- Insert Sample Pins
  INSERT INTO public.pins (id, user_id, title, description, image_url, destination_url, aspect_ratio, category, tags)
  VALUES
    (
      'p0000000-0000-0000-0000-000000000001',
      target_user_id,
      'Minimalist Concrete Villa with Floating Staircase',
      'Cantilevered architectural masterpiece nestled in Kyoto bamboo foothills. Features exposed architectural concrete and floor-to-ceiling glass pavilions.',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&h=1200&q=80',
      'https://archdaily.com/projects/kyoto-concrete-villa',
      'tall',
      'architecture',
      ARRAY['minimalism', 'concrete', 'japan', 'modernist', 'villa']
    ),
    (
      'p0000000-0000-0000-0000-000000000002',
      target_user_id,
      'Serene Japandi Living Room with Oak Carpentry',
      'Harmony between Scandinavian functionality and Japanese rustic minimalism. Featuring custom low-profile white oak shelving and handwoven linen tatami seats.',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&h=1000&q=80',
      'https://nordicstylemag.com/japandi-spaces',
      'medium',
      'interiors',
      ARRAY['japandi', 'wabisabi', 'interiors', 'scandinavian', 'home']
    ),
    (
      'p0000000-0000-0000-0000-000000000003',
      target_user_id,
      'Prismatic Fluid 3D Typography Exploration',
      'Experimental generative chrome ribbon typography rendered in Octane. Optical refraction with iridescent polychromatic shaders.',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&h=800&q=80',
      'https://behance.net/gallery/chromatic-type',
      'square',
      'design',
      ARRAY['3dart', 'typography', 'iridescent', 'c4d', 'render']
    ),
    (
      'p0000000-0000-0000-0000-000000000004',
      target_user_id,
      'Emerald Alpine Mirror Lake in the Dolomites',
      'Lago di Braies at first morning mist. Wooden rowing boats moored peacefully on pristine turquoise glacial waters under granite spires.',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&h=1200&q=80',
      'https://nationalgeographic.com/travel/dolomites-secret',
      'tall',
      'travel',
      ARRAY['dolomites', 'italy', 'alps', 'mountains', 'wanderlust']
    ),
    (
      'p0000000-0000-0000-0000-000000000005',
      target_user_id,
      'Brutalist Spiral Atrium with Oculi Lighting',
      'Sculptural concrete corkscrew staircase descending into an subterranean exhibition space. Dramatic chiaroscuro natural light beam.',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&h=1050&q=80',
      'https://dezeen.com/modern-concrete-oculus',
      'medium',
      'architecture',
      ARRAY['brutalism', 'concrete', 'spiral', 'museum', 'geometry']
    ),
    (
      'p0000000-0000-0000-0000-000000000006',
      target_user_id,
      'Oversized Wool Trench & Tailored Pleated Trousers',
      'Earthy charcoal and camel layered styling with vintage leather tote and square-toe leather boots in Parisian streets.',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&h=1150&q=80',
      'https://vogue.fr/fashion-street-style',
      'tall',
      'fashion',
      ARRAY['streetwear', 'ootd', 'minimalist', 'parisian', 'fallfashion']
    )
  ON CONFLICT (id) DO NOTHING;

  -- Connect Pins to Board
  INSERT INTO public.board_pins (board_id, pin_id)
  VALUES
    ('b0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000005'),
    ('b0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000002'),
    ('b0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000003')
  ON CONFLICT (board_id, pin_id) DO NOTHING;

  RAISE NOTICE 'PinSpace sample pins and boards seeded successfully!';
END $$;
