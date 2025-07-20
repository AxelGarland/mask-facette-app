export interface Facette {
  id: string;
  name: string;
  words: string[];
  filename: string;
  imageUrl?: string; // URL to the mask image
} 