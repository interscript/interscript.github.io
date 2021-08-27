import React from "react";
import { Link } from "@reach/router";
import { HeaderMenu } from "../components/HeaderMenu";

export default () => (
    <>
    <HeaderMenu />
    <div>Interscript has been supported by:
        <ul>
            <li>
              Professor Lyubomir Ivanov {" "}
              (of the <Link to="https://www.bas.bg">Bulgarian Academy of Sciences</Link>)
            </li>
            <li>
              <Link to="https://www.usgs.gov/core-science-systems/ngp/board-on-geographic-names">
                US Board on Geographic Names (BGN)
              </Link>
            </li>
            <li>
              <Link to="https://www.ogc.org">
                Open Geospatial Consortium (OGC)
              </Link>
            </li>
            <li>
              <Link to="https://www.calconnect.org">
                CalConnect
              </Link>
            </li>
            <li>
              The <Link to="http://www.eki.ee/wgrs/">
                Working Group on Romanization Systems
              </Link>
              {" "} of the {" "}
              <Link to="https://unstats.un.org/unsd/ungegn/">
                United Nations Group of Experts on Geographical Names
              </Link>
            </li>
        </ul>
    </div>
    </>
)
