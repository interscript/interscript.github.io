import React, { useState, useEffect, useRef } from "react";
import { useRouteData } from "react-static";
// import { AxiosResponse } from "axios";
import styled from "styled-components";
import TopNav from "components/TopNav";
import { SystemSelector } from "components/SystemSelector";
import { ScriptConversionSystem, systemToCode } from "../scs";

import { primaryColor } from "../App";
import { getLanguageTitleFrom6392or3 } from "components/isoLang";
import Interscript from "interscript";

export default () => {
    const {
        mapsInfo,
    }: {
        mapsInfo: any;
    } = useRouteData();

    const [demoIsShowable, setDemoIsShowable] = useState(false);

    useEffect(() => {
        // Ensures interactive elements are not included in static HTML
        setDemoIsShowable(true);
    }, []);

    const summary = Object.keys(mapsInfo.languages)
        .map((alpha3) => `${getLanguageTitleFrom6392or3(alpha3)} (${mapsInfo.languages[alpha3]})`)
        .sort()
        .join(", ");

    return (
        <>
            <SectionGrid>
                <Section>
                    <p>{`The live demo supports ${mapsInfo?.meta.total} transliteration systems.`} </p>
                </Section>
            </SectionGrid>

            <SectionGrid>
                {demoIsShowable ? (
                    <Section>
                        <h2>Try it live - Javascript Version</h2>
                        <LiveDemo maps={mapsInfo.data} />
                    </Section>
                ) : null}
            </SectionGrid>

            <SectionGrid>
                <Section>
                    <h2>{`Statistics`}</h2>
                    <p>{summary}</p>
                </Section>
            </SectionGrid>

            <SectionGrid>
                <Section>
                    <h2>{`Copyright`}</h2>
                    <p>{`Ribose© 2021. All rights reserved.`}</p>
                </Section>
            </SectionGrid>
        </>
    );
};

const LiveDemo: React.FC<{ maps: string[] }> = function ({ maps }) {
    const [sampleText, setSampleText] = useState<string>("");
    const [selectedSystem, selectSystem] = useState<ScriptConversionSystem | null>(null);
    const [result, setResult] = useState<string | null | undefined>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const sampleInputRef = useRef<HTMLTextAreaElement>(null);

    const systemCode: string | null = selectedSystem !== null ? systemToCode(selectedSystem) : null;

    useEffect(() => {
        setError(null);
        setSubmitted(false);
    }, [systemCode, sampleText]);

    useEffect(() => {
        if (systemCode) {
            sampleInputRef.current?.focus();
        }

        (async () => {
            let test: string | null;
            if (systemCode !== null) {
                test = await getTestExample(systemCode);
                if (test !== null) {
                    setSampleText(test);
                }
            }
        })();
    }, [systemCode]);

    useEffect(() => {
        (async () => {
            try {
                // await Interscript.load_map_list();
                // setSystemCodes(maps);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

    async function getTestExample(system: string): Promise<string | null> {
        Interscript.map_path = "/maps/";
        await Interscript.load_map(system);
        //Todo: find a solution to get sample data as the map files no longer include test data

        return null;
    }

    async function handleConvert() {
        if (systemCode !== null && sampleText.trim() !== "") {
            let resp: string;

            setError(null);
            setResult(undefined);
            setSubmitted(true);

            try {
                resp = Interscript.transliterate(systemCode, sampleText);
            } catch (e) {
                setResult(null);
                setSubmitted(false);
                setError("Sorry, an error occurred :(");
            }
            setResult(resp || "No result returned, please check your sample!");
        }
    }

    let placeholder: string;
    if (selectedSystem?.lang) {
        placeholder = `Enter something in ${
            getLanguageTitleFrom6392or3(selectedSystem.lang) || "selected writing system"
        }…`;
    } else {
        placeholder = "Enter something…";
    }

    return (
        <>
            <SystemSelector onSelect={selectSystem} systemCodes={maps} />

            <SampleAndResult>
                <SampleTextArea
                    ref={sampleInputRef}
                    value={sampleText}
                    placeholder={placeholder}
                    style={{
                        boxShadow:
                            sampleText.trim() === "" && systemCode !== null
                                ? `#${primaryColor} 0 0 0px .5rem`
                                : undefined,
                    }}
                    onChange={(evt) => setSampleText(evt.currentTarget.value)}
                />

                <ConvertButton
                    onClick={handleConvert}
                    disabled={submitted === true || systemCode === null || sampleText.trim() === ""}
                >
                    Convert &rarr;
                </ConvertButton>

                <ResultTextArea
                    placeholder={selectedSystem === null ? "Select a system above" : undefined}
                    disabled
                    value={result === undefined ? "Loading…" : result || error || ""}
                />
            </SampleAndResult>

            {systemCode !== null ? (
                <p>
                    <small>
                        Selected script conversion system code:&emsp;
                        <code>{systemCode}</code>
                    </small>
                </p>
            ) : null}
        </>
    );
};

const ConvertButton = styled.button`
    flex-shrink: 0;
    margin: 0 0.5rem;
    padding: 0.5rem 1rem;
    border: 0;
    font-size: 100%;

    color: ${(props) => (props.disabled ? "silver" : `white`)};

    background: ${(props) => (props.disabled ? "whiteSmoke" : `#${primaryColor}`)};
`;

const SampleAndResult = styled.div`
    margin-top: 1rem;

    > :first-child,
    > :last-child {
        width: 100%;
    }

    @media screen and (min-width: 900px) {
        display: flex;
        flex-flow: row nowrap;
        align-items: flex-start;

        > :first-child,
        > :last-child {
            flex: 1;
            width: unset;
        }
    }
`;

const SampleTextArea = styled.textarea`
    font-size: 100%;
    padding: 0.5rem;
    margin: 0;
    background: whiteSmoke;
    border: 0;
    z-index: 2;
    display: block;
`;

const ResultTextArea = styled(SampleTextArea)`
    cursor: default;
`;

const Section = styled.article`
    a.anchor {
        margin-right: 0.5rem;

        &,
        &:link,
        &:visited {
            border: none;
        }
    }

    a[rel*="noopener"] {
        &,
        &:link,
        &:visited {
            border: none;
        }
    }
`;

const SectionGrid = styled.div`
    overflow: hidden;
    padding: 0 1rem;
`;
