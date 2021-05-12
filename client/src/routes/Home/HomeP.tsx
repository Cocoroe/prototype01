import React from "react";
// import TabExample from "components/TabExample";
// import ExampleStyled from "components/ExampleStyled";
import TradingView from "components/TradingView";
import TableExample from "components/TableExample";

interface IHomeP {
  selectedTicker: string | undefined;
  setSelectedTicker: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const HomeP: React.FunctionComponent<IHomeP> = ({
  selectedTicker,
  setSelectedTicker,
}) => {
  console.log("changed selectedTicker", selectedTicker);
  return (
    <div>
      <TradingView theme="dark" symbol={selectedTicker} />
      {/* <TabExample /> */}
      {/* <ExampleStyled text="hello there" color={"BLUE"} /> */}
      <TableExample setSelectedTicker={setSelectedTicker} />
    </div>
  );
};

export default HomeP;
