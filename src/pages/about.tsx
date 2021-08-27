import React from "react";
import { HeaderMenu } from "../components/HeaderMenu";

export default () => (
    <>
    <HeaderMenu />
    <div>
      <p>The Interscript project has been supported by the following
        organizations and individuals (in no particular order):
      </p>
      <ul>
        <li>
          <a href="http://www.math.bas.bg/logic/ivanovll/Lyubomir-Ivanov.html">
            Prof. Lyubomir Ivanov {" "}
          </a> {" "}
          (<a href="https://en.wikipedia.org/wiki/Lyubomir_Ivanov_(explorer)">Wikipedia</a>),
          {" "} <a href="https://www.bas.bg">Bulgarian Academy of Sciences</a>
        </li>
        <li>
          <a href="https://www.usgs.gov/core-science-systems/ngp/board-on-geographic-names">
            U.S. Board on Geographic Names (BGN)
          </a>
        </li>
        <li>
          <a href="https://www.ogc.org">
            Open Geospatial Consortium (OGC)
          </a>
        </li>
        <li>
          <a href="https://www.calconnect.org">
            CalConnect
          </a>
        </li>
        <li>
          The <a href="https://www.eki.ee/wgrs/">
            Working Group on Romanization Systems
          </a>
          {" "} of the {" "}
          <a href="https://unstats.un.org/unsd/ungegn/">
            United Nations Group of Experts on Geographical Names
          </a>
        </li>
      </ul>
    </div>
    </>
)
