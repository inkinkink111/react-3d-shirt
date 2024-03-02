import React from "react";

import { useSnapshot } from "valtio";

import state from "../store";
import { Tab } from "../config/model";

type TabProps = {
  tab: Tab;
  isFilter?: boolean;
  isActive?: boolean;
  handleClick: () => void;
};

const Tab: React.FC<TabProps> = ({ tab, isFilter, isActive, handleClick }) => {
  const snap = useSnapshot(state);

  const activeStyle =
    isFilter && isActive
      ? { backgroundColor: snap.color, opacity: 0.5 }
      : { backgroundColor: "transparent", opacity: 1 };

  return (
    <div
      key={tab.name}
      className={`tab-btn ${
        isFilter ? "rounded-full glassmorhism" : "rounded-4"
      }`}
      onClick={handleClick}
      style={activeStyle}
    >
      <img
        src={tab.icon}
        alt={tab.name}
        className={`${
          isFilter ? "w-2/3 h-2/3" : "w-11/12 h-11/12 object-contain"
        }`}
      />
    </div>
  );
};

export default Tab;
