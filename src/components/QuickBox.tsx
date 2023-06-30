import axios, { AxiosResponse } from "axios";
import Interscript from "interscript";
import React, { useEffect, useRef, useState } from "react";
import { InterscriptMetaDataMap } from "../meta";
import { ScriptConversionSystem, systemToCode } from "../scs";
import { getLanguageTitleFrom6392or3 } from "components/isoLang";
import { SystemSelector2 } from "./SystemSelector2";
import { primaryColor } from "../App";
import styled from "styled-components";
import { ScriptDetectionData } from "../auto_detect";

const { detectScriptObject } = require("../detect_script.js");

const API_ENDPOINT = "https://api.interscript.org/prod";
const ARABIC_LANG = "ara";

const QuickBox: React.FC<{ maps: string[]; metaData?: InterscriptMetaDataMap }> = function ({ maps }) {
    const [sampleText, setSampleText] = useState<string>("");
    const [selectedSystem, selectSystem] = useState<ScriptConversionSystem | null>(null);
    const [result, setResult] = useState<string | null | undefined>(null);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [diacriticize, setDiacriticize] = useState<boolean>(false);
    const [autoDetectedScriptInfo, setAutoDetectedScriptInfo] = useState<ScriptDetectionData | null>(null);

    const sampleInputRef = useRef<HTMLTextAreaElement>(null);

    const systemCode: string | null = selectedSystem !== null ? systemToCode(selectedSystem) : null;

    useEffect(() => {
        setError(null);
        setSubmitted(false);
        setDiacriticize(autoDetectedScriptInfo?.diacritization_needed);
    }, [systemCode, sampleText]);

    async function handleConvert() {
        if (systemCode !== null && sampleText.trim() !== "") {
            setError(null);
            setResult(undefined);
            setSubmitted(true);

            let respApi: AxiosResponse<any>;
            let resp: string;
            const apiCall = diacriticize;
            try {
                let systemName = systemCode;
                if (diacriticize) {
                    systemName = `var-ara-Arab-Arab-rababa|${systemName}`;
                    respApi = await axios({
                        method: "POST",
                        url: API_ENDPOINT,
                        data: `{transliterate(systemCode: \"${systemName}\", input: \"${sampleText}\")}`,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                } else {
                    Interscript.map_path = "/maps/";
                    await Interscript.load_map(systemName);
                    resp = Interscript.transliterate(systemName, sampleText);
                }
            } catch (e) {
                setResult(null);
                setSubmitted(false);
                setError("Sorry, an error occurred :(");
            }
            setResult(
                (apiCall ? respApi?.data?.data?.transliterate : resp) || "No result returned, please check your sample!"
            );
        }
    }

    function autoDetectScripts(inputStr: string) {
        if (!!inputStr && inputStr.trim() !== "") {
            const result = detectScriptObject(inputStr);
            setAutoDetectedScriptInfo(result);
        } else {
            setAutoDetectedScriptInfo(null);
        }
    }

    const onChangeSource = (evt: React.ChangeEvent<HTMLTextAreaElement>): void => {
        const newVal = evt.currentTarget.value;
        setSampleText(newVal);
        autoDetectScripts(newVal);
    };

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
                    onChange={onChangeSource}
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
            <p style={{ height: "1rem" }} />
            {selectedSystem?.lang === ARABIC_LANG && (
                <div>
                    <input type="checkbox" checked={diacriticize} onChange={(e) => setDiacriticize(e.target.checked)} />
                    Diacriticize Arabic
                </div>
            )}
            {systemCode !== null ? (
                <p>
                    <small>
                        Selected script conversion system code:&emsp;
                        <code>{systemCode}</code>
                    </small>
                </p>
            ) : null}
            <SystemSelector2
                onSelect={selectSystem}
                systemCodes={maps}
                availableSourceScripts={autoDetectedScriptInfo?.scripts}
                inputStr={sampleText}
            />
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

export default QuickBox;
