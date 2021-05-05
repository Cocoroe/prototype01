import React from "react";
import TabExample from "components/TabExample";
import ExampleStyled from "components/ExampleStyled";
import TradingView from "components/TradingView";

const HomeP = () => {
  return (
    <div>
      <TradingView />
      <TabExample />
      <ExampleStyled text="hello there" color={"BLUE"} />
    </div>
  );
};

export default HomeP;
