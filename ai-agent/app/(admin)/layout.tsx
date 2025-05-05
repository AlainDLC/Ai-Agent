import React from "react";
import Header from "../components/Header";

function Adminlayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Header />
      <div>{/* SideBar */}</div>
      <div>{children}</div>
    </div>
  );
}

export default Adminlayout;
