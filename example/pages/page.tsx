import React, { useState } from "react";
import { ComponentA } from "../components/ComponentA/ComponentA";
import { ComponentB } from "../components/ComponentB";

export const Page = () => {
  const [state, setState] = useState(false);
  return (
    <div>
      <p>Page</p>
      {state && <ComponentA />}
      <ComponentB />
      <button onClick={() => setState((prevState) => !prevState)}></button>
    </div>
  );
};
export default Page;
