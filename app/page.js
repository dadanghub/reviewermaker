'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [topics, setTopics] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
            ul {
              margin: 6px 0;
              padding-left: 20px;
            }
            li {
              margin-bottom: 3px;
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
        <body>${review.replace(/\n/g, '<br>')}</body>
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
                <div className={styles.reviewContent}>
                  {review.split('\n').map((line, index) => (
                    <div key={index} className={styles.reviewLine}>
                      {line}
                    </div>
                  ))}
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
