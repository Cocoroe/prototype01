import React from "react";
import Header from "components/Header";
import HomeC from "routes/Home/HomeC";
import Footer from "components/Footer";
import { ThemeProvider } from "styled-components";
import theme from "styles/theme";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Header />
        <HomeC />
        <Footer />
      </ThemeProvider>
    </>
  );
}

export default App;
