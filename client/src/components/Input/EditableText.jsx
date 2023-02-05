import React, { useState } from "react";
import Input from ".";

function EditableText({ type, value, ...props }) {
  const [clicked, setClicked] = useState(false);

  const InputArea = () => {
    return <Input type={type} value={value} autoFocus {...props} />;
  };
  const TextArea = () => {
    return <div>{value}</div>;
  };
  return (
    <div onClick={() => setClicked(true)} onBlur={() => setClicked(false)}>
      {clicked ? <InputArea /> : <TextArea />}
    </div>
  );
}

export default EditableText;
