import React from "react";
import { CustomButton } from ".";

interface AIPickerProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  isGenerating: boolean;
  handleSubmit: (type: "logo" | "full") => void;
}

const AIPicker: React.FC<AIPickerProps> = ({
  prompt,
  setPrompt,
  isGenerating,
  handleSubmit,
}) => {
  return (
    <div className="aipicker-container">
      <textarea
        className="aipicker-textarea"
        rows={5}
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
        placeholder="Ask AI here..."
      ></textarea>
      <div className="flex flex-wrap gap-3">
        {isGenerating ? (
          <CustomButton
            type="outline"
            title="Asking AI..."
            customStyle="text-xs"
          />
        ) : (
          <>
            <CustomButton
              type="outline"
              title="AI logo"
              handleClick={() => handleSubmit("logo")}
              customStyle="text-xs"
            />
            <CustomButton
              type="filled"
              title="Ai Full"
              handleClick={() => handleSubmit("full")}
              customStyle="text-xs"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AIPicker;
