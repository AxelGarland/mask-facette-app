import './App.css';
import GalleryGrid from './components/GalleryGrid';
import MaskGenerator from './components/MaskGenerator';
import type { Facette } from './types/Facette';
import { useState, useEffect } from 'react';

function App() {
  const [gallery, setGallery] = useState<Facette[]>([]);
  const [loading, setLoading] = useState(true);

  // Load existing gallery from localStorage on app start
  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    try {
      const savedGallery = localStorage.getItem('maskGallery');
      if (savedGallery) {
        const facettes: Facette[] = JSON.parse(savedGallery);
        setGallery(facettes);
      }
    } catch (error) {
      console.error('Failed to load gallery:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveMask(mask: { 
    name: string; 
    words: string[]; 
    filename: string;
    svgContent: string;
    pngBlob: Blob;
  }) {
    try {
      // Convert blob to data URL for storage
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        
        // Add to local gallery
        const newFacette: Facette = {
          id: mask.filename.replace('.png', ''),
          name: mask.name,
          words: mask.words,
          filename: mask.filename,
          imageUrl: imageDataUrl
        };
        
        const updatedGallery = [newFacette, ...gallery];
        setGallery(updatedGallery);
        
        // Save to localStorage
        localStorage.setItem('maskGallery', JSON.stringify(updatedGallery));
        
        alert('Mask saved successfully!');
      };
      reader.readAsDataURL(mask.pngBlob);
    } catch (error) {
      console.error('Failed to save mask:', error);
      alert('Failed to save mask. Please try again.');
    }
  }

  async function handleDeleteMask(id: string) {
    try {
      const updatedGallery = gallery.filter(f => f.id !== id);
      setGallery(updatedGallery);
      
      // Update localStorage
      localStorage.setItem('maskGallery', JSON.stringify(updatedGallery));
    } catch (error) {
      console.error('Failed to delete mask:', error);
      alert('Failed to delete mask. Please try again.');
    }
  }

  if (loading) {
    return (
      <div className="App p-8">
        <div className="text-center">
          <div className="text-xl">Loading gallery...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App p-8">
      <h1 className="text-3xl font-bold mb-6">Mask Gallery</h1>
      <MaskGenerator onSave={handleSaveMask} />
      <div className="mt-12">
        <GalleryGrid items={gallery} onDelete={handleDeleteMask} />
      </div>
    </div>
  );
}

export default App;
