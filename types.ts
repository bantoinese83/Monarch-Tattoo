export enum AppState {
  START,
  RECOMMEND,
  CUSTOM_INPUT,
  PREVIEW,
  ARTISTS,
}

export interface TattooArtist {
  title: string;
  uri: string;
  placeId?: string;
  rating?: number;
  reviewCount?: number;
  latitude?: number;
  longitude?: number;
}
