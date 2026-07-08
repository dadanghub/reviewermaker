export const runtime = 'nodejs';

function getGradeGuidance(gradeLevel) {
  const gradeNum = parseInt(String(gradeLevel).replace(/\D/g, ''), 10) || 4;

  if (gradeNum <= 3) {
    return {
      vocabularyNote:
        'Use very simple, everyday vocabulary and very short sentences (aim for under 10 words per sentence). Avoid technical or academic terms unless you explain them in a single simple phrase right away. Favor concrete, familiar examples (home, family, school, animals, food) over abstract ones.',
      formatNote:
        'Use only simple, beginner-friendly assessment formats: Identification, True or False, Matching Type, Fill in the Blank, and simple Multiple Choice. Avoid formats that require abstract reasoning, such as Cause and Effect, Compare and Contrast, or multi-step Classification.',
    };
  }

  return {
    vocabularyNote:
      'Use simple vocabulary, short sentences, clear explanations, and age-appropriate examples. Avoid unnecessary academic language.',
    formatNote:
      'Possible formats: Multiple Choice, Identification, True or False, Matching Type, Fill in the Blank, Short Answer, Enumeration, Classification, Sequencing, Cause and Effect, Compare and Contrast, Odd One Out, Labeling, Complete the Table.',
  };
}

export async function POST(request) {
  try {
    const { topics, subject, gradeLevel } = await request.json();

    if (!topics || topics.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Please provide at least one lesson topic' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const safeSubject = subject && subject.trim().length > 0 ? subject.trim() : 'General';
    const safeGradeLevel = gradeLevel && gradeLevel.trim().length > 0 ? gradeLevel.trim() : 'Grade 4';
    const { vocabularyNote, formatNote } = getGradeGuidance(safeGradeLevel);

    const systemPrompt = `You are an expert curriculum developer, instructional designer, assessment writer, and experienced elementary school teacher.

Your responsibility is to generate professional, classroom-ready review sheets from lesson topics provided by the user.

The review sheet should teach the lesson briefly, reinforce the important ideas, and provide enough practice for students to prepare for quizzes and examinations.

Always prioritize educational quality, readability, and printability.

TARGET AUDIENCE:
• ${safeGradeLevel} students
• Filipino learners
• Subject: ${safeSubject}

${vocabularyNote}

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

${formatNote}

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

FORMATTING RULES:
Do not use LaTeX or math notation (e.g., $\rightarrow$, \times, \cdot). This output is rendered as plain markdown, not math-typeset text.
For sequences or arrows, use the plain arrow character → directly (e.g., Determiner → Quantity → Quality), never wrap it in dollar signs or backslash commands.

CONTENT QUALITY:
Information must be factually correct, curriculum appropriate, logically organized, concise, and easy to study.
Definitions should focus on understanding instead of memorization.
Examples should come from everyday situations whenever possible.
Practice questions should assess understanding instead of rote memorization.`;

    const userMessage = `Generate a complete review sheet based on these lesson topics:\n\n${topics}\n\nReturn ONLY the review sheet content. Begin immediately with the title. Do not include any preamble, explanation, or markdown formatting indicators.`;

    // Fallback chain: try each model in order until one succeeds.
    // gemini-2.0-* was retired by Google on 2026-06-01, so gemini-2.5-flash-lite
    // is used as the final, cheapest/fastest fallback tier instead.
    const MODEL_FALLBACK_CHAIN = [
      'gemini-3.5-flash',
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
    ];

    let reviewContent = null;
    let lastError = null;

    for (const model of MODEL_FALLBACK_CHAIN) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: systemPrompt }],
              },
              contents: [
                {
                  role: 'user',
                  parts: [{ text: userMessage }],
                },
              ],
              generationConfig: {
                maxOutputTokens: 4000,
              },
            }),
          }
        );

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          lastError = error;
          console.error(`Gemini API error (${model}):`, JSON.stringify(error));
          continue; // try the next model in the chain
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];
        const text = candidate?.content?.parts?.map((p) => p.text || '').join('');

        // Some responses can come back with no text (e.g. safety block, MAX_TOKENS
        // with no content yet) - treat that as a failure and fall back too.
        if (!text) {
          lastError = { reason: 'empty_response', finishReason: candidate?.finishReason };
          console.error(`Gemini API returned no text (${model}):`, JSON.stringify(lastError));
          continue;
        }

        reviewContent = text;
        console.log(`Review sheet generated successfully using ${model}`);
        break; // success, stop the fallback chain
      } catch (err) {
        lastError = { message: err.message };
        console.error(`Gemini API request threw (${model}):`, err.message);
        continue;
      }
    }

    if (!reviewContent) {
      console.error('All Gemini models in the fallback chain failed:', JSON.stringify(lastError));
      return new Response(
        JSON.stringify({ error: 'Failed to generate review sheet' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
