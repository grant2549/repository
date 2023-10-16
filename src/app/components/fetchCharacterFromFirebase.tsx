import { CharacterCardProps, Character } from './CharacterCard';
import { doc, getDoc} from "firebase/firestore";
import { db } from '../firebase';

const fetchCharacterDetails = async (uuid: string, delay: number): Promise<Character | null> => {
  await new Promise((resolve) => setTimeout(resolve, delay)); // Simulate delay

  const docRef = doc(db, "characters", uuid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const characterData = docSnap.data();
    if (characterData) {
      const character: Character = {
        id: characterData.id,
        description: characterData.description,
        userId: characterData.userID,
        name: characterData.name,
        race: characterData.race,
        classLevel: characterData.classLevel,
        background: characterData.background,
        personality: characterData.personality,
        equipment: characterData.equipment,
        spellsAbilities: characterData.spellsAbilities,
        abilityScores: characterData.abilityScores,
        bonds: characterData.bonds,
        alignment: characterData.alignment,
        createdOn: characterData.createdOn,
        imageUrl: characterData.imageUrl,
        collectionId: characterData.collectionId,
        appearance: characterData.appearance,
      };
      return character;
    }
  }

  return null;
};

//have this return the pop up?  

export default fetchCharacterDetails;
