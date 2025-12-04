'use client';

import { useState } from 'react';

export interface CodeExampleProps {
  code: string;
  language: string;
  title?: string;
  runnable?: boolean;
  editable?: boolean;
  highlightLines?: number[];
  showLineNumbers?: boolean;
}

export function CodeExample({
  code: initialCode,
  language,
  title,
  runnable = false,
  editable = false,
  highlightLines = [],
  showLineNumbers = true,
}: CodeExampleProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    if (language !== 'javascript' && language !== 'typescript') {
      setError('Only JavaScript/TypeScript code can be executed');
      return;
    }

    setIsRunning(true);
    setError('');
    setOutput('');

    try {
      // Create a sandboxed console
      const logs: string[] = [];
      const sandboxConsole = {
        log: (...args: any[]) => logs.push(args.map(String).join(' ')),
        error: (...args: any[]) => logs.push('ERROR: ' + args.map(String).join(' ')),
        warn: (...args: any[]) => logs.push('WARN: ' + args.map(String).join(' ')),
      };

      // Execute code in a sandboxed context
      const func = new Function('console', code);
      func(sandboxConsole);

      setOutput(logs.join('\n') || 'Code executed successfully (no output)');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsRunning(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const codeLines = code.split('\n');

  return (
    <div className="code-example-container">
      {title && <div className="code-example-title">{title}</div>}
      
      <div className="code-example-wrapper">
        <div className="code-example-header">
          <span className="code-example-language">{language}</span>
          {runnable && (
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="code-example-run-button"
            >
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
          )}
        </div>

        <div className="code-example-content">
          {editable ? (
            <textarea
              value={code}
              onChange={handleCodeChange}
              className="code-example-editor"
              spellCheck={false}
              rows={codeLines.length}
            />
          ) : (
            <pre className="code-example-pre">
              <code className={`language-${language}`}>
                {codeLines.map((line, index) => {
                  const lineNumber = index + 1;
                  const isHighlighted = highlightLines.includes(lineNumber);
                  
                  return (
                    <div
                      key={index}
                      className={`code-line ${isHighlighted ? 'highlighted' : ''}`}
                    >
                      {showLineNumbers && (
                        <span className="line-number">{lineNumber}</span>
                      )}
                      <span className="line-content">{line || ' '}</span>
                    </div>
                  );
                })}
              </code>
            </pre>
          )}
        </div>

        {runnable && (output || error) && (
          <div className="code-example-output">
            <div className="code-example-output-header">Output:</div>
            <pre className={error ? 'code-example-error' : 'code-example-success'}>
              {error || output}
            </pre>
          </div>
        )}
      </div>

      <style jsx>{`
        .code-example-container {
          margin: 1.5rem 0;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        .code-example-title {
          padding: 0.75rem 1rem;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .code-example-wrapper {
          background: #1e1e1e;
          color: #d4d4d4;
        }

        .code-example-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
          background: #2d2d2d;
          border-bottom: 1px solid #3e3e3e;
        }

        .code-example-language {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #9ca3af;
          font-weight: 600;
        }

        .code-example-run-button {
          padding: 0.25rem 0.75rem;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.75rem;
          cursor: pointer;
          font-weight: 500;
        }

        .code-example-run-button:hover:not(:disabled) {
          background: #059669;
        }

        .code-example-run-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .code-example-content {
          overflow-x: auto;
        }

        .code-example-pre {
          margin: 0;
          padding: 1rem;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .code-example-editor {
          width: 100%;
          padding: 1rem;
          background: #1e1e1e;
          color: #d4d4d4;
          border: none;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          resize: vertical;
          outline: none;
        }

        .code-line {
          display: flex;
          min-height: 1.5rem;
        }

        .code-line.highlighted {
          background: rgba(255, 255, 0, 0.1);
          border-left: 3px solid #fbbf24;
          padding-left: 0.5rem;
          margin-left: -0.5rem;
        }

        .line-number {
          display: inline-block;
          width: 3rem;
          text-align: right;
          margin-right: 1rem;
          color: #6b7280;
          user-select: none;
        }

        .line-content {
          flex: 1;
          white-space: pre;
        }

        .code-example-output {
          border-top: 1px solid #3e3e3e;
          background: #252525;
        }

        .code-example-output-header {
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
        }

        .code-example-output pre {
          margin: 0;
          padding: 1rem;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 0.875rem;
          overflow-x: auto;
        }

        .code-example-success {
          color: #10b981;
        }

        .code-example-error {
          color: #ef4444;
        }
      `}</style>
    </div>
  );
}
