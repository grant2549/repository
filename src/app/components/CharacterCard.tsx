import React, { useState } from 'react';
import '../styles/globals.css';
import CharacterDetails from './CharacterDetail';
import { Firestore } from 'firebase/firestore';

export interface CharacterCardProps {
  character: Character;
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
    createdOn: string;
    imageUrl: string;
    collectionId: string;
    description: string;
    userId: string;
    appearance: string;
}

export type Character = {
  authorID: any;
  documentId(db: Firestore, arg1: string, documentId: any): unknown;
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
  createdOn: string;
  imageUrl: string;
  collectionId: string;
  appearance: string;
  description: string;
  userId: string;
};

  

const CharacterCard = ({ character }: CharacterCardProps) => {
  const { name, race, classLevel, background,personality,equipment,spellsAbilities,abilityScores,bonds, alignment, createdOn, imageUrl, appearance,    collectionId } = character;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetailsClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModalClick = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center bg-white shadow-md rounded-md p-4 w-64">
      <img src={imageUrl} />
        <h2 className="text-xl mt-4 font-bold">{name}</h2>
        <p className="text-sm text-gray-500 mt-2">{race}</p>
        <p className="text-sm text-gray-500 mt-2">{classLevel}</p>
        <p className="text-sm text-gray-700 mt-4">{personality}</p>
        <button 
         onClick={handleViewDetailsClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Details
        </button>
        {isModalOpen && <CharacterDetails character={character} onClose={handleCloseModalClick} />}
    </div>
  );
}


export default CharacterCard;
