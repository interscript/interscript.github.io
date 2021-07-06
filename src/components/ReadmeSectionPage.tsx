import React from 'react';
import { useRouteData } from "react-static"
import { AdocStyleWrapper } from "./AdocStyleWrapper";
export default () => {
    const { readmeSection } = useRouteData();
    return (
        <AdocStyleWrapper>
            <div  dangerouslySetInnerHTML={{ __html: readmeSection.html }}></div>
        </AdocStyleWrapper>
    )
}
