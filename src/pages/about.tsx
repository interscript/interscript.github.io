import React from "react";
import { HeaderMenu } from "../components/HeaderMenu";

export default () => (
    <>
    <HeaderMenu />
    <h2>About Interscript</h2>
    <div>
      <p>
        The Interscript project was first conceived in 2017 stemming
        from the work at <a href="https://www.iso.org/standard/78143.html">ISO 24229 "Codes for script conversion systems"</a> of
        <a href="https://www.iso.org/committee/48750.html">ISO/TC 46/WG 3</a>. {" "}
        The initial work was led by Ribose.
      </p>
      <p>
        A method was needed to allow for interoperability of transliteration
        systems of identical definitions, and also a way to implement
        machine-executable script conversion systems such that they are
        platform-independent and also independent of programming languages.
      </p>
      <p>
        The need and benefits of allowing script conversion systems to be
        implemented in a machine-readable format, compared to the traditional
        way of expressing conversion rules in plain text, are clear.
        A new platform-independent language was developed to allow encoding of
        script conversion systems and applied to all systems implemented by
        Interscript, numbering over 200+.
      </p>
      <p>
        Interscript is continuously growing in terms of number of systems,
        features, as well as in scope.
      </p>
    </div>
    <h2>Supporters of Interscript</h2>
    <div>
      <p>The Interscript project has received extensive support from the following
        organizations and individuals, and wishes to express its appreciation to
        them (in no particular order):
      </p>
      <ul>
        <li>
          <a href="http://www.math.bas.bg/logic/ivanovll/Lyubomir-Ivanov.html">
            Prof. Lyubomir Ivanov {" "}
          </a> {" "}
          (<a href="https://en.wikipedia.org/wiki/Lyubomir_Ivanov_(explorer)">on Wikipedia</a>),
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
          <a href="https://www.eki.ee/wgrs/">
            Working Group on Romanization Systems
          </a>
          {" "} of the {" "}
          <a href="https://unstats.un.org/unsd/ungegn/">
            United Nations Group of Experts on Geographical Names
          </a>
        </li>
        <li>
          <a href="https://www.icao.int">International Civil Aviation Organization (ICAO)</a>
        </li>
      </ul>
    </div>
    </>
)
