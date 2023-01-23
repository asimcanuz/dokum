import React from "react";

function ModalHeader({ title, toogle }) {
  return (
    <div
      className="flex items-start justify-between 
    p-5 
    bg-slate-50 dark:bg-slate-900
    border-b border-solid border-slate-200
    rounded-t"
    >
      <h3 className="text-3xl font-semibold">{title}</h3>
      {toogle ? (
        <button
          className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
          onClick={toogle}
        >
          <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
            ×
          </span>
        </button>
      ) : null}
    </div>
  );
}

ModalHeader.defaultProps = {
  title: "Modal Header",
};

export default ModalHeader;
