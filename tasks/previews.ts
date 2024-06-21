import { mkdirSync, readdirSync, writeFileSync } from 'fs';
import { task } from 'hardhat/config';

task('previews', 'Uploads the preview images to ipfs').setAction(
  async ({}: {}, hre) => {
    const images = readdirSync(`./art_engine/build/`).filter((subject) =>
      subject.includes('preview.')
    );

    mkdirSync('./assets/generated/json', { recursive: true });
    const timestamp = Date.now();

    for (const image of images) {
      await hre.run('ipfs-upload-file', {
        sourcepath: `./art_engine/build/${image}`,
        ipfspath: `/thumbzup-previews-${timestamp}/${image}`,
      });
    }

    const folderCID: string = await hre.run('ipfs-cid', {
      ipfspath: `/thumbzup-previews-${timestamp}`,
    });

    const previews: { [image: string]: string } = {};
    for (const image of images) {
      previews[image] = `${folderCID}/${image}`;
    }

    writeFileSync(
      `./assets/generated/json/previews.json`,
      JSON.stringify(previews, null, 2)
    );
  }
);
