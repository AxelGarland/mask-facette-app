import { useState } from 'react';
import type { Face } from '../types/Face';
import FaceModal from './FaceModal';

interface GalleryGridProps {
  items: Face[];
  onDelete?: (id: string) => Promise<void>;
}

export default function GalleryGrid({ items, onDelete }: GalleryGridProps) {
  const [selectedFace, setSelectedFace] = useState<Face | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal(face: Face) {
    setSelectedFace(face);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedFace(null);
  }

  async function handleDelete(id: string, event: React.MouseEvent) {
    event.stopPropagation(); // Prevent modal from opening
    if (onDelete && confirm('Are you sure you want to delete this face?')) {
      await onDelete(id);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No faces in gallery yet. Create your first face above!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((face) => (
          <div
            key={face.id}
            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => openModal(face)}
          >
            <div className="aspect-square bg-gray-100 rounded mb-3 flex items-center justify-center">
              {face.imageUrl ? (
                <img 
                  src={face.imageUrl} 
                  alt={face.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="text-gray-400 text-sm">No preview</div>
              )}
            </div>
            <h3 className="font-semibold text-sm mb-1 truncate">{face.name}</h3>
            <p className="text-xs text-gray-500 mb-2">
              {face.words.slice(0, 3).join(', ')}
              {face.words.length > 3 && '...'}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {face.words.length} words
              </span>
              {onDelete && (
                <button
                  onClick={(e) => handleDelete(face.id, e)}
                  className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedFace && (
        <FaceModal
          face={selectedFace}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
} 