export const INITIAL_PINS = [
  {
    id: 'pin-1',
    title: 'Minimalist Concrete Villa with Floating Staircase',
    description: 'Cantilevered architectural masterpiece nestled in Kyoto bamboo foothills. Features exposed architectural concrete and floor-to-ceiling glass pavilions.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&h=1200&q=80',
    aspectRatio: 'tall',
    category: 'architecture',
    tags: ['minimalism', 'concrete', 'japan', 'modernist', 'villa'],
    author: {
      id: 'author-1',
      name: 'Kenzo Tange Studio',
      handle: 'kenzodesign',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      followers: '128.4k',
      isFollowed: false
    },
    likesCount: 1420,
    isLiked: false,
    destinationUrl: 'https://archdaily.com/projects/kyoto-concrete-villa',
    createdAt: '2025-02-12T10:30:00Z',
    comments: [
      {
        id: 'c-1',
        user: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        text: 'The concrete texture combined with natural morning sunlight is breathtaking.',
        time: '2 hours ago'
      },
      {
        id: 'c-2',
        user: 'Marcus Vance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        text: 'Are those stairs cast in place or precast cantilever steel core?',
        time: '5 hours ago'
      }
    ]
  },
  {
    id: 'pin-2',
    title: 'Serene Japandi Living Room with Oak Carpentry',
    description: 'Harmony between Scandinavian functionality and Japanese rustic minimalism. Featuring custom low-profile white oak shelving and handwoven linen tatami seats.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&h=1000&q=80',
    aspectRatio: 'medium',
    category: 'interiors',
    tags: ['japandi', 'wabisabi', 'interiors', 'scandinavian', 'home'],
    author: {
      id: 'author-2',
      name: 'Freja Lindqvist',
      handle: 'frejainteriors',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      followers: '84.2k',
      isFollowed: true
    },
    likesCount: 3890,
    isLiked: true,
    destinationUrl: 'https://nordicstylemag.com/japandi-spaces',
    createdAt: '2025-02-10T08:15:00Z',
    comments: [
      {
        id: 'c-3',
        user: 'Sora Tanaka',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
        text: 'Such a calming atmosphere. Ideal meditation corner.',
        time: '1 day ago'
      }
    ]
  },
  {
    id: 'pin-3',
    title: 'Prismatic Fluid 3D Typography Exploration',
    description: 'Experimental generative chrome ribbon typography rendered in Octane. Optical refraction with iridescent polychromatic shaders.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&h=800&q=80',
    aspectRatio: 'square',
    category: 'design',
    tags: ['3dart', 'typography', 'iridescent', 'c4d', 'render'],
    author: {
      id: 'author-3',
      name: 'Apex Motion Lab',
      handle: 'apexmotion',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      followers: '45.1k',
      isFollowed: false
    },
    likesCount: 940,
    isLiked: false,
    destinationUrl: 'https://behance.net/gallery/chromatic-type',
    createdAt: '2025-02-14T14:20:00Z',
    comments: [
      {
        id: 'c-4',
        user: 'Dave Kim',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
        text: 'The glass dispersion dispersion coefficient must be dialed in crazy high here. Looks insane!',
        time: '3 hours ago'
      }
    ]
  },
  {
    id: 'pin-4',
    title: 'Emerald Alpine Mirror Lake in the Dolomites',
    description: 'Lago di Braies at first morning mist. Wooden rowing boats moored peacefully on pristine turquoise glacial waters under granite spires.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&h=1200&q=80',
    aspectRatio: 'tall',
    category: 'travel',
    tags: ['dolomites', 'italy', 'alps', 'mountains', 'wanderlust'],
    author: {
      id: 'author-4',
      name: 'Matteo Bellini',
      handle: 'matteotravels',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      followers: '210.5k',
      isFollowed: false
    },
    likesCount: 5410,
    isLiked: false,
    destinationUrl: 'https://nationalgeographic.com/travel/dolomites-secret',
    createdAt: '2025-02-11T07:00:00Z',
    comments: []
  },
  {
    id: 'pin-5',
    title: 'Brutalist Spiral Atrium with Oculi Lighting',
    description: 'Sculptural concrete corkscrew staircase descending into an subterranean exhibition space. Dramatic chiaroscuro natural light beam.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&h=1050&q=80',
    aspectRatio: 'medium',
    category: 'architecture',
    tags: ['brutalism', 'concrete', 'spiral', 'museum', 'geometry'],
    author: {
      id: 'author-1',
      name: 'Kenzo Tange Studio',
      handle: 'kenzodesign',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      followers: '128.4k',
      isFollowed: false
    },
    likesCount: 2190,
    isLiked: false,
    destinationUrl: 'https://dezeen.com/modern-concrete-oculus',
    createdAt: '2025-02-09T18:10:00Z',
    comments: []
  },
  {
    id: 'pin-6',
    title: 'Sunlit Botanical Kitchen with Fluted Glass Cabinetry',
    description: 'Warm travertine stone countertops meet fluted reeded glass cabinets and terracotta planters filled with organic wild herbs.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&h=1100&q=80',
    aspectRatio: 'tall',
    category: 'interiors',
    tags: ['kitchen', 'botanical', 'travertine', 'interiordesign', 'plants'],
    author: {
      id: 'author-2',
      name: 'Freja Lindqvist',
      handle: 'frejainteriors',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      followers: '84.2k',
      isFollowed: true
    },
    likesCount: 3120,
    isLiked: false,
    destinationUrl: 'https://elledecor.com/botanical-kitchen-retreat',
    createdAt: '2025-02-08T12:00:00Z',
    comments: []
  },
  {
    id: 'pin-7',
    title: 'Neo-Tokyo Holographic Cyberpunk Poster Series',
    description: 'High-contrast risograph style screen-print combining Kanji typography, neon cyan gradients, and geometric grid alignment.',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&h=800&q=80',
    aspectRatio: 'square',
    category: 'design',
    tags: ['cyberpunk', 'poster', 'graphicdesign', 'risograph', 'tokyo'],
    author: {
      id: 'author-5',
      name: 'Yuki Morimoto',
      handle: 'morimotovisuals',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      followers: '67.8k',
      isFollowed: false
    },
    likesCount: 1870,
    isLiked: false,
    destinationUrl: 'https://dribbble.com/shots/cyber-tokyo-print',
    createdAt: '2025-02-13T16:45:00Z',
    comments: []
  },
  {
    id: 'pin-8',
    title: 'Cliffside Sunset Over Positano on the Amalfi Coast',
    description: 'Pastel cliff dwellings cascading down into turquoise waters as Mediterranean lanterns flicker against purple twilight skies.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&h=1200&q=80',
    aspectRatio: 'tall',
    category: 'travel',
    tags: ['amalfi', 'positano', 'italy', 'sunset', 'mediterranean'],
    author: {
      id: 'author-4',
      name: 'Matteo Bellini',
      handle: 'matteotravels',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      followers: '210.5k',
      isFollowed: false
    },
    likesCount: 6200,
    isLiked: true,
    destinationUrl: 'https://cntraveler.com/destinations/amalfi-coast-guide',
    createdAt: '2025-02-07T19:30:00Z',
    comments: [
      {
        id: 'c-5',
        user: 'Chloe Dubois',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        text: 'Adding this directly to my summer vacation itinerary!',
        time: '2 days ago'
      }
    ]
  },
  {
    id: 'pin-9',
    title: 'Oversized Wool Trench & Tailored Pleated Trousers',
    description: 'Earthy charcoal and camel layered styling with vintage leather tote and square-toe leather boots in Parisian streets.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&h=1150&q=80',
    aspectRatio: 'tall',
    category: 'fashion',
    tags: ['streetwear', 'ootd', 'minimalist', 'parisian', 'fallfashion'],
    author: {
      id: 'author-6',
      name: 'Camille Laurent',
      handle: 'camillestyles',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      followers: '190.2k',
      isFollowed: false
    },
    likesCount: 4120,
    isLiked: false,
    destinationUrl: 'https://vogue.fr/fashion-street-style',
    createdAt: '2025-02-12T11:00:00Z',
    comments: []
  },
  {
    id: 'pin-10',
    title: 'Artisanal Sourdough Boule with Wheat Leaf Stenciling',
    description: 'Fermented for 36 hours with open crumb structure, blistered mahogany crust, and delicate razor scoring detail.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&h=1000&q=80',
    aspectRatio: 'medium',
    category: 'food',
    tags: ['sourdough', 'baking', 'artisan', 'bread', 'foodie'],
    author: {
      id: 'author-7',
      name: 'Baker Julien',
      handle: 'julienbakes',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      followers: '52.7k',
      isFollowed: false
    },
    likesCount: 1540,
    isLiked: false,
    destinationUrl: 'https://artisanbreads.co/scoring-techniques',
    createdAt: '2025-02-06T06:40:00Z',
    comments: []
  },
  {
    id: 'pin-11',
    title: 'Sculptural Ceramic Vases & Textured Wabi-Sabi Plaster',
    description: 'Raw stoneware vessels shaped on manual pottery wheel against hand-troweled lime wash wall surface.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&h=1200&q=80',
    aspectRatio: 'tall',
    category: 'interiors',
    tags: ['ceramics', 'pottery', 'wabisabi', 'artisan', 'minimalist'],
    author: {
      id: 'author-2',
      name: 'Freja Lindqvist',
      handle: 'frejainteriors',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      followers: '84.2k',
      isFollowed: true
    },
    likesCount: 2840,
    isLiked: false,
    destinationUrl: 'https://kinfolk.com/clay-wabi-sabi',
    createdAt: '2025-02-05T15:15:00Z',
    comments: []
  },
  {
    id: 'pin-12',
    title: 'Glass Pavilion in Forest Clearing by Lake Tahoe',
    description: 'Blackened timber beams framing expansive wilderness views. Radiant cedar ceilings warm the crisp winter ambient reflections.',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&h=850&q=80',
    aspectRatio: 'square',
    category: 'architecture',
    tags: ['cabin', 'forest', 'architecture', 'tahoe', 'timber'],
    author: {
      id: 'author-1',
      name: 'Kenzo Tange Studio',
      handle: 'kenzodesign',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      followers: '128.4k',
      isFollowed: false
    },
    likesCount: 4980,
    isLiked: true,
    destinationUrl: 'https://dwell.com/cabin-in-the-trees',
    createdAt: '2025-02-04T13:10:00Z',
    comments: []
  },
  {
    id: 'pin-13',
    title: 'Traditional Bamboo Forest Grove in Arashiyama, Kyoto',
    description: 'Towering green bamboo stalks swaying with the mountain breeze. A quiet meditative path through centuries-old nature sanctuary.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&h=1200&q=80',
    aspectRatio: 'tall',
    category: 'travel',
    tags: ['kyoto', 'japan', 'bamboo', 'zen', 'travel'],
    author: {
      id: 'author-4',
      name: 'Matteo Bellini',
      handle: 'matteotravels',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      followers: '210.5k',
      isFollowed: false
    },
    likesCount: 7120,
    isLiked: false,
    destinationUrl: 'https://japan.travel/kyoto-arashiyama',
    createdAt: '2025-02-03T09:40:00Z',
    comments: []
  },
  {
    id: 'pin-14',
    title: 'Abstract Organic Sculptural Forms in Soft Monochrome',
    description: 'Tactile digital rendering exploring soft tension, matte limestone textures, and gentle ambient shadows.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&h=1000&q=80',
    aspectRatio: 'medium',
    category: 'art',
    tags: ['abstract', 'sculpture', 'render', 'matte', 'aesthetic'],
    author: {
      id: 'author-3',
      name: 'Apex Motion Lab',
      handle: 'apexmotion',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      followers: '45.1k',
      isFollowed: false
    },
    likesCount: 1620,
    isLiked: false,
    destinationUrl: 'https://superrare.com/artwork/monochrome-tension',
    createdAt: '2025-02-02T17:00:00Z',
    comments: []
  },
  {
    id: 'pin-15',
    title: 'Monochromatic Monochrome Silk Drape & Jewelry',
    description: 'Gold sculptural ear cuffs paired with deep ivory silk and minimalist makeup under directional spotlight.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&h=1200&q=80',
    aspectRatio: 'tall',
    category: 'fashion',
    tags: ['editorial', 'jewelry', 'gold', 'minimalist', 'highfashion'],
    author: {
      id: 'author-6',
      name: 'Camille Laurent',
      handle: 'camillestyles',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      followers: '190.2k',
      isFollowed: false
    },
    likesCount: 3560,
    isLiked: false,
    destinationUrl: 'https://harpersbazaar.com/sculptural-jewelry',
    createdAt: '2025-02-01T14:50:00Z',
    comments: []
  },
  {
    id: 'pin-16',
    title: 'Loft Library with Rolling Ladder & Leather Club Chairs',
    description: 'Double-height mahogany book walls, floor-to-ceiling iron framed windows, and vintage cognac Chesterfield armchairs.',
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&h=900&q=80',
    aspectRatio: 'square',
    category: 'interiors',
    tags: ['library', 'bookshelf', 'cozy', 'leather', 'darkacademia'],
    author: {
      id: 'author-2',
      name: 'Freja Lindqvist',
      handle: 'frejainteriors',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      followers: '84.2k',
      isFollowed: true
    },
    likesCount: 5120,
    isLiked: false,
    destinationUrl: 'https://architecturaldigest.com/loft-libraries',
    createdAt: '2025-01-31T20:10:00Z',
    comments: []
  },
  {
    id: 'pin-17',
    title: 'Majestic Misty Fjords of Norway at Sunrise',
    description: 'Dramatic sheer cliff walls plunging straight into glacial indigo waters. Wisps of morning clouds clinging to pine-covered ledges.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&h=1100&q=80',
    aspectRatio: 'tall',
    category: 'travel',
    tags: ['norway', 'fjords', 'wilderness', 'adventure', 'nordic'],
    author: {
      id: 'author-4',
      name: 'Matteo Bellini',
      handle: 'matteotravels',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      followers: '210.5k',
      isFollowed: false
    },
    likesCount: 8400,
    isLiked: false,
    destinationUrl: 'https://visitnorway.com/fjords-escape',
    createdAt: '2025-01-30T10:00:00Z',
    comments: []
  },
  {
    id: 'pin-18',
    title: 'Desert Pavilion with Corten Steel and Sand Dunes',
    description: 'Warm oxidized steel panels blending organically with red desert sand. Shaded internal courtyards with drought-tolerant desert flora.',
    image: 'https://images.unsplash.com/photo-1509721434272-b79147e0e708?auto=format&fit=crop&w=800&h=1200&q=80',
    aspectRatio: 'tall',
    category: 'architecture',
    tags: ['desert', 'corten', 'architecture', 'arizona', 'arid'],
    author: {
      id: 'author-1',
      name: 'Kenzo Tange Studio',
      handle: 'kenzodesign',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      followers: '128.4k',
      isFollowed: false
    },
    likesCount: 2310,
    isLiked: false,
    destinationUrl: 'https://archdaily.com/desert-steel-retreat',
    createdAt: '2025-01-28T16:20:00Z',
    comments: []
  },
  {
    id: 'pin-19',
    title: 'Hand-Poured Cortado & Fresh Pistachio Croissant',
    description: 'Golden flaky layers dusted with crushed green pistachio nuts served alongside rich dark roast espresso cortado with swan latte art.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&h=1000&q=80',
    aspectRatio: 'medium',
    category: 'food',
    tags: ['coffee', 'croissant', 'cafe', 'latteart', 'breakfast'],
    author: {
      id: 'author-7',
      name: 'Baker Julien',
      handle: 'julienbakes',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      followers: '52.7k',
      isFollowed: false
    },
    likesCount: 3950,
    isLiked: false,
    destinationUrl: 'https://coffeereview.com/specialty-roasters',
    createdAt: '2025-01-26T08:30:00Z',
    comments: []
  },
  {
    id: 'pin-20',
    title: 'Futuristic Organic Chair in Lime Green & Matte Cream',
    description: 'Bio-morphic ergonomics meeting sustainable molded resin. A striking statement furniture piece for modern avant-garde interiors.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&h=1100&q=80',
    aspectRatio: 'tall',
    category: 'design',
    tags: ['furniture', 'productdesign', 'chair', 'modernism', 'interior'],
    author: {
      id: 'author-3',
      name: 'Apex Motion Lab',
      handle: 'apexmotion',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      followers: '45.1k',
      isFollowed: false
    },
    likesCount: 4680,
    isLiked: false,
    destinationUrl: 'https://design-milk.com/biomorphic-seating-concepts',
    createdAt: '2025-01-25T11:45:00Z',
    comments: []
  },
  {
    id: 'pin-21',
    title: 'Vintage 35mm Candid Golden Hour Portrait in Berlin',
    description: 'Analog film grain aesthetics with authentic color saturation, natural lens flares, and genuine spontaneous emotion.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&h=1100&q=80',
    aspectRatio: 'tall',
    category: 'photography',
    tags: ['film', '35mm', 'portrait', 'goldenhour', 'analog'],
    author: {
      id: 'author-5',
      name: 'Yuki Morimoto',
      handle: 'morimotovisuals',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      followers: '67.8k',
      isFollowed: false
    },
    likesCount: 3110,
    isLiked: false,
    destinationUrl: 'https://leica-camera.com/stories/berlin-grain',
    createdAt: '2025-01-22T17:15:00Z',
    comments: []
  },
  {
    id: 'pin-22',
    title: 'Handmade Japanese Stoneware Matcha Bowl with Chasen',
    description: 'Ceremony grade vibrant green Uji matcha frothed to velvet foam in a charcoal raku chawan bowl.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&h=900&q=80',
    aspectRatio: 'square',
    category: 'food',
    tags: ['matcha', 'tea', 'japan', 'ceramics', 'zen'],
    author: {
      id: 'author-7',
      name: 'Baker Julien',
      handle: 'julienbakes',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      followers: '52.7k',
      isFollowed: false
    },
    likesCount: 2790,
    isLiked: false,
    destinationUrl: 'https://ippodo-tea.co.jp/matcha-guide',
    createdAt: '2025-01-20T09:00:00Z',
    comments: []
  }
]
