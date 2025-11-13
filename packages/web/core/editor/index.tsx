'use client';

import { useCallback, useEffect, useRef } from 'react';

interface DSLEditorProps {
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  height?: string;
  options?: Record<string, any>;
}

export function DSLEditor({ value, onChange, className = '', height, options = {} }: DSLEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    },
    [onChange]
  );

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = value;
    }
  }, [value]);

  const isReadOnly = options.readOnly || options.domReadOnly || false;
  const style = height ? { height } : {};

  return (
    <textarea
      ref={textareaRef}
      defaultValue={value}
      onChange={handleChange}
      readOnly={isReadOnly}
      style={style}
      className={`font-mono text-sm w-full ${height ? '' : 'h-full'} p-4 bg-[var(--editor-bg)] text-[var(--editor-fg)] border-0 outline-none resize-none ${className}`}
      spellCheck={false}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
    />
  );
}
