import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { db } from '../src/app/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { formInput, uuid, dateCreated, userId } = req.body;

  try {
    // Generate character with OpenAI's ChatGPT
    const chatGptResponse = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: formInput,
      max_tokens: 60,
    }, {
      headers: {
        'Authorization': `Bearer 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`,
      },
    });
    const profile = parseChatGptResponse(chatGptResponse.data);
    console.log(chatGptResponse.data)
    // Generate image with image generation API
    const imageResponse = await generateImage(profile["Appearance"]);
    const imageUrl = parseImageResponse(imageResponse);

    // Update Firestore
    await setDoc(doc(db, 'characters', uuid), {
      character: profile,
      imageUrl,
      dateCreated,
      userId,
    }, { merge: true });

    res.status(200).json({ data: 'Success' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
}

function parseChatGptResponse(data: any): any {
  const characterProfile = data.choices[0].text.trim(); // Replace with correct path to the output text in the response
  const lines = characterProfile.split('\n');
  const profile: {[key: string]: string} = {};
  lines.forEach((line: { split: (arg0: string) => { (): any; new(): any; map: { (arg0: (str: any) => any): [any, any]; new(): any; }; }; }) => {
    const [key, value] = line.split(':').map(str => str.trim());
    if (key && value) {
      profile[key] = value;
    }
  });
  return profile;
}

async function generateImage(appearance: string): Promise<any> {
  const config = {
    method: 'post',
    url: 'https://api.thenextleg.io/v2/imagine',
    headers: { 
      'Authorization': 'Bearer YOUR_IMAGE_GENERATION_API_KEY', // Replace with your image generation API key
      'Content-Type': 'application/json'
    },
    data: {
      msg: appearance,
      ref: "",
      webhookOverride: ""
    },
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

function parseImageResponse(response: any): string {
  // TODO: Implement this function to parse the response from the image generation API
  // and return the image URL.
  return response.imageUrl;
}
