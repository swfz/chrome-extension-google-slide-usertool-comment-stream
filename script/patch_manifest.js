import fs from 'fs';

const manifest = JSON.parse(fs.readFileSync('dist/manifest.json'));

const resources = manifest.web_accessible_resources.map((item) => item.resources).flat();
console.log(resources);

const patchedManifest = {
  ...manifest,
  web_accessible_resources: [
    {
      matches: ['<all_urls>'],
      resources: [...resources, 'images/sign_language_black_24dp.svg'],
      use_dynamic_url: true,
    },
  ],
};

fs.writeFileSync('dist/manifest.json', JSON.stringify(patchedManifest, null, 2));
