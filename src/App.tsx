import './App.css';
import GalleryGrid from './components/GalleryGrid';
import FaceGenerator from './components/FaceGenerator';
import type { Face } from './types/Face';
import { useState, useEffect } from 'react';

function App() {
  const [gallery, setGallery] = useState<Face[]>([]);
  const [loading, setLoading] = useState(true);

  // Load existing gallery from localStorage on app start
  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    try {
      console.log('Loading gallery from localStorage...');
      const savedGallery = localStorage.getItem('faceGallery');
      console.log('Saved gallery data:', savedGallery);
      
      if (savedGallery) {
        const faces: Face[] = JSON.parse(savedGallery);
        console.log('Parsed faces:', faces);
        setGallery(faces);
      } else {
        console.log('No saved gallery found');
      }
    } catch (error) {
      console.error('Failed to load gallery:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveFace(face: { 
    name: string; 
    words: string[]; 
    filename: string;
    svgContent: string;
    pngBlob: Blob;
  }) {
    try {
      console.log('Saving face:', face.name);
      console.log('PNG blob size:', face.pngBlob.size);
      
      // Convert blob to data URL for storage
      const reader = new FileReader();
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        alert('Error converting image. Please try again.');
      };
      
      reader.onload = () => {
        try {
          const imageDataUrl = reader.result as string;
          console.log('Image converted to data URL, length:', imageDataUrl.length);
          
          // Add to local gallery
          const newFace: Face = {
            id: face.filename.replace('.png', ''),
            name: face.name,
            words: face.words,
            filename: face.filename,
            imageUrl: imageDataUrl
          };
          
          console.log('New face created:', newFace);
          
          const updatedGallery = [newFace, ...gallery];
          setGallery(updatedGallery);
          
          // Save to localStorage
          localStorage.setItem('faceGallery', JSON.stringify(updatedGallery));
          console.log('Saved to localStorage, gallery count:', updatedGallery.length);
          
          alert('Face saved successfully!');
        } catch (innerError) {
          console.error('Error in onload handler:', innerError);
          alert('Error processing image. Please try again.');
        }
      };
      
      reader.readAsDataURL(face.pngBlob);
    } catch (error) {
      console.error('Failed to save face:', error);
      alert('Failed to save face. Please try again.');
    }
  }

  async function handleDeleteFace(id: string) {
    try {
      const updatedGallery = gallery.filter(f => f.id !== id);
      setGallery(updatedGallery);
      
      // Update localStorage
      localStorage.setItem('faceGallery', JSON.stringify(updatedGallery));
    } catch (error) {
      console.error('Failed to delete face:', error);
      alert('Failed to delete face. Please try again.');
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
      <h1 className="text-3xl font-bold mb-6">Face Gallery</h1>
      <FaceGenerator onSave={handleSaveFace} />
      <div className="mt-12">
        <GalleryGrid items={gallery} onDelete={handleDeleteFace} />
      </div>
    </div>
  );
}

export default App;
