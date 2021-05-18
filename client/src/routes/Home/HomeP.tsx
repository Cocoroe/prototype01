import React from "react";
// import TabExample from "components/TabExample";
// import ExampleStyled from "components/ExampleStyled";
import TradingView from "components/TradingView";
import TableExample from "components/TableExample";
import Strategy13 from "components/strategy/Strategy13";
import Header from "components/Header";
import StrategyDesc from "components/StrategyDesc";

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
      <Header text="Strategy13" />
      <StrategyDesc
        title="전략 S13. 슈퍼상승장 + 변동성 돌파"
        longText={`
- 조건1 : 3,5,10,20(일) 이평선 < 현재가
(SMA3, SMA5, SMA10, SMA10, SMA20 < NOW_PRICE )
- 조건2 : 변동성 돌파 만족 ( k=0.5 )
( OPEN_PRICE + (HIGH - LOW)*0.5 < NOW_PRICE)
`}
        shortText="
매도 타이밍 (2가지)
1. 변동성 돌파 전략 : 24시간
2. 이동평균 전략 : 이평선 이하로 하락하면 매도 
        "
        reportText="
Ref: 가상화폐 투자 마법 공식 13
복리수익 63.50% | MDD 2.51% | 승률 60.64% | 손익비 2.73 | 1일 1% 이상 손실 11회
        "
      />
      <Strategy13 setSelectedTicker={setSelectedTicker} />
      <Header text="ALL Coins" />
      <TableExample setSelectedTicker={setSelectedTicker} />
    </div>
  );
};

export default HomeP;
