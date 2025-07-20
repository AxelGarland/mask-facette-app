import './App.css';
import GalleryGrid from './components/GalleryGrid';
import MaskGenerator from './components/MaskGenerator';
import type { Facette } from './types/Facette';
import { useState, useEffect } from 'react';

function App() {
  const [gallery, setGallery] = useState<Facette[]>([]);
  const [loading, setLoading] = useState(true);

  // Load existing gallery from server on app start
  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    try {
      const response = await fetch('http://localhost:3001/gallery-list');
      if (response.ok) {
        const data = await response.json();
        const facettes: Facette[] = data.map((item: any) => ({
          id: item.filename.replace('.png', ''),
          name: item.name || 'Unnamed Mask',
          words: item.adjectives || [],
          filename: item.filename,
          imageUrl: `http://localhost:3001/gallery/${item.filename}`
        }));
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
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('mask', mask.pngBlob, mask.filename);
      formData.append('name', mask.name);
      formData.append('adjectives', JSON.stringify(mask.words));

      // Upload to server
      const response = await fetch('http://localhost:3001/upload-mask', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        
        // Add to local gallery
        const newFacette: Facette = {
          id: mask.filename.replace('.png', ''),
          name: mask.name,
          words: mask.words,
          filename: mask.filename,
          imageUrl: `http://localhost:3001/gallery/${mask.filename}`
        };
        
        setGallery(gallery => [newFacette, ...gallery]);
        alert('Mask saved successfully!');
      } else {
        throw new Error('Failed to upload mask');
      }
    } catch (error) {
      console.error('Failed to save mask:', error);
      alert('Failed to save mask. Please try again.');
    }
  }

  async function handleDeleteMask(id: string) {
    try {
      const facette = gallery.find(f => f.id === id);
      if (!facette) return;

      const response = await fetch(`http://localhost:3001/delete-mask/${facette.filename}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setGallery(gallery => gallery.filter(f => f.id !== id));
      } else {
        throw new Error('Failed to delete mask');
      }
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
