import React, { useState, useCallback } from "react";
import axios, { AxiosPromise } from "axios";

const API_URI = "https://staging-api.interscript.org/staging";

interface SystemRelevance {
    distance: number;
    map_name: string;
}

/*
// Data format of response from api server
const temp = [
    {
        distance: 5.3,
        map_name: "alalc-asm-Deva-latn-2012",
    },
    {
        distance: 6.4,
        map_name: "un-asm-Beng-Latn-1972",
    },
];
*/

export default () => {
    const [source, setSource] = useState<string>("");
    const [target, setTarget] = useState<string>("");
    const [result, setResult] = useState<SystemRelevance[]>([]);
    const [error, setError] = useState<string>("");
    const detectAPI = useCallback(
        (input: String, output: String): AxiosPromise<SystemRelevance[]> => {
            return axios.post(
                API_URI,
                `{
                  detect(input: "${input || "Алушта"}", output: "${output || "Alushta"}") {
                    distance
                  }
                }`
            );
        },
        [source, target]
    );

    const detect = () => {
        clear();
        detectAPI(source, target)
            .then((resp) => {
                if (resp.data) setResult(resp.data);
            })
            .catch((e) => setError(e.message));
    };

    const clear = () => {
        setResult([]);
    };

    const list = result
        .sort((a, b) => a.distance - b.distance)
        .map((s: SystemRelevance, i) => <li key={i}>{s.map_name}</li>);

    return (
        <div>
            <h1> Detect Transliteration System</h1>
            <form>
                Input : <input type="text" onChange={(e) => setSource(e.target.value)} />
                Output : <input type="text" onChange={(e) => setTarget(e.target.value)} />
                <input type="button" value="Detect" onClick={detect} />
                <ul>
                    {error && <li>{error}</li>}
                    {list}
                </ul>
            </form>
        </div>
    );
};
