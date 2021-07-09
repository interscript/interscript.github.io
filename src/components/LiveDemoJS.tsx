import Interscript from "interscript";
import React, { useEffect, useRef, useState } from "react";
import { InterscriptMetaDataMap } from "../meta";
import { ScriptConversionSystem, systemToCode } from "../scs";
import { getLanguageTitleFrom6392or3 } from "components/isoLang";
import { SystemSelector } from "./SystemSelector";
import { primaryColor } from "../App";
import styled from "styled-components";

const LiveDemo: React.FC<{ maps: string[]; metaData: InterscriptMetaDataMap }> = function ({ maps, metaData }) {
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

        let test: string | null;
        if (systemCode !== null) {
            test = getTestExample(systemCode);
            if (test !== null) {
                setSampleText(test);
            }
        }
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

    function getTestExample(system: string): string | null {
        return metaData[system].test && metaData[system].test[0];
    }

    async function handleConvert() {
        if (systemCode !== null && sampleText.trim() !== "") {
            let resp: string;

            setError(null);
            setResult(undefined);
            setSubmitted(true);

            try {
                Interscript.map_path = "/maps/";
                await Interscript.load_map(systemCode);
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

export default LiveDemo;
