import React from "react";
import { useRouteData } from "react-static";

export default () => {
    const { doc } = useRouteData();
    console.log(doc.label);
    return (
        <div>
        test
        </div>
    )
}