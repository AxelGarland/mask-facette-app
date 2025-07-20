import type { Facette } from '../types/Facette';

interface FacetteModalProps {
  facette: Facette;
  isOpen: boolean;
  onClose: () => void;
}

export default function FacetteModal({ facette, isOpen, onClose }: FacetteModalProps) {
  if (!isOpen) return null;

  function handleDownload() {
    if (facette.imageUrl) {
      const link = document.createElement('a');
      link.href = facette.imageUrl;
      link.download = `${facette.name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">{facette.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="mb-4">
            {facette.imageUrl ? (
              <img
                src={facette.imageUrl}
                alt={facette.name}
                className="w-full rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Words chosen:</h3>
            <div className="flex flex-wrap gap-2">
              {facette.words.map((word, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {word.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Download
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 