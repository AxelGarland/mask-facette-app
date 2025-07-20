import { useState } from 'react';
import { generateMaskSVG, svgToPNG } from '../utils/svgRenderer';

const WORDS = [
  'joyful', 'kind', 'funny', 'creative', 'generous', 'expressive', 'warm', 'caring', 'charismatic', 'calm',
  'curious', 'sensitive', 'serious', 'private', 'intense', 'thoughtful', 'structured', 'reserved', 'observant', 'anxious',
  'awkward', 'insecure', 'too_much', 'dramatic', 'needy', 'fake', 'intimidating', 'cold', 'passive', 'mysterious',
  'chaotic', 'self_conscious', 'loud', 'judgmental', 'defensive', 'detached', 'controlling', 'overbearing', 'forgettable'
];

export default function MaskGenerator({ onSave }: { onSave?: (mask: any) => void }) {
  const [maskName, setMaskName] = useState('');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [generated, setGenerated] = useState(false);
  const [svgContent, setSvgContent] = useState('');

  function toggleWord(word: string) {
    setSelectedWords(words =>
      words.includes(word)
        ? words.filter(w => w !== word)
        : words.length < 10 ? [...words, word] : words
    );
  }

  function handleGenerate() {
    if (selectedWords.length === 10 && maskName) {
      const svg = generateMaskSVG(selectedWords);
      setSvgContent(svg);
      setGenerated(true);
    }
  }

  async function handleSave() {
    if (onSave && generated && svgContent) {
      try {
        // Convert SVG to PNG for server upload
        const pngBlob = await svgToPNG(svgContent);
        
        // Create a unique filename based on mask name
        const sanitizedName = maskName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const timestamp = Date.now();
        const filename = `${sanitizedName}_${timestamp}.png`;
        
        onSave({ 
          name: maskName, 
          words: selectedWords, 
          filename,
          svgContent,
          pngBlob
        });
        
        // Reset form
        setMaskName('');
        setSelectedWords([]);
        setGenerated(false);
        setSvgContent('');
      } catch (error) {
        console.error('Failed to save mask:', error);
        alert('Failed to save mask. Please try again.');
      }
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Create a Mask</h2>
      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="Mask name"
        value={maskName}
        onChange={e => setMaskName(e.target.value)}
      />
      <div className="mb-4">
        <div className="mb-2 font-semibold">Choose 10 words:</div>
        <div className="flex flex-wrap gap-2">
          {WORDS.map(word => (
            <label key={word} className={`px-3 py-1 rounded-full border cursor-pointer ${selectedWords.includes(word) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
              <input
                type="checkbox"
                checked={selectedWords.includes(word)}
                onChange={() => toggleWord(word)}
                disabled={!selectedWords.includes(word) && selectedWords.length >= 10}
                className="mr-1 hidden"
              />
              {word.replace(/_/g, ' ')}
            </label>
          ))}
        </div>
        <div className="text-sm text-gray-500 mt-2">{selectedWords.length} / 10 selected</div>
      </div>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleGenerate}
        disabled={selectedWords.length !== 10 || !maskName}
      >
        Generate Mask
      </button>
      <div className="my-6 h-64 flex items-center justify-center border rounded bg-gray-50">
        {/* Real mask preview SVG */}
        {generated && svgContent ? (
          <div dangerouslySetInnerHTML={{ __html: svgContent }} />
        ) : (
          <span className="text-gray-300">Select 10 words and a name, then generate</span>
        )}
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleSave}
        disabled={!generated}
      >
        Save to Gallery
      </button>
    </div>
  );
} 