'use server';

import {
  generateTagline,
  GenerateTaglineInput,
} from '@/ai/flows/generate-tagline';

import { 
  generateEventDescription,
  GenerateEventDescriptionInput
} from '@/ai/flows/generate-event-description';


export async function generateTaglineAction(
  input: GenerateTaglineInput
): Promise<{ tagline: string } | { error: string }> {
  try {
    const result = await generateTagline(input);
    return { tagline: result.tagline };
  } catch (error) {
    console.error('Error generating tagline:', error);
    return { error: 'Failed to generate a tagline. Please try again.' };
  }
}

export async function generateDescriptionAction(
  input: GenerateEventDescriptionInput
): Promise<{ description: string } | { error: string }> {
  try {
    const result = await generateEventDescription(input);
    return { description: result.description };
  } catch (error) {
    console.error('Error generating description:', error);
    return { error: 'Failed to generate a description. Please try again.' };
  }
}
