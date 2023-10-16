import React, { useState, useEffect } from 'react';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase'; 
import type { Character } from './CharacterCard';
import { onAuthStateChanged } from 'firebase/auth';

interface CharacterDetailsProps {
  character: Character;
  onClose: () => void;
}

const fetchCharacter = async (documentId: string) => {
  const docRef = doc(db, 'characters', documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { ...docSnap.data(), documentId: docSnap.id };

  } else {
    console.log('No such document!');
    return null;
  }
};

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    // User is signed in
    return uid
  } else {
    // User is signed out
  }
  
})
const CharacterDetails = ({ character, onClose}: CharacterDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableCharacter, setEditableCharacter] = useState<Character>(character)
  const [userId, setUserId] = useState<string | null>(null);
  ;

  useEffect(() => {
    setEditableCharacter(character);
  }, [character]);



  const toggleEdit = () => {
    if (isAuthor) {
      setIsEditing(!isEditing);
    }
  };
  const isAuthor = onAuthStateChanged( auth, (user) => user?.uid )=== character.authorID;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableCharacter({
      ...editableCharacter,
      [name]: value,
    });
  };

  const handleSave = async () => {
    const characterRef = doc(db, 'characters', editableCharacter.id);
    await setDoc(characterRef, { ...editableCharacter, userId: auth.currentUser?.uid }, { merge: true });
  };
  
  useEffect(() => {
    setEditableCharacter(character);
  }, [character]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const { name,personality, race, classLevel, background, alignment, equipment, spellsAbilities, abilityScores, bonds, createdOn, appearance } = editableCharacter;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-lg shadow-md max-w-screen-lg overflow-hidden">
          <div className="p-4 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-2xl font-medium mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleInputChange}
                  />
                ) : (
                  name
                )}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <p>
                  <span className="font-bold">Race:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="race"
                      value={editableCharacter.race}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>
                    <span className="font-bold">Race:</span> {editableCharacter.race}
                  </p>
                  )}
                </p>
                <p>
                  <span className="font-bold">Class:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="classLevel"
                      value={classLevel}
                      onChange={handleInputChange}
                    />
                  ) : (
                    classLevel
                  )}
                </p>
                <p>
                  <span className="font-bold">Background:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="background"
                      value={background}
                      onChange={handleInputChange}
                    />
                  ) : (
                    background
                  )}
                </p>
                <p>
                  <span className="font-bold">Alignment:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="alignment"
                      value={alignment}
                      onChange={handleInputChange}
                    />
                  ) : (
                    alignment
                  )}
                </p>
                <p>
                  <span className="font-bold">Equipment:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="equipment"
                      value={equipment}
                      onChange={handleInputChange}
                    />
                  ) : (
                    equipment
                  )}
                </p>
                <p>
                  <span className="font-bold">Spells/Abilities:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="spellsAbilities"
                      value={spellsAbilities}
                      onChange={handleInputChange}
                    />
                  ) : (
                    spellsAbilities
                  )}
                </p>
                <p>
                  <span className="font-bold">Ability Scores:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="abilityScores"
                      value={abilityScores}
                      onChange={handleInputChange}
                    />
                  ) : (
                    abilityScores
                  )}
                </p>
                <p>
                  <span className="font-bold">Bonds:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="bonds"
                      value={bonds}
                      onChange={handleInputChange}
                    />
                  ) : (
                    bonds
                  )}
                </p>
                <p>
                  <span className="font-bold">Created On:</span>
                  {createdOn}
                </p>
                <p>
                  <span className="font-bold">Appearance:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="appearance"
                      value={appearance}
                      onChange={handleInputChange}
                    />
                  ) : (
                    appearance
                  )}
                </p>
              </div>
            </div>
            <div className="flex justify-end items-center">
      {isAuthor && ( // Show edit and save buttons only if the user is the author
        <>
          <button
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={toggleEdit}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          {isEditing && (
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={() => handleSave()}
            >
              Save
            </button>
          )}
        </>
      )}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={onClose}
      >
        Close
      </button>
    </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetails;
