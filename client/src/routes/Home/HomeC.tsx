import React from "react";
import HomeP from "./HomeP";

const HomeC = () => {
  const [selectedTicker, setSelectedTicker] = React.useState<string>();

  return (
    <HomeP
      selectedTicker={selectedTicker}
      setSelectedTicker={setSelectedTicker}
    />
  );
};

export default HomeC;
