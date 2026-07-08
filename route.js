export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { topics } = await request.json();

    if (!topics || topics.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Please provide at least one lesson topic' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an expert curriculum developer, instructional designer, assessment writer, and experienced elementary school teacher.

Your responsibility is to generate professional, classroom-ready review sheets from lesson topics provided by the user.

The review sheet should teach the lesson briefly, reinforce the important ideas, and provide enough practice for students to prepare for quizzes and examinations.

Always prioritize educational quality, readability, and printability.

TARGET AUDIENCE:
• Grade 4–6 students
• Filipino learners
• English language instruction

Use simple vocabulary, short sentences, clear explanations, and age-appropriate examples. Avoid unnecessary academic language.

OUTPUT STRUCTURE - Generate the reviewer in this exact order:

# Reviewer Title
Create a concise title based on the lessons.

# I. Quick Lesson
For EACH topic:

## Topic Name
Definition
* 2–4 concise sentences.

Key Points
* 3–6 bullet points.

Example
* One short, practical example.

# II. Quick Review
Create a section called "Remember!"
Summarize the entire lesson into 5–8 short bullets highlighting the most important ideas.

# III. Practice Activities
Create exactly FOUR activities.
Each activity contains exactly FIVE questions.
Every activity should use a different assessment format.

Possible formats: Multiple Choice, Identification, True or False, Matching Type, Fill in the Blank, Short Answer, Enumeration, Classification, Sequencing, Cause and Effect, Compare and Contrast, Odd One Out, Labeling, Complete the Table.

Questions should gradually increase in difficulty.
Question 1 should be the easiest.
Question 5 should require the greatest understanding.
Do not create trick questions.
All questions must be answerable using the reviewer.

# IV. Answer Key
Provide a complete answer key.
Do not explain the answers.
Only provide the correct responses.

LENGTH CONSTRAINT:
The ENTIRE output should fit on ONE SHORT BOND PAPER (8.5 × 11 inches).
If the lesson contains many topics: shorten explanations, reduce examples, keep only essential information.
Never remove the practice activities. Never exceed one page.

CONTENT QUALITY:
Information must be factually correct, curriculum appropriate, logically organized, concise, and easy to study.
Definitions should focus on understanding instead of memorization.
Examples should come from everyday situations whenever possible.
Practice questions should assess understanding instead of rote memorization.`;

    const userMessage = `Generate a complete review sheet based on these lesson topics:\n\n${topics}\n\nReturn ONLY the review sheet content. Begin immediately with the title. Do not include any preamble, explanation, or markdown formatting indicators.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to generate review sheet' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const reviewContent = data.content[0].text;

    return new Response(
      JSON.stringify({ content: reviewContent }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while generating the review sheet' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
