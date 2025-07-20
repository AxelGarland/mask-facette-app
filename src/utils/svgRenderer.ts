import { WORD_PANEL_MAP, WORD_TILE_MAP, WORD_COLOR_MAP, GRID_CELLS, normalizeWordKey } from './maskData';

export interface TileRenderData {
  cellKey: string;
  tileNum: number;
  rotate: number;
  flip: boolean;
  colA: string;
  colB: string;
}

export function generateMaskSVG(selectedWords: string[]): string {
  if (selectedWords.length !== 10) {
    return '';
  }

  const size = 300;
  const cellSize = size / 5;
  const tileSize = cellSize * 0.8; // Tile is 80% of cell size

  let svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Generate tile data for each word position
  const tileData: TileRenderData[] = [];
  
  for (let wordIndex = 0; wordIndex < selectedWords.length; wordIndex++) {
    const word = normalizeWordKey(selectedWords[wordIndex]);
    const wordOrder = wordIndex + 1;
    const panels = WORD_PANEL_MAP[wordOrder as keyof typeof WORD_PANEL_MAP];
    const colors = WORD_COLOR_MAP[word as keyof typeof WORD_COLOR_MAP];
    
    if (!panels || !colors) continue;
    
    for (const panelKey of panels) {
      const tileMapping = WORD_TILE_MAP[word as keyof typeof WORD_TILE_MAP];
      if (!tileMapping || !tileMapping[wordOrder as keyof typeof tileMapping]) continue;
      
      const orderMapping = tileMapping[wordOrder as keyof typeof tileMapping];
      const tileNum = orderMapping[panelKey as keyof typeof orderMapping];
      if (tileNum === undefined) continue;
      
      // Random rotation and flip for variety
      const rotate = Math.floor(Math.random() * 4) * 90;
      const flip = Math.random() > 0.5;
      
      tileData.push({
        cellKey: panelKey,
        tileNum,
        rotate,
        flip,
        colA: colors.colA,
        colB: colors.colB
      });
    }
  }
  
  // Render each tile
  tileData.forEach(tile => {
    const cell = GRID_CELLS[tile.cellKey as keyof typeof GRID_CELLS];
    if (!cell) return;
    
    const x = cell.x * cellSize + cellSize / 2;
    const y = cell.y * cellSize + cellSize / 2;
    
    // Create tile SVG element
    const tileElement = createTileElement(tile, x, y, tileSize);
    svgContent += tileElement;
  });
  
  svgContent += '</svg>';
  return svgContent;
}

function createTileElement(tile: TileRenderData, x: number, y: number, size: number): string {
  // For now, create a simple colored rectangle as placeholder
  // In the full implementation, this would load and render the actual tile SVG files
  const transform = `translate(${x} ${y}) rotate(${tile.rotate}) ${tile.flip ? 'scale(-1, 1)' : ''}`;
  
  // Create a simple tile representation
  const tileContent = `
    <g transform="${transform}">
      <rect x="${-size/2}" y="${-size/2}" width="${size}" height="${size}" fill="${tile.colA}" stroke="${tile.colB}" stroke-width="2"/>
      <circle cx="0" cy="0" r="${size/4}" fill="${tile.colB}"/>
      <text x="0" y="0" text-anchor="middle" dy="0.35em" font-size="${size/6}" fill="white" font-weight="bold">${tile.tileNum}</text>
    </g>
  `;
  
  return tileContent;
}

// Function to convert SVG to data URL for download
export function svgToDataURL(svgContent: string): string {
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
}

// Function to convert SVG to PNG (for server upload)
export function svgToPNG(svgContent: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = 300;
    canvas.height = 300;
    
    img.onload = () => {
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create PNG blob'));
          }
        }, 'image/png');
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load SVG image'));
    
    // Use data URL instead of base64 encoding to handle special characters
    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
    img.src = dataUrl;
  });
} 