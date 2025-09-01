'use server';

/**
 * @fileOverview Generates catchy event taglines using an AI-powered tool.
 *
 * - generateTagline - A function that generates a tagline for an event.
 * - GenerateTaglineInput - The input type for the generateTagline function.
 * - GenerateTaglineOutput - The return type for the generateTagline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTaglineInputSchema = z.object({
  eventTitle: z.string().describe('The title of the event.'),
  eventDescription: z.string().describe('A brief description of the event.'),
});
export type GenerateTaglineInput = z.infer<typeof GenerateTaglineInputSchema>;

const GenerateTaglineOutputSchema = z.object({
  tagline: z.string().describe('A catchy tagline for the event.'),
});
export type GenerateTaglineOutput = z.infer<typeof GenerateTaglineOutputSchema>;

export async function generateTagline(input: GenerateTaglineInput): Promise<GenerateTaglineOutput> {
  return generateTaglineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTaglinePrompt',
  input: {schema: GenerateTaglineInputSchema},
  output: {schema: GenerateTaglineOutputSchema},
  prompt: `You are a marketing expert specializing in creating catchy taglines for events.\n\nBased on the event title and description provided, generate a short, engaging, and memorable tagline for the event.\n\nEvent Title: {{{eventTitle}}}\nEvent Description: {{{eventDescription}}}\n\nTagline:`,
});

const generateTaglineFlow = ai.defineFlow(
  {
    name: 'generateTaglineFlow',
    inputSchema: GenerateTaglineInputSchema,
    outputSchema: GenerateTaglineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
