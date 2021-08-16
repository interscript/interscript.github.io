import React, { useState, useCallback } from "react";
import axios, { AxiosPromise } from "axios";
import styled from "styled-components";
import { primaryColor } from "../App";
import { Link } from "@reach/router";

const API_URI = "https://api.interscript.org";

interface SystemRelevance {
    distance: number;
    mapName: string;
}

export default () => {
    const [source, setSource] = useState<string>("");
    const [target, setTarget] = useState<string>("");
    const [result, setResult] = useState<SystemRelevance[]>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const detectAPI = useCallback(
        (input: String, output: String): AxiosPromise<any> => {
            return axios.post(
                API_URI,
                `{
                  detect(input: "${input}", output: "${output}") {
                    distance,
                    mapName
                  }
                }`
            );
        },
        [source, target]
    );

    const detect = async () => {
        clear();
        if (source && target) {
            setLoading(true);
            try {
                const resp = await detectAPI(source, target);
                if (resp.data?.data?.detect) {
                    setResult(resp.data["data"]["detect"]);
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const clear = () => {
        setResult([]);
    };

    const list = result
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10) // take first 10 best relevance search results
        .map((s: SystemRelevance, i) => (
            <li key={i}>
                <Link to={`/systems/${s.mapName}`} key={s.mapName}>
                    <code style={{ color: i < 3 ? "red" : "none" }}>{s.mapName}</code>
                </Link>
            </li>
        ));

    return (
        <div>
            <h1> Detect Transliteration System</h1>
            <SampleAndResult>
                <SampleTextArea
                    placeholder={"Input source text"}
                    style={{
                        boxShadow: source.trim() === "" ? `#${primaryColor} 0 0 0px .5rem` : undefined,
                    }}
                    onChange={(evt) => setSource(evt.currentTarget.value)}
                />
                <ConvertButton
                    onClick={detect}
                    value="Detect"
                    disabled={loading || source.trim() === "" || target.trim() === ""}
                >
                    Detect
                </ConvertButton>
                <ResultTextArea
                    placeholder={"Input target text"}
                    style={{
                        boxShadow: target.trim() === "" ? `#${primaryColor} 0 0 0px .5rem` : undefined,
                    }}
                    onChange={(evt) => setTarget(evt.currentTarget.value)}
                />
            </SampleAndResult>
            <ul>
                {error && <li>{error}</li>}
                {list}
            </ul>
        </div>
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
