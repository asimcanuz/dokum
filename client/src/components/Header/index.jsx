import React from "react";

function Header({ title, description }) {
  return (
    <div className="flex flex-col align-center justify-start ">
      <h2 className="font-medium leading-light text-4xl mt-0 mb-2  text-slate-700 dark:text-slate-400">
        {title}
      </h2>
      <span className="accent-current/50">{description}</span>
    </div>
  );
}

export default Header;
