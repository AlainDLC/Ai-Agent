import React from "react";
import Header from "../components/Header";
import SideBar from "../components/SideBar";

function Adminlayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col flex-1 ">
      <Header />
      <div className="flex flex-col lg:flex-row bg-slate-100 ">
        <SideBar />

        <div className="flex-1 flex justify-center lg:justify-start items-start max-w-5xl mx-auto w-full ">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Adminlayout;
