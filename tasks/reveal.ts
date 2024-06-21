import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { task } from 'hardhat/config';

task('reveal', 'Generates everything needed to reveal')
  .addParam<string>(
    'foldername',
    'the foldername of final images in the art_engine/build folder, adjust for static vs gif images'
  )
  .setAction(
    async (
      {
        foldername,
      }: {
        foldername: string;
      },
      hre
    ) => {
      const images = readdirSync(`./art_engine/build/${foldername}/`)
        .filter((subject) => subject.includes('.png'))
        .map((subject) => {
          return subject.replace(/\.[^/.]+$/, '');
        });

      mkdirSync('./assets/generated/json', { recursive: true });
      const timestamp = Date.now();

      for (const image of images) {
        const imageCID: string = await hre.run('ipfs-upload-file', {
          sourcepath: `./art_engine/build/${foldername}/${image}.png`,
          ipfspath: `/thumbzup-${timestamp}/${image}.png`,
        });

        const metadata = JSON.parse(
          readFileSync(`./art_engine/build/json/${image}.json`, 'utf8')
        );

        const finalMetadata = {
          ...metadata,
          image: `ipfs://${imageCID}`,
        };

        writeFileSync(
          `./assets/generated/json/${image}.json`,
          JSON.stringify(finalMetadata, null, 2)
        );

        await hre.run('ipfs-upload-file', {
          sourcepath: `./assets/generated/json/${image}.json`,
          ipfspath: `/thumbzup-${timestamp}/${image}.json`,
        });
      }

      const folderCID: string = await hre.run('ipfs-cid', {
        ipfspath: `/thumbzup-${timestamp}`,
      });

      return folderCID;
    }
  );
