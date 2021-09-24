import fs from "fs";
import path from "path";
import cheerio from "cheerio";

import { Octokit } from "@octokit/rest";
import Interscript from "interscript";

import alalcSamples from "./src/samples/alalc.json";
import bgnpcgnSamples from "./src/samples/bgnpcgn.json";
import odniSamples from "./src/samples/odni.json";
import ogc11122Samples from "./src/samples/ogc11122.json";
import unSamples from "./src/samples/un.json";
import isoSamples from "./src/samples/iso.json";
import metadata from "./map/metadata.json";
import { getListOfFileWithTypeInDir } from "./walk";

// import { ReadmeSection } from './types'

const repoOwner = "interscript";
const repoName = "interscript";

const octokit = new Octokit({ auth: process.env.GH_TOKEN });

export default {
    devServer: {
        host: "0.0.0.0",
    },
    entry: path.join(__dirname, "src", "index.tsx"),
    getRoutes: async () => {
        const readmeResp = await octokit.request("GET /repos/{owner}/{repo}/readme", {
            owner: repoOwner,
            repo: repoName,
            mediaType: {
                format: "html",
            },
        });

        // load docs and blogs
        const docList = await getListOfFileWithTypeInDir("tmp/docs", ".html");
        const blogList = await getListOfFileWithTypeInDir("tmp/posts", ".html");

        // analyse converted adoc html to extract document attributes
        const ATTRIBUTE_MAP = [
            {
                refName: "author",
                name: "author",
            },
            {
                refName: "revdate",
                name: "date",
            },
        ];
        const getPostAttributes = (path) => {
            const postHtml = fs.readFileSync(path, "utf8");
            const $ = cheerio.load(postHtml);
            const title = cheerio.text($("div#header h1"));

            return ATTRIBUTE_MAP.reduce(
                (ret, attr) => {
                    ret[attr.name] = cheerio.text($(`div#header .details span#${attr.refName}`));
                    return ret;
                },
                { title }
            );
        };

        // load maps
        await Interscript.load_map_list();
        const maps = Interscript.map_list();
        const mapsInfo = {};
        mapsInfo.languages = {};
        maps.forEach((systemCode) => {
            const alpha3 = systemCode.split("-")[1];
            if (mapsInfo.languages[alpha3]) {
                mapsInfo.languages[alpha3]++;
            } else {
                mapsInfo.languages[alpha3] = 1;
            }
        });
        mapsInfo["meta"] = {
            total: Object.keys(maps).length,
        };
        mapsInfo["data"] = maps;

        const readme = cheerio.load(readmeResp.data);
        const sectionHeaders = readme("h2");
        const readmeSections = [];

        for (const idx of Object.keys(sectionHeaders)) {
            const sectionEl = sectionHeaders[idx].parent;
            if (sectionEl) {
                const section /*: ReadmeSection */ = prepareReadmeSection(cheerio.load(sectionEl));
                if (section) {
                    readmeSections.push(section);
                }
            }
        }

        // SSR
        const translit = async (system, text) => {
            await Interscript.load_map(system);

            return Interscript.transliterate(system, text).split("\n");
        };

        const evaluate = (samples) =>
            Promise.all(
                samples.map(async (s) => {
                    const text = s.samples.join("\n");
                    const { systemName: system } = s;
                    if (!text || !system || !Interscript.map_exist(system)) {
                        return s;
                    }
                    try {
                        const result = await translit(system, text);
                        return { ...s, result };
                    } catch (e) {
                        console.log(e);
                    }
                    return s;
                })
            );

        let alalc, bgnpcgn, odni, ogc11122, un, iso;

        if (process.env.NODE_ENV === "production") {
            console.log("Dynamically convert all samples...");
            alalc = await evaluate(alalcSamples);
            bgnpcgn = await evaluate(bgnpcgnSamples);
            odni = await evaluate(odniSamples);
            ogc11122 = await evaluate(ogc11122Samples);
            un = await evaluate(unSamples);
            iso = await evaluate(isoSamples);
        }

        // const metaList = {}
        // Object.keys(metadata).map((system) => metaList[system] = camelCaseMetadata(metadata[system].data))
        const camelCaseMetadata = (rubyData) => ({
            authorityId: rubyData["authority_id"],
            id: rubyData["id"],
            language: rubyData["language"],
            sourceScript: rubyData["source_script"],
            destinationScript: rubyData["destination_script"],
            name: rubyData["name"],
            url: rubyData["url"],
            creationDate: rubyData["creation_date"],
            confirmationDate: rubyData["confirmation_date"],
            adoptionDate: rubyData["adoption_date"],
            description: rubyData["description"],
            notes: rubyData["notes"],
            nonstandard: rubyData["nonstandard"],
        });
        const metaDataMap = Object.keys(metadata).reduce((metalist, k) => {
            metalist[k] = camelCaseMetadata(metadata[k].data);
            metalist[k]["test"] = metadata[k]["test"];
            return metalist;
        }, {});

        const findReadmeSection = (path) => {
            return readmeSections.find((readmeSection) => readmeSection.id === path);
        };

        const renderADocSection = (name, path) => {
            const header = `
      <h2><a class="anchor" aria-hidden="true" href="#${path}"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"/></svg></a>${name}</h2>\n'
      `;
            return {
                html: header + fs.readFileSync(`tmp/docs/${path}.html`, { encoding: "utf8" }),
                titleHTML: name,
                id: path.toLowerCase(),
            };
        };

        return [
            {
                path: "/",
                template: "src/containers/Landing",
                getData: () => ({
                    readmeSections: [findReadmeSection("introduction"), findReadmeSection("demonstration")],
                    repoInfo: {
                        owner: repoOwner,
                        name: repoName,
                    },
                    mapsInfo,
                }),
            },
            // here I need to refactor a little
            {
                path: "featured-authorities",
                template: "src/pages/featured-authorities/un.tsx",
                getData: () => ({
                    samples: un || unSamples,
                }),
                children: [
                    {
                        path: "alalc",
                        getData: () => ({
                            samples: alalc || alalcSamples,
                        }),
                    },
                    {
                        path: "bgnpcgn",
                        getData: () => ({
                            samples: bgnpcgn || bgnpcgnSamples,
                        }),
                    },
                    {
                        path: "odni",
                        getData: () => ({
                            samples: odni || odniSamples,
                        }),
                    },
                    {
                        path: "ogc11122",
                        getData: () => ({
                            samples: ogc11122 || ogc11122Samples,
                        }),
                    },
                    {
                        path: "un",
                        getData: () => ({
                            samples: un || unSamples,
                        }),
                    },
                    {
                        path: "iso",
                        getData: () => ({
                            samples: iso || isoSamples,
                        }),
                    },
                ],
            },
            {
                path: "try-api",
                getData: () => ({
                    mapsInfo,
                    metaDataMap,
                }),
            },
            {
                path: "try-js",
                getData: () => ({
                    mapsInfo,
                    metaDataMap,
                }),
            },
            {
                path: "systems",
                template: "src/pages/systems.tsx",
                getData: async () => ({
                    readmeSections,
                    mapsInfo,
                    metaDataMap,
                    repoInfo: {
                        owner: repoOwner,
                        name: repoName,
                    },
                }),
                children: (mapsInfo.data || []).map((system) => {
                    return {
                        path: `${system}`,
                        template: "src/containers/systemView.tsx",
                        getData: async () => ({
                            readmeSections,
                            mapsInfo,
                            repoInfo: {
                                owner: repoOwner,
                                name: repoName,
                            },
                            metaDataMap,
                            system,
                            mapData: JSON.parse(fs.readFileSync(`./map/vis_json/${system}_main.json`, "utf8")),
                        }),
                    };
                }),
            },
            {
                path: "integrate",
                template: "src/components/ReadmeSectionPage.tsx",
                getData: async () => ({
                    sections: [
                        findReadmeSection("installation"),
                        findReadmeSection("usage"),
                        renderADocSection("Integration with Ruby Applications", "Integration_with_Ruby_Applications"),
                    ],
                }),
            },
            {
                path: "blog",
                template: "src/pages/blog.tsx",
                getData: async () => ({
                    blogList: blogList.map((post) => ({ ...post, ...getPostAttributes(post.path) })),
                }),
                children: blogList.map((blogPost) => {
                    return {
                        path: blogPost.name,
                        template: "src/pages/blogPost.tsx",
                        getData: () => ({
                            blogList,
                            blogPost,
                            html: cheerio.load(fs.readFileSync(blogPost.path, "utf8"))("div#content").html(),
                        }),
                    };
                }),
            },
            {
                path: "develop",
                template: "src/pages/docs.tsx",
                getData: async () => ({
                    docList,
                }),
                children: docList.map((doc) => {
                    return {
                        path: doc.name,
                        template: "src/pages/docsView.tsx",
                        getData: async () => ({
                            docList,
                            html: fs.readFileSync(doc.path, "utf8"),
                        }),
                    };
                }),
            },
        ];
    },
    plugins: [
        "react-static-plugin-typescript",
        [
            require.resolve("react-static-plugin-source-filesystem"),
            {
                location: path.resolve("./src/pages"),
            },
        ],
        require.resolve("react-static-plugin-reach-router"),
        require.resolve("react-static-plugin-styled-components"),
        require.resolve("react-static-plugin-sitemap"),
    ],
};

