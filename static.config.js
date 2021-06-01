import path from 'path'
import cheerio from 'cheerio'

import { Octokit } from '@octokit/rest'

// import { ReadmeSection } from './types'

const repoOwner = 'interscript';
const repoName = 'interscript';

const octokit = new Octokit({ auth: process.env.GH_TOKEN });

export default {
  entry: path.join(__dirname, 'src', 'index.tsx'),
  getRoutes: async () => {
    const readmeResp = await octokit.request('GET /repos/{owner}/{repo}/readme', {
      owner: repoOwner,
      repo: repoName,
      mediaType: {
        format: 'html',
      },
    });

    const { data: [{commit}] } = await octokit.repos.listCommits({
      owner: repoOwner,
      repo: repoName,
      sha: 'master',
      per_page: 1
    });

    const { data: { tree } } = await octokit.git.getTree({
      owner: repoOwner,
      repo: repoName,
      tree_sha: commit.tree.sha,
      recursive: "1"
    });

    const mapsInfo = {};
    const maps = tree.filter(obj => !!obj.path.match(/maps\/[a-zA-Z0-9\-]+.yaml/))
                      .map(x => x.path.split('/')[1].split('.')[0]);
    mapsInfo.languages = {};
    maps.forEach(systemCode => {
      const alpha3 = systemCode.split('-')[1]
      if (mapsInfo.languages[alpha3]) {
        mapsInfo.languages[alpha3] ++;
      } else {
        mapsInfo.languages[alpha3] = 1;
      }
    });
    mapsInfo['meta'] = {
      total: Object.keys(maps).length,
    };

    const readme = cheerio.load(readmeResp.data);
    const sectionHeaders = readme('h2');
    const readmeSections = [];

    for (const idx of Object.keys(sectionHeaders)) {
      const sectionEl = sectionHeaders[idx].parent;
      if (sectionEl) {
        const section/*: ReadmeSection */ = prepareReadmeSection(cheerio.load(sectionEl));
        if (section) {
          readmeSections.push(section);
        }
      }
    }

    return [
      {
        path: '/',
        template: 'src/containers/Landing',
        getData: () => ({
          readmeSections,
          repoInfo: {
            owner: repoOwner,
            name: repoName,
          },
          mapsInfo,
        }),
      },
    ]
  },
  plugins: [
    'react-static-plugin-typescript',
    require.resolve('react-static-plugin-reach-router'),
    require.resolve('react-static-plugin-styled-components'),
    require.resolve('react-static-plugin-sitemap'),
  ],
}


function prepareReadmeSection(cheerioEl)/*: ReadmeSection | undefined */ {
  const ghSectionID = cheerioEl('h2').attr('id');

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

  const sectionTitle = cheerioEl('h2').clone().removeAttr('id');
  sectionTitle.find('a.anchor').remove();

  // GitHub’s anchors have user-content- prefix in their IDs (but not in hrefs)
  const sectionID = ghSectionID.replace('user-content-', '');

  cheerioEl('*[id]').get().map(el => {
    if (el.attribs.id) {
      el.attribs.id = el.attribs.id.replace('user-content-', '');
    }
  });

  // Remove ID from headings and their anchors, add it to section wrappers instead.
  // For top-level section wrapper, ID is expected to be added externally.
  cheerioEl('a.anchor[id]').get().map(el => {
    delete el.attribs.id;
  });
  cheerioEl('h2[id], h3[id], h4[id], h5[id], h6[id]').get().map(el => {
    const id = el.attribs.id;
    if (el.parent.type === 'tag' && el.parent.name === 'div') {
      el.parent.attribs.id = id;
    }
    delete el.attribs.id;
  });

  // Make relative in-repo links work
  cheerioEl('a:not([href^="http"])').get().map(el => {
    if (el.type === 'tag' && el.name === 'img' && el.attribs.href?.indexOf('http') !== 0) {
      el.attribs.href = `https://github.com/${repoOwner}/${repoName}/blob/master/${el.attribs.href}`;
    }
  });

  // Make relative in-repo image sources work
  cheerioEl('img:not([src^="http"])').get().map(el => {
    if (el.type === 'tag' && el.name === 'img' && el.attribs.src?.indexOf('http') !== 0) {
      el.attribs.src = `https://github.com/${repoOwner}/${repoName}/raw/master/${el.attribs.src}`;
    }
  });

  return {
    id: sectionID,
    titleHTML: sectionTitle.html(),
    html: cheerio(cheerioEl.root().children()[0]).html(),
  };
}
