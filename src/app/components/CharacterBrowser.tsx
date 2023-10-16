'use client'
import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from "@firebase/firestore";
import { db } from '../firebase';
import CharacterCard from './CharacterCard';

interface Character {
  id: string;
  name: string;
  race: string;
  classLevel: string;
  background: string;
  personality: string;
  equipment: string;
  spellsAbilities: string;
  abilityScores: string;
  bonds: string;
  alignment: string;
  appearance: string;
  createdOn: string;
  imageUrl: string;
  collectionId: string;
  description: string;
  userId: string;
}

// Define pagination parameters
const PAGE_SIZE = 10; // Number of documents per page

const CharacterBrowser = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchCharacters = async () => {
      const charactersCollection = collection(db, 'characters');
      const querySnapshot = await getDocs(charactersCollection);
      const charactersData: Character[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const character: Character = {
          id: doc.id,
          name: data.name || data.Name,
          race: data.race || data.Race,
          classLevel: data.classLevel || data.ClassLevel,
          background: data.background || data.Background,
          personality: data.personality || data.Personality,
          equipment: data.equipment || data.Equipment,
          spellsAbilities: data.spellsAbilities || data.SpellsAbilities,
          abilityScores: data.abilityScores || data.AbilityScores,
          bonds: data.bonds || data.Bonds,
          alignment: data.alignment || data.Alignment,
          appearance: data.appearance || data.Appearance,
          createdOn: data.createdOn || data.CreatedOn,
          imageUrl: data.imageUrl || data.ImageUrl,
          collectionId: data.collectionId || data.CollectionId,
          description: data.description || data.Description,
          userId: data.userId || data.UserId,
        };
        charactersData.push(character);
      });

      setCharacters(charactersData);
      setFilteredCharacters(charactersData);
    };

    fetchCharacters();
  }, []);

  const handleSearch = () => {
    const filtered = characters.filter((character) => {
      return (
        character.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        character.race.toLowerCase().includes(searchInput.toLowerCase()) ||
        character.classLevel.toLowerCase().includes(searchInput.toLowerCase()) ||
        character.background.toLowerCase().includes(searchInput.toLowerCase()) ||
        character.personality.toLowerCase().includes(searchInput.toLowerCase()) ||
        character.equipment.toLowerCase().includes(searchInput.toLowerCase()) ||
        character.spellsAbilities.toLowerCase().includes(searchInput.toLowerCase()) ||
        character.abilityScores.toLowerCase().includes(searchInput.toLowerCase()) ||
        character.bonds.toLowerCase().includes(searchInput.toLowerCase()) ||
        character.alignment.toLowerCase().includes(searchInput.toLowerCase()) ||
        character.appearance.toLowerCase().includes(searchInput.toLowerCase()) ||
        (character.description && character.description.toLowerCase().includes(searchInput.toLowerCase())) // Add a check for description property
      );
    });

    setFilteredCharacters(filtered);
    setCurrentPage(1);
  };

  const handleSortByDate = () => {
    const sortedCharacters = [...filteredCharacters].sort(
      (a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
    );
    setFilteredCharacters(sortedCharacters);
  };

  const handleNextPage = () => {
    if (currentPage * PAGE_SIZE < filteredCharacters.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const startAfter = (currentPage - 1) * PAGE_SIZE;
  const endBefore = currentPage * PAGE_SIZE;

  return (
    <div style={{ paddingTop: '70px' }}>
      <div className="search-bar" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search characters..."
          style={{ width: '50%', height: '40px', fontSize: '16px', padding: '10px' }}
        />
        <button onClick={handleSearch} style={{ marginLeft: '10px', padding: '10px', fontSize: '16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>Search</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}>
        <button onClick={handleSortByDate} style={{ marginRight: '10px', padding: '10px', fontSize: '16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>Sort by date</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 justify-center items-center min-h-screen">
        {filteredCharacters.slice(startAfter, endBefore).map((character) => (
          <div className="min-w-auto justify-center items-center" key={character.id}>
            <CharacterCard character={character} name={''} race={''} classLevel={''} background={''} personality={''} equipment={''} spellsAbilities={''} abilityScores={''} bonds={''} alignment={''} createdOn={''} imageUrl={''} collectionId={''} description={''} userId={''} appearance={''} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px' }}>
        <button onClick={handlePreviousPage} style={{ marginRight: '10px', padding: '10px', fontSize: '16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>Previous</button>
        <button onClick={handleNextPage} style={{ marginLeft: '10px', padding: '10px', fontSize: '16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>Next</button>
      </div>
    </div>
  );
};

export default CharacterBrowser;
