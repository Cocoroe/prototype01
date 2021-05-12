import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <FooterContainer>
      <div className="wrapper">
        <div className="left">QuantCo</div>
        <div className="right">
          <div>
            QuantCo 사이트 내 모든 암호화폐 가격 및 투자 관련 정보에 대하여
            어떠한 책임을 부담하지 않습니다.
            <br /> 디지털 자산 투자는 전적으로 스스로의 책임이므로 이에
            유의하시기 바랍니다.
          </div>
          <div style={{ marginTop: "20px" }}>
            피드백 및 문의 : ypd03008@gmail.com
          </div>
        </div>
      </div>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.div`
  background-color: ${(props) => props.theme.blackColor1};
  color: ${(props) => props.theme.whiteColor1};

  width: 100%;
  max-width: 1075px;
  margin: 0 auto;

  .wrapper {
    padding: 50px 0px;
    display: grid;
    grid-template-columns: 1fr 4fr;
    .left {
      font-size: 2.5vh;
      font-weight: 700;
    }
    .right {
    }
  }
`;
