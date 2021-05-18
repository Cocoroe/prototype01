import React, { Component } from "react";

//https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/class_components/

type theme = "dark" | "light";

// props typing
interface PTradingView {
  // rootRef:React.RefObject<HTMLDivElement>
  width?: number | string;
  height?: number | string;
  theme?: theme;
  symbol?: string;
}

// state typing
interface STradingView {}

export default class TradingView extends Component<PTradingView, STradingView> {
  rootRef: React.RefObject<HTMLDivElement>;
  container_id: string = `tradingview_${Math.ceil(Math.random() * 1000)}`;

  constructor(props) {
    super(props);
    this.rootRef = React.createRef<HTMLDivElement>();
  }

  componentDidMount() {
    console.log("this.props.symbol,", this.props.symbol);
    new window.TradingView.widget({
      width: this.props.width || "100%",
      height: this.props.height || 610,
      symbol: this.props.symbol,
      interval: "60",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      allow_symbol_change: true,
      container_id: this.container_id,
    });
  }
  componentWillUnmount() {}

  shouldComponentUpdate(nextProps: PTradingView, nextState: STradingView) {
    if (this.props.symbol !== nextProps.symbol) {
      new window.TradingView.widget({
        width: this.props.width || "100%",
        height: this.props.height || 610,
        symbol: nextProps.symbol,
        interval: "1",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: this.container_id,
      });
    }
    return this.props.symbol !== nextProps.symbol;
  }

  render() {
    return (
      <div ref={this.rootRef}>
        <div className="tradingview-widget-container">
          <div id={this.container_id}></div>
        </div>
      </div>
    );
  }
}
