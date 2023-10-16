import { BeatLoader } from 'react-spinners';
import { useAuth } from './../../src/app/components/AuthHandler';
import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI} from "openai";
import * as admin from 'firebase-admin';
import axios from 'axios';

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OpenAI API key is missing");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert('./pages/api/dm-advantage-firebase-adminsdk-bb5l1-e568cd0627.json'),
    databaseURL: '/pages/api/dm-advantage-firebase-adminsdk-bb5l1-e568cd0627.json',
  });
}

const admindb = admin.firestore();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let messageId: string | null = null;

const generateCharacterPrompt = (name: string, description: string, level: string) => {
  let levelText = level ? ` and is at level ${level}` : '';
  return `
Create a character profile for a Dungeons & Dragons game. 
If available, use the name: ${name}${levelText}. 
Reference description: ${description}.

Provide the following details in separate sections:

name: 
race: 
class&Level: 
background: 
personality: 
equipment: 
spellsAbilities: 
abilityScores: ( Strength , Dexterity , Constitution , Intelligence , Wisdom , Charism )
bonds:
flaws:
alignment: 
appearance: 
ideals:

Additionally, describe the character's appearance in less than 90 characters and provide a background story about their life.
  `;
};

async function getCharacterProfileFromGPT(characterData: any): Promise<Record<string, string>> {
  const prompt = generateCharacterPrompt(characterData.name, characterData.description, characterData.level);

  // Make the API call to GPT-3
  const gptResponse = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: "gpt-3.5-turbo",
  });

  const characterProfile = gptResponse.choices[0]?.message?.content;

  if (characterProfile === undefined || characterProfile === null) {
    throw new Error("Character profile content is undefined or null");
  }

  const lines = characterProfile.split('\n');
  const profile: Record<string, string> = {};
  lines.forEach((line: string) => {
    const [key, value] = line.split(':').map((str: string) => str.trim());
    if (key && value) {
      if (key.toLowerCase() === 'class level') {
        profile['classLevel'] = value;
      } else if (key.toLowerCase() === 'spells/abilities'|| key.toLowerCase() === 'spellsabilities') {
        profile['spellsAbilities'] = value;
      } else if (key.toLowerCase() === 'class/level' || key.toLowerCase() === 'classlevel' || key.toLowerCase() === 'class & level' || key.toLowerCase() === 'class&level') {
        profile['classLevel'] = value;
      } else if (key.toLowerCase() === 'abilityscores' || key.toLowerCase() === 'ability scores') {
        profile['abilityScores'] = value;
      } else {
        profile[key.toLowerCase()] = value;
      }
    }
  });
  


  return profile;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  let firstImageUrl: string | null = null; 


  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const characterData = req.body;
    console.log(characterData.userId)
    const uid = characterData.userId;  // Directly use the userId from the request body

    // Verify the UID matches the one in the request body
    if (uid !== characterData.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get the character profile from ChatGPT
    const profileFromGPT = await getCharacterProfileFromGPT(characterData);
    const profileForFirestore: Record<string, any> = {};
    
    // Loop through the keys in the parsed profile
    for (const [key, value] of Object.entries(profileFromGPT)) {
      profileForFirestore[key] = value;
    }
    
    // Add additional fields
    profileForFirestore['createdOn'] = new Date().toISOString();
    profileForFirestore['authorID'] = characterData.userId;
    
    if (!characterData.userId) {
      throw new Error("Author ID is missing");
    }

    //console.log("Profile object for Firestore:", profileForFirestore);

    // Create a new document in the 'characters' collection
    const docRef = admindb.collection('characters').doc(characterData.uuid);
    await docRef.set(profileForFirestore);

  // Trigger the image generation
  await fetchImage(profileForFirestore.appearance);
  await new Promise(resolve => setTimeout(resolve, 5000));  
  // Poll for progress
  var response = null;
  do {
    response = await checkImageProgress();
    console.log(response.data.progress);
    await new Promise(resolve => setTimeout(resolve, 5000));  // Wait for 5 seconds before checking again
  } while (response?.data.progress < 100);

  // Update the Firestore document
  await docRef.update({ imageUrl: response.data.response.imageUrl });

  // Return the document ID to the frontend
  res.status(200).json({ id: docRef.id});
    if (response.data.response.imageUrl) {
      // Fetch the specific image based on the first image
      const midJourneyAPIImage = await MidjourneyAPIGet( await upScaleButton(response.data.response.buttonMessageId));

      if (midJourneyAPIImage) {
        // Update the Firestore document with the specific image URL
        await docRef.update({ imageUrl: midJourneyAPIImage });
      }
    }
    

    // Return the document ID to the frontend
    res.status(200).json({ id: docRef.id, imageUrl: firstImageUrl });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

//ToDO Add apperience to remove function fetchImage
async function MidjourneyAPIGet(messageId: string) {
  try {
    let progress = 0;
    let response;

    while (progress < 100) {
      const url = `https://api.thenextleg.io/v2/message/${messageId}?expireMins=2`;
      const headers = {
        'Authorization': 'Bearer ff639d8b-afe4-46f2-831b-ac087b12dec8',
        'Content-Type': 'application/json',
      };

      response = await axios.get(url, { headers });

      if (response && response.data && typeof response.data.progress === 'number') {
        progress = response.data.progress;
      }

      if (progress < 100) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (response && response.data && response.data.response && response.data.response.imageUrl) {
      const imageUrl = response.data.response.imageUrl;
      console.log(`Image URL: ${imageUrl}`);
      return imageUrl;
    } else {
      throw new Error("Image URL not found");
    }

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data || error.message);
    } else {
      console.error("Error with MidjourneyAPIGet:", error);
    }
    throw new Error("Error with MidjourneyAPIGet");
  }
}

  async function fetchImage(appearance: string) {
    try {
      const url = 'https://api.thenextleg.io/v2/imagine';
      const headers = {
        'Authorization': 'Bearer ff639d8b-afe4-46f2-831b-ac087b12dec8',
        'Content-Type': 'application/json'
      };
      const data = {
        msg: `Fantasy Character Portrait: ${appearance}`,  
        ref: "",
      };
  
      const response = await axios.post(url, data, { headers });
      messageId = response.data.messageId;
      
      return response.data;
    } catch (error) {
      console.error("Error fetching image:", error);
      throw new Error("Failed to fetch image");
    }
  }
  async function upScaleButton(buttonMessageId: string,) {
    try {
      if (!messageId) {
        throw new Error('Message ID is missing');
      }
      
      const data = JSON.stringify({
        "button": "U1", 
        "buttonMessageId": buttonMessageId,
        "ref": "",
        "webhookOverride": ""
      });
      
      const config = {
        method: 'post',
        url: 'https://api.thenextleg.io/v2/button',
        headers: {
          'Authorization': 'Bearer ff639d8b-afe4-46f2-831b-ac087b12dec8',
          'Content-Type': 'application/json'
        },
        data: data
      };


      var response = await axios(config);
      console.log(response);
      console.log("======================================first check======================================");

      while (!response.data.success) {
        await new Promise(resolve => setTimeout(resolve, 5000));  // Wait for 5 seconds before checking again
        response = await axios(config);
      }
      console.log("============================================================================")
      console.log(response.data.messageId);
      return response.data.messageId  // Return the specificImageMessageID

    } catch (error) {
      console.error("Error fetching specific image:", error);
      throw new Error("Failed to fetch specific image");
    }
    
  }
  
  
  
  async function checkImageProgress() {
    const url = 'https://api.thenextleg.io/v2/message/' + messageId + '?expireMins=2';  
    const headers = {
      'Authorization': 'Bearer ff639d8b-afe4-46f2-831b-ac087b12dec8',
      'Content-Type': 'application/json'
    };

    const response = await axios.get(url, { headers });
    return response;  
  }
  