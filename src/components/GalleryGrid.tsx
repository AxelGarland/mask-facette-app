import { useState } from 'react';
import type { Facette } from '../types/Facette';
import FacetteModal from './FacetteModal';

interface GalleryGridProps {
  items: Facette[];
  onDelete?: (id: string) => Promise<void>;
}

export default function GalleryGrid({ items, onDelete }: GalleryGridProps) {
  const [selectedFacette, setSelectedFacette] = useState<Facette | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal(facette: Facette) {
    setSelectedFacette(facette);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedFacette(null);
  }

  async function handleDelete(id: string, event: React.MouseEvent) {
    event.stopPropagation(); // Prevent modal from opening
    if (onDelete && confirm('Are you sure you want to delete this mask?')) {
      await onDelete(id);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No masks in gallery yet. Create your first mask above!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((facette) => (
          <div
            key={facette.id}
            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => openModal(facette)}
          >
            <div className="aspect-square bg-gray-100 rounded mb-3 flex items-center justify-center">
              {facette.imageUrl ? (
                <img 
                  src={facette.imageUrl} 
                  alt={facette.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="text-gray-400 text-sm">No preview</div>
              )}
            </div>
            <h3 className="font-semibold text-sm mb-1 truncate">{facette.name}</h3>
            <p className="text-xs text-gray-500 mb-2">
              {facette.words.slice(0, 3).join(', ')}
              {facette.words.length > 3 && '...'}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {facette.words.length} words
              </span>
              {onDelete && (
                <button
                  onClick={(e) => handleDelete(facette.id, e)}
                  className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedFacette && (
        <FacetteModal
          facette={selectedFacette}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
} 