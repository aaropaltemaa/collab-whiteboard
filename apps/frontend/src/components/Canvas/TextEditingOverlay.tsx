import { useState, useEffect, useRef } from "react";

type TextEditingOverlayProps = {
  x: number;
  y: number;
  initialText: string;
  onSave: (text: string) => void;
  onCancel: () => void;
};

const TextEditingOverlay = ({
  x,
  y,
  initialText,
  onSave,
  onCancel,
}: TextEditingOverlayProps) => {
  const [text, setText] = useState(initialText);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSave(text);
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={() => onSave(text)}
      style={{
        position: "absolute",
        left: x + 10,
        top: y + 40,
        padding: "4px 8px",
        border: "2px solid #007bff",
        borderRadius: "4px",
        fontSize: "16px",
        zIndex: 1000,
        minWidth: "100px",
      }}
    />
  );
};

export default TextEditingOverlay;
