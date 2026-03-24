export const demoBusinesses = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    slug: "ustura-lounge",
    name: "Ustura Lounge",
    city: "İstanbul",
    district: "Kadıköy",
    rating: 4.8,
    description: "Kadıköy'de premium barber deneyimi.",
    branches: [
      {
        id: "11111111-1111-1111-1111-111111111111",
        name: "Kadıköy Şubesi",
        address: "Caferağa Mah. Moda Cad.",
        phone: "0216 555 44 33"
      }
    ],
    services: [
      { id: "22222222-2222-2222-2222-222222222222", name: "Saç Kesimi", duration_min: 45, price_try: 450 },
      { id: "22222222-2222-2222-2222-222222222223", name: "Sakal Tasarım", duration_min: 30, price_try: 300 }
    ]
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    slug: "nail-lab-ankara",
    name: "Nail Lab",
    city: "Ankara",
    district: "Çankaya",
    rating: 4.7,
    description: "Hijyenik ve modern nail studio.",
    branches: [
      {
        id: "11111111-1111-1111-1111-111111111112",
        name: "Çankaya Şubesi",
        address: "Kızılay Mah. İzmir Cad.",
        phone: "0312 333 22 11"
      }
    ],
    services: [
      { id: "22222222-2222-2222-2222-222222222224", name: "Manikür", duration_min: 50, price_try: 500 },
      { id: "22222222-2222-2222-2222-222222222225", name: "Kalıcı Oje", duration_min: 60, price_try: 650 }
    ]
  }
] as const;

export function findDemoBusinessBySlug(slug: string) {
  return demoBusinesses.find((item) => item.slug === slug) ?? null;
}
