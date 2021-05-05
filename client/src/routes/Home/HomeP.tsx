import React from "react";
import TabExample from "components/TabExample";
import ExampleStyled from "components/ExampleStyled";

const HomeP = () => {
  return (
    <div>
      <TabExample />
      <ExampleStyled text="hello there" color={"BLUE"} />
    </div>
  );
};

export default HomeP;
