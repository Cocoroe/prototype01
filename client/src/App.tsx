import React from "react";
import Header from "components/Header";
import HomeC from "routes/Home/HomeC";
import Footer from "components/Footer";
import { ThemeProvider } from "styled-components";
import theme from "styles/theme";
// import * as ReactGa from "react-ga";

function App() {
  React.useEffect(() => {
    // ReactGa.initialize("G-V49E6YEB1G");
    // ReactGa.pageview(window.location.pathname + window.location.search);
    return () => {};
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Header text="QuantCo" />
        <HomeC />
        <Footer />
      </ThemeProvider>
    </>
  );
}

export default App;
