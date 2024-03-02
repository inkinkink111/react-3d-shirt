import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";

import config from "../config/config";
import state from "../store";
import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";

import {
  AIPicker,
  ColorPicker,
  CustomButton,
  FilePicker,
  Tab,
} from "../components";

import { Filter } from "../config/model";

type DecalTypeKey = keyof typeof DecalTypes;
type DecalType = {
  stateProperty: string;
  filterTab: string;
};

const Customizer = () => {
  const snap = useSnapshot(state);

  const [file, setFile] = useState<File>();

  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [activeEditor, setActiveEditor] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<any>({
    logoShirt: true,
    stylishShirt: false,
  });

  // Show active tab
  const generateTabContent = () => {
    switch (activeEditor) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            isGenerating={isGenerating}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (type: "logo" | "full") => {
    if (!prompt) return alert("Please enter a prompt");

    try {
      setIsGenerating(true);
      //
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTJkYWRmZDUtMTE1Ni00NTk0LWI4YmQtN2M2ZjgyYzIyNDU3IiwidHlwZSI6ImFwaV90b2tlbiJ9.BSEzcgn95HuK7M_T80PMHIkwu8BfhSyHw39q0GyjBgc"}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providers: "openai",
          text: prompt,
          resolution: "512x512",
          fallback_providers: "",
        }),
      };

      await fetch("https://api.edenai.run/v2/image/generation", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          handleDecal(
            type,
            `data:image/png;base64,${data.openai.items[0].image}`
          );
        })
        .catch((error) => {
          console.error("Fetch error: ", error);
        });
      //
    } catch (err) {
      alert(err);
    } finally {
      setIsGenerating(false);
      setActiveEditor("");
    }
  };

  const handleDecal = (type: DecalTypeKey, result: any) => {
    const decalType: DecalType = DecalTypes[type];
    if (decalType.stateProperty === "logoDecal") {
      state.logoDecal = result;
    } else {
      state.fullDecal = result;
    }

    if (!activeFilter[decalType.filterTab]) {
      handleActiveFilter(decalType.filterTab);
    }
  };

  const handleActiveFilter = (tabName: string) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilter[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilter[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    //
    setActiveFilter((prevState: any) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      };
    });
  };

  const readFile = (type: DecalTypeKey) => {
    if (file) {
      reader(file).then((result) => {
        handleDecal(type, result);
        setActiveEditor("");
      });
    }
  };

  return (
    <AnimatePresence>
      {!snap.isHome && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className=" flex items-center min-h-screen">
              <div className=" editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => {
                      if (activeEditor === tab.name) {
                        setActiveEditor("");
                      } else {
                        setActiveEditor(tab.name);
                      }
                    }}
                  />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>
          <motion.div
            className=" absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => {
                setActiveEditor("");
                state.isHome = true;
              }}
              customStyle="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>

          <motion.div className="filter-container" {...slideAnimation("up")}>
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilter
                isActive={activeFilter[tab.name]}
                handleClick={() => handleActiveFilter(tab.name)}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
