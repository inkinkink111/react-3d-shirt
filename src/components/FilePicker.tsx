import React from "react";

import { CustomButton } from ".";
import { DecalTypes } from "../config/constants";

interface FilePicker {
  file: File | undefined;
  setFile: (file: File) => void;
  readFile: (type: DecalTypeKey) => void;
}

type DecalTypeKey = keyof typeof DecalTypes;

const FilePicker: React.FC<FilePicker> = ({ file, setFile, readFile }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; // Use optional chaining to handle null
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="filepicker-container">
      <div className="flex-1 flex flex-col">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" className="filepicker-label">
          Upload File
        </label>
        <p>{!file ? "No file selected" : file.name}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <CustomButton
          type="outline"
          title="Logo"
          handleClick={async () => readFile("logo")}
          customStyle="text-xs"
        />
        <CustomButton
          type="filled"
          title="Full"
          handleClick={async () => readFile("full")}
          customStyle="text-xs"
        />
      </div>
    </div>
  );
};

export default FilePicker;
