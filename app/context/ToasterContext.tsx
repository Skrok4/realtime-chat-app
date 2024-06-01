"use client";

import { Toaster } from "react-hot-toast";

const ToasterContext = () => {
  return <Toaster containerStyle={{ zIndex: 9999 }} />;
};

export default ToasterContext;
