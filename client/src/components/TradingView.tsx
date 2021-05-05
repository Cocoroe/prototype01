import React, { Component } from "react";

interface ITradingView {}

export default class TradingView extends Component<{}, ITradingView> {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  componentWillUnmount() {}
  render() {
    return <div></div>;
  }
}