function prepareReadmeSection(cheerioEl) /*: ReadmeSection | undefined */ {
    const ghSectionID = cheerioEl("h2").attr("id");

    if (!ghSectionID) {
        // If this section’s top-level H2 doesn’t have an ID, don’t process it.
        // NOTE: Throw?
        console.warn("Missing section ID");
        return;
    }

    if (cheerioEl.root().children().length !== 1) {
        console.warn("Unexpected number of section element descendants");
        return;
    }

    const sectionTitle = cheerioEl("h2").clone().removeAttr("id");
    sectionTitle.find("a.anchor").remove();

    // GitHub’s anchors have user-content- prefix in their IDs (but not in hrefs)
    const sectionID = ghSectionID.replace("user-content-", "");

    cheerioEl("*[id]")
        .get()
        .map((el) => {
            if (el.attribs.id) {
                el.attribs.id = el.attribs.id.replace("user-content-", "");
            }
        });

    // Remove ID from headings and their anchors, add it to section wrappers instead.
    // For top-level section wrapper, ID is expected to be added externally.
    cheerioEl("a.anchor[id]")
        .get()
        .map((el) => {
            delete el.attribs.id;
        });
    cheerioEl("h2[id], h3[id], h4[id], h5[id], h6[id]")
        .get()
        .map((el) => {
            const id = el.attribs.id;
            if (el.parent.type === "tag" && el.parent.name === "div") {
                el.parent.attribs.id = id;
            }
            delete el.attribs.id;
        });

    // Make relative in-repo links work
    cheerioEl('a:not([href^="http"])')
        .get()
        .map((el) => {
            if (el.type === "tag" && el.name === "img" && el.attribs.href?.indexOf("http") !== 0) {
                el.attribs.href = `https://github.com/${repoOwner}/${repoName}/blob/master/${el.attribs.href}`;
            }
        });

    // Make relative in-repo image sources work
    cheerioEl('img:not([src^="http"])')
        .get()
        .map((el) => {
            if (el.type === "tag" && el.name === "img" && el.attribs.src?.indexOf("http") !== 0) {
                el.attribs.src = `https://github.com/${repoOwner}/${repoName}/raw/master/${el.attribs.src}`;
            }
        });

    return {
        id: sectionID,
        titleHTML: sectionTitle.html(),
        html: cheerio(cheerioEl.root().children()[0]).html(),
    };
}
