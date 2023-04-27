import React, { useState, useCallback } from "react";
import axios, { AxiosPromise } from "axios";
import styled from "styled-components";
import { primaryColor } from "../App";
import { Link } from "@reach/router";

const API_URI = "https://api.interscript.org/prod";

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
            <h1> Detect script conversion systems used from existing text </h1>
            <p>
              When given a pair of transliterated text, often one would need to
              know what exact script conversion system was used to create the
              output.
            </p>
            <p>
              This has always been a tricky problem given the large number of
              existing script conversion systems, some of which apply per
              script and per language.
              With Interscript's extensive set of script conversion systems,
              this is no longer a challenge.
            </p>
            <p>
              The system detection feature of Interscript outputs a list of
              potential script conversion systems used for a given pair, sorted
              by likelyhood as measured by the Levenshtein distance.
              On this page, a maximum of 10 systems are returned.
            </p>
            <p>
              Why would a text pair match more than one system? One might ask.
              The reason is that many script conversion systems for the same
              script and language will have similarities, and very often they
              share the same conversion rules.
              Note that even a match with zero distance does not provide 100%
              confidence of the system used, as there could be multiple systems
              that produce the same output given an input.
            </p>

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
                    value="Detect system used"
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
