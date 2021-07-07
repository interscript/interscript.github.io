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
import metadata from "./src/samples/metadata.json";
import { getListOfFileWithTypeInDir } from "./walk";

// import { ReadmeSection } from './types'

const repoOwner = "interscript";
const repoName = "interscript";

const octokit = new Octokit({ auth: process.env.GH_TOKEN });

export default {
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

    let alalc, bgnpcgn, odni, ogc11122, un;

    if (process.env.NODE_ENV === "production") {
      console.log("transliterates all samples on build process...");
      alalc = await evaluate(alalcSamples);
      bgnpcgn = await evaluate(bgnpcgnSamples);
      odni = await evaluate(odniSamples);
      ogc11122 = await evaluate(ogc11122Samples);
      un = await evaluate(unSamples);
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
      return metalist;
    }, {});
    // console.log(metaDataMap);
    console.log('readmeSections', readmeSections);

    const findReadmeSection = (path) => {
      return readmeSections.find((readmeSection) => readmeSection.id === path);
    }

    const newRoutes = [
      {
        path: "/",
        template: "src/containers/Landing",
        getData: () => ({
          readmeSections: [
            findReadmeSection('introduction'),
            findReadmeSection('demonstration')
          ],
          subpages: [
            {
              name: 'Featured authorities',
              path: 'featured-authorities'
            },
            {
              name: 'Try: API',
              path: 'try-api'
            },
            {
              name: 'Try: JavaScript',
              path: 'try-javascript'
            },
            {
              name: 'Systems',
              path: 'systems'
            },
            {
              name: 'Integration',
              path: 'integration'
            },
            {
              name: 'Customizing and Contributing',
              path: 'customizing-and-contributing'
            },
            {
              name: 'About',
              path: 'about'
            }
          ],
          repoInfo: {
            owner: repoOwner,
            name: repoName,
          },
          mapsInfo,
        }),
      },
      // here I need to refactor a little
      {
        path: 'featured-authorities',
        template: "src/containers/DemoJS",
        getData: () => ({
          mapsInfo,
        }),
        children: [
          {
            path: "alalc",
            template: "src/pages/alalc.tsx",
            getData: () => ({
              samples: alalc || alalcSamples,
            }),
          },
          {
            path: "bgnpcgn",
            template: "src/pages/bgnpcgn.tsx",
            getData: () => ({
              samples: bgnpcgn || bgnpcgnSamples,
            }),
          },
          {
            path: "odni",
            template: "src/pages/odni.tsx",
            getData: () => ({
              samples: odni || odniSamples,
            }),
          },
          {
            path: "ogc11122",
            template: "src/pages/ogc11122.tsx",
            getData: () => ({
              samples: ogc11122 || ogc11122Samples,
            }),
          },
          {
            path: "un",
            template: "src/pages/un.tsx",
            getData: () => ({
              samples: un || unSamples,
            }),
          },
        ]
      },
      {
        path: 'try-api',
        template: 'src/components/LiveDemo.tsx',
        getData: () => ({
          mapsInfo,
        }),
      },
      {
        path: 'try-javascript',
        template: 'src/components/JSDemo.tsx',
        getData: () => ({
          mapsInfo,
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
              mapData: JSON.parse(fs.readFileSync(`./public/mapsjson/${system}_main.json`, "utf8")),
            }),
          };
        }),
      },
      {
        path: 'integration',
        template: 'src/components/ReadmeSectionPage.tsx',
        getData: async() => ({
          sections: [
            findReadmeSection('integration-with-ruby-applications'),
            findReadmeSection('usage')
          ] 
        })
      }
    ]

    const routes = [
      {
        path: "/",
        template: "src/containers/Landing",
        getData: () => ({
          readmeSections,
          repoInfo: {
            owner: repoOwner,
            name: repoName,
          },
          mapsInfo,
        }),
      },
      {
        path: "js",
        template: "src/containers/DemoJS",
        getData: () => ({
          mapsInfo,
        }),
      },
      {
        path: "blog",
        template: "src/pages/blog.tsx",
        getData: async () => ({
          blogList,
        }),
        children: blogList.map((blogPost) => {
          return {
            path: blogPost.name,
            template: "src/pages/blogPost.tsx",
            getData: () => ({
              blogList,
              blogPost,
              html: fs.readFileSync(blogPost.path, "utf8"),
            }),
          };
        }),
      },
      {
        path: "docs",
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

    return newRoutes;
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
