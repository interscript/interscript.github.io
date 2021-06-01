import React from "react";
import { useRouteData } from "react-static";
import ExamplePage from "containers/ExamplePage";
import TopNav from "components/TopNav";
import { ScriptConversionExample } from "../../types";

export default () => {
  const { samples }: { samples: ScriptConversionExample[] } = useRouteData();

  return (
    <>
      <TopNav />
      <h2>{`ODNI systems`}</h2>
      <p>
        <i>{`Each title of a language or a writing system is followed by a note on the appropriate romanization system used (ODNI = Office of the Director of National Intelligence)`}</i>
      </p>
      <ExamplePage samples={samples} authority="ODNI" />
    </>
  );
};
