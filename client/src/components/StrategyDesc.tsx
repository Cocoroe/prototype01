import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  // height: 8vh;
  padding: 2vh;
  font-size: 1.5vh;
  font-weight: 700;
  background-color: ${(props) => props.theme.blackColor1};
  color: ${(props) => props.theme.whiteColor1};

  .longText {
    white-space: pre-wrap;
    color: ${(props) => props.theme.redColor1};
  }
  .shortText {
    white-space: pre-wrap;
    color: ${(props) => props.theme.greenColor1};
  }
  .reportText {
    white-space: pre-wrap;
  }
`;

interface IStrategyDesc {
  title: string | undefined;
  longText: string | undefined;
  shortText: string | undefined;
  reportText: string | undefined;
}

const StrategyDesc: React.FunctionComponent<IStrategyDesc> = ({
  title,
  longText,
  shortText,
  reportText,
}) => {
  return (
    <Wrapper>
      <div className="title">{title}</div>
      <div className="longText">{longText}</div>
      <div className="shortText">{shortText}</div>
      <div className="reportText">{reportText}</div>
    </Wrapper>
  );
};

export default StrategyDesc;
