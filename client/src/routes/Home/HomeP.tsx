import React from "react";
import TabExample from "components/TabExample";
import ExampleStyled from "components/ExampleStyled";
import TradingView from "components/TradingView";
import TableExample from "components/TableExample";

const HomeP = () => {
  return (
    <div>
      <TradingView />
      <TabExample />
      <ExampleStyled text="hello there" color={"BLUE"} />
      <TableExample/>
    </div>
  );
};

export default HomeP;
