import React from "react";
import styled from "styled-components";

const HeaderDiv = styled.div`
  height: 8vh;
  padding: 2vh;
  font-size: 2.5vh;
  font-weight: 700;
  background-color: ${(props) => props.theme.blackColor1};
  color: ${(props) => props.theme.whiteColor1};
`;
const Header = () => {
  return <HeaderDiv>QuantCo</HeaderDiv>;
};

export default Header;
