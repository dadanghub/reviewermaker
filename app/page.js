'use client';

import { useState, useRef } from 'react';
import styles from './page.module.css';

// --- Lightweight markdown parser for the AI-generated review sheet ---
// Handles: #, ##, ### headers, bullet lists (- or *), numbered lists,
// and inline **bold** / *italic*. Intentionally small and dependency-free.

function parseInline(text, keyPrefix) {
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;
  let idx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2] !== undefined) {
      parts.push(<strong key={`${keyPrefix}-b-${idx++}`}>{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      parts.push(<em key={`${keyPrefix}-i-${idx++}`}>{match[3]}</em>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length ? parts : text;
}

function parseMarkdownToBlocks(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  let currentList = null;

  const flushList = () => {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === '') {
      flushList();
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      blocks.push({ type: 'h3', text: line.slice(4) });
    } else if (line.startsWith('## ')) {
      flushList();
      blocks.push({ type: 'h2', text: line.slice(3) });
    } else if (line.startsWith('# ')) {
      flushList();
      blocks.push({ type: 'h1', text: line.slice(2) });
    } else if (/^[-*]\s+/.test(line)) {
      const text = line.replace(/^[-*]\s+/, '');
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(text);
    } else if (/^\d+[.)]\s+/.test(line)) {
      const text = line.replace(/^\d+[.)]\s+/, '');
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(text);
    } else {
      flushList();
      blocks.push({ type: 'p', text: line });
    }
  }
  flushList();
  return blocks;
}

function ReviewSheetContent({ markdown }) {
  const blocks = parseMarkdownToBlocks(markdown);

  return (
    <>
      {blocks.map((block, i) => {
        const key = `block-${i}`;
        switch (block.type) {
          case 'h1':
            return (
              <h1 key={key} className={styles.reviewH1}>
                {parseInline(block.text, key)}
              </h1>
            );
          case 'h2':
            return (
              <h2 key={key} className={styles.reviewH2}>
                {parseInline(block.text, key)}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={key} className={styles.reviewH3}>
                {parseInline(block.text, key)}
              </h3>
            );
          case 'ul':
            return (
              <ul key={key} className={styles.reviewList}>
                {block.items.map((item, j) => (
                  <li key={`${key}-${j}`}>{parseInline(item, `${key}-${j}`)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={key} className={styles.reviewOrderedList}>
                {block.items.map((item, j) => (
                  <li key={`${key}-${j}`}>{parseInline(item, `${key}-${j}`)}</li>
                ))}
              </ol>
            );
          case 'p':
          default:
            return (
              <p key={key} className={styles.reviewParagraph}>
                {parseInline(block.text, key)}
              </p>
            );
        }
      })}
    </>
  );
}

export default function Home() {
  const [topics, setTopics] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const reviewRef = useRef(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topics }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate review sheet');
      }

      const data = await response.json();
      setReview(data.content);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Review Sheet</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 11pt;
              line-height: 1.5;
              margin: 0.5in;
              color: #111827;
            }
            h1 {
              font-size: 18pt;
              margin-bottom: 10px;
            }
            h2 {
              font-size: 14pt;
              margin-top: 12px;
              margin-bottom: 8px;
              color: #1d4ed8;
            }
            h3 {
              font-size: 12pt;
              margin-top: 10px;
              margin-bottom: 6px;
              color: #2563eb;
            }
            p, li {
              font-size: 10pt;
              margin: 4px 0;
            }
            ul, ol {
              margin: 6px 0;
              padding-left: 20px;
            }
            li {
              margin-bottom: 3px;
            }
            strong {
              font-weight: 700;
            }
            em {
              font-style: italic;
            }
            .section {
              page-break-inside: avoid;
              margin-bottom: 12px;
            }
            @media print {
              body { margin: 0.4in; }
              h1 { font-size: 16pt; }
              h2 { font-size: 12pt; }
              h3 { font-size: 11pt; }
            }
          </style>
        </head>
        <body>${reviewRef.current ? reviewRef.current.innerHTML : ''}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([review], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'review-sheet.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Review Sheet Generator</h1>
          <p className={styles.subtitle}>
            Create professional, classroom-ready review sheets in seconds
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.gridContainer}>
          {/* Input Section */}
          <section className={styles.inputSection}>
            <div className={styles.card}>
              <h2>Enter Lesson Topics</h2>
              <form onSubmit={handleGenerate}>
                <div className={styles.formGroup}>
                  <label htmlFor="topics">
                    Add your lesson topics (one per line):
                  </label>
                  <textarea
                    id="topics"
                    value={topics}
                    onChange={(e) => setTopics(e.target.value)}
                    placeholder="Example:&#10;Matter&#10;Physical and Chemical Changes&#10;Context Clues, Synonyms, Antonyms"
                    className={styles.textarea}
                    disabled={loading}
                  />
                  <p className={styles.hint}>
                    You can enter single topics, combined topics with commas, or one topic per line.
                  </p>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate Review Sheet'}
                </button>
              </form>

              <div className={styles.examples}>
                <h3>Example Topics:</h3>
                <ul>
                  <li>Matter, Physical and Chemical Changes</li>
                  <li>Context Clues, Synonyms, Antonyms</li>
                  <li>Plant Reproduction, Pollination, Seed Dispersal</li>
                  <li>The Water Cycle</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Output Section */}
          <section className={styles.outputSection}>
            {review ? (
              <div className={styles.card}>
                <div className={styles.reviewHeader}>
                  <h2>Your Review Sheet</h2>
                  <div className={styles.buttonGroup}>
                    <button
                      onClick={handlePrint}
                      className={styles.secondaryButton}
                    >
                      🖨 Print
                    </button>
                    <button
                      onClick={handleDownload}
                      className={styles.secondaryButton}
                    >
                      ⬇ Download
                    </button>
                    <button
                      onClick={() => setReview('')}
                      className={styles.secondaryButton}
                    >
                      ↻ Clear
                    </button>
                  </div>
                </div>
                <div className={styles.reviewContent} ref={reviewRef}>
                  <ReviewSheetContent markdown={review} />
                </div>
              </div>
            ) : (
              <div className={styles.card + ' ' + styles.emptyState}>
                <div className={styles.emptyContent}>
                  <div className={styles.emptyIcon}>📄</div>
                  <h3>Your review sheet will appear here</h3>
                  <p>
                    Enter lesson topics on the left and click "Generate Review Sheet" to create a
                    professional, curriculum-aligned worksheet.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>
          💡 Built for educators | Curriculum-aligned | Grade 4–6 | English instruction
        </p>
      </footer>
    </main>
  );
}
