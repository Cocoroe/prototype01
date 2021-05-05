import React from "react";
import styled from "styled-components";

type ColorTypoEnum = "PINK" | "BLUE";

interface IExampleStyled {
  color: ColorTypoEnum;
  text: string;
}

const ExampleStyled: React.FunctionComponent<IExampleStyled> = ({
  color,
  text,
}) => {
  return (
    <div>
      <ColorTypo colorType={color}>{text}</ColorTypo>
    </div>
  );
};

export default ExampleStyled;

const ColorTypo = styled.span<{ colorType: ColorTypoEnum }>`
  color: ${(props) =>
    props.colorType === "BLUE" ? props.theme.blueColor : props.theme.pinkColor};
  background-color: ${(props) => props.theme.pinkColor};
`;
