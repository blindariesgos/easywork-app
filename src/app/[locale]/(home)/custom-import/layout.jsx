import Header from "@/src/components/header/Header";
import { Fragment } from "react";

const layout = ({ children }) => {
  return (
    <div className="bg-gray-100 h-full p-2 rounded-xl relative">
      <Header />
      {children}
    </div>
  );
};

export default layout;
