import React from "react";

function ModalBody({ children }) {
  return (
    <div className="relative p-6 flex-auto bg-white dark:bg-slate-900">
      {children}
    </div>
  );
}

export default ModalBody;
