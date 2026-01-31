
import { useState, useEffect } from 'react';
import './App.css';

// --- TypeScript Interfaces ---

interface ClothingItem {
  id: number;
  name: string;
  type: string;
  image_url: string;
  z_index: number;
}

interface CharacterInfo {
  id: number;
  name: string;
  base_image_url: string;
}

type Outfit = {
  [key: string]: ClothingItem | null;
  hair: ClothingItem | null;
  top: ClothingItem | null;
  bottom: ClothingItem | null;
  shoes: ClothingItem | null;
};

type LoadingStatus = 'loading' | 'success' | 'error';


function App() {
  const [allCharacters, setAllCharacters] = useState<CharacterInfo[]>([]);
  const [character, setCharacter] = useState<CharacterInfo | null>(null);
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [outfit, setOutfit] = useState<Outfit>({ hair: null, top: null, bottom: null, shoes: null });
  const [status, setStatus] = useState<LoadingStatus>('loading');

  useEffect(() => {
    const fetchData = async () => {
      setStatus('loading');
      try {
        const [itemsRes, charsRes] = await Promise.all([
          fetch('/api/v1/clothing-items'),
          fetch('/api/v1/characters')
        ]);

        if (!itemsRes.ok || !charsRes.ok) throw new Error('Network response was not ok');

        const items: ClothingItem[] = await itemsRes.json();
        const chars: CharacterInfo[] = await charsRes.json();

        setWardrobe(items);
        setAllCharacters(chars);

        // Set default selected character
        if (chars.length > 0) setCharacter(chars[0]);
        
        // Set default outfit
        setOutfit({
          hair: items.find(item => item.id === 1) || null,
          top: items.find(item => item.id === 101) || null,
          bottom: items.find(item => item.id === 201) || null,
          shoes: items.find(item => item.id === 301) || null,
        });

        setStatus('success');
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setStatus('error');
      }
    };

    fetchData();
  }, []);

  const handleEquipItem = (item: ClothingItem) => {
    setOutfit(prev => ({ ...prev, [item.type]: item }));
  };

  const handleRemoveItem = (type: string) => {
    setOutfit(prev => ({ ...prev, [type]: null }));
  };

  const handleSelectCharacter = (char: CharacterInfo) => {
    setCharacter(char);
  }

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return <div className="status-message">Loading from API...</div>;
      case 'error':
        return <div className="status-message error">Error: Failed to load data from API. Is the backend server running?</div>;
      case 'success':
        return (
          <main className="main-content">
            <CharacterView character={character} outfit={outfit} />
            <div className="right-panel">
              <CharacterSelection characters={allCharacters} currentCharacter={character} onSelect={handleSelectCharacter} />
              <WardrobeView wardrobe={wardrobe} onEquip={handleEquipItem} onRemove={handleRemoveItem} />
            </div>
          </main>
        );
    }
  }

  return (
    <div className="app">
      <h1 className="title">Clothing Game</h1>
      {renderContent()}
    </div>
  );
}

// --- Sub-components ---

interface CharacterViewProps {
  character: CharacterInfo | null;
  outfit: Outfit;
}

const CharacterView = ({ character, outfit }: CharacterViewProps) => {
  if (!character) return <div className="character-view">Initializing...</div>;
  const equippedItems = Object.values(outfit).filter((item): item is ClothingItem => item !== null).sort((a, b) => a.z_index - b.z_index);
  return (
    <div className="character-view">
      <div className="character-container">
        <img src={character.base_image_url} alt={character.name} className="character-layer" style={{ zIndex: 0 }} />
        {equippedItems.map(item => (
          <img key={item.id} src={item.image_url} alt={item.name} className="character-layer" style={{ zIndex: item.z_index }} />
        ))}
      </div>
    </div>
  );
};

interface CharacterSelectionProps {
  characters: CharacterInfo[];
  currentCharacter: CharacterInfo | null;
  onSelect: (character: CharacterInfo) => void;
}

const CharacterSelection = ({ characters, currentCharacter, onSelect }: CharacterSelectionProps) => (
  <div className="character-selection">
    <h2 className="panel-title">Select Character</h2>
    <div className="character-list">
      {characters.map(char => (
        <div 
          key={char.id} 
          className={`character-card ${currentCharacter?.id === char.id ? 'active' : ''}`}
          onClick={() => onSelect(char)}
        >
          <img src={char.base_image_url} alt={char.name} className="character-thumbnail" />
          <p>{char.name}</p>
        </div>
      ))}
    </div>
  </div>
);


interface WardrobeViewProps {
    wardrobe: ClothingItem[];
    onEquip: (item: ClothingItem) => void;
    onRemove: (type: string) => void;
}

const WardrobeView = ({ wardrobe, onEquip, onRemove }: WardrobeViewProps) => {
    const [currentTab, setCurrentTab] = useState('top');
    const categories = ['hair', 'top', 'bottom', 'shoes'];
    const itemsForTab = wardrobe.filter(item => item.type === currentTab);
    return (
        <div className="wardrobe-view">
            <div className="wardrobe-tabs">
              <h2 className="panel-title">Wardrobe</h2>
              <div className="tab-buttons">
                {categories.map(cat => (
                    <button key={cat} className={`tab-button ${currentTab === cat ? 'active' : ''}`} onClick={() => setCurrentTab(cat)} >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
              </div>
            </div>
            <div className="wardrobe-items">
                 <div className="item-card" onClick={() => onRemove(currentTab)}>
                    <div className="item-remove-icon">X</div>
                    <p>Remove</p>
                </div>
                {itemsForTab.map(item => (
                    <div key={item.id} className="item-card" onClick={() => onEquip(item)}>
                        <img src={item.image_url} alt={item.name} className="item-thumbnail" />
                        <p>{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
