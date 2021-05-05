import React, { Component } from "react";

//https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/class_components/

// state typing
interface STradingView {}

// props typing
interface PTradingView {
  // rootRef:React.RefObject<HTMLDivElement>
}

export default class TradingView extends Component<PTradingView, STradingView> {
  rootRef: React.RefObject<HTMLDivElement>;
  constructor(props) {
    super(props);
    this.rootRef = React.createRef<HTMLDivElement>();
  }

  componentDidMount() {
    new window.TradingView.widget({
      width: 980,
      height: 610,
      symbol: "NASDAQ:AAPL",
      interval: "D",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      allow_symbol_change: true,
      container_id: "tradingview_a521c",
    });
  }
  componentWillUnmount() {}
  render() {
    return (
      <div ref={this.rootRef}>
        <div className="tradingview-widget-container">
          <div id="tradingview_a521c"></div>
        </div>
      </div>
    );
  }
}
