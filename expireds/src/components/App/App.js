"use client";

import { Navbar } from "../Navbar";
import { Footer } from "../Footer";
import { Header } from "./Sections";

export const App = ({user}) => {
  return (
    <>
      <Navbar user={user}/>
      <div className="app">
        <Header user={user}/>
      </div>
      <Footer />
    </>
  );
};
