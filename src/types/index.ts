export interface Pet {
  id: number;
  name: string;
  breed: string;
  species: 'dog' | 'cat';
  avatar: string;
  photos: string[];
  distance: number;
  vaccinated: boolean;
  isFavorite: boolean;
  personality: string;
  owner: {
    name: string;
    avatar: string;
    wechat: string;
  };
  location: {
    x: number;
    y: number;
  };
}

export type FilterType = 'all' | 'dog' | 'cat' | string;
