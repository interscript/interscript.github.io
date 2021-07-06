import React from 'react';
import { useRouteData } from "react-static"
import { AdocStyleWrapper } from "./AdocStyleWrapper";
export default () => {
    const { section } = useRouteData();
    console.log(section.html);
    return (
        <AdocStyleWrapper>
            <div dangerouslySetInnerHTML={{ __html: `<div>${section.html}</div>` }}></div>
        </AdocStyleWrapper>
    )
}
