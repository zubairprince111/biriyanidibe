export interface BiriyaniSpot {
  id: string;
  masjid_name: string;
  area: string;
  food_type: string;
  lat: number;
  lng: number;
  upvotes: number;
  downvotes: number;
  created_at: string;
}

export type FoodType = 'Kacchi Biriyani' | 'Tehari' | 'Plain Beef' | 'Mutton Biriyani' | 'Chicken Biriyani' | 'Mixed';

export const FOOD_TYPES: FoodType[] = [
  'Kacchi Biriyani',
  'Tehari',
  'Plain Beef',
  'Mutton Biriyani',
  'Chicken Biriyani',
  'Mixed',
];

export const TRUST_THRESHOLD = 3; // net upvotes needed to be "verified"
