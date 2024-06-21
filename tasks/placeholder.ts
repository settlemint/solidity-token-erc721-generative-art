import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { task } from 'hardhat/config';
import chalk from 'chalk';

task('placeholder', 'Sets up the metadata and image for the pre-reveal stage')
  .addParam<string>(
    'foldername',
    'the foldername of final images in the art_engine/build folder, adjust for static vs gif images'
  )
  .setAction(async ({ foldername }: { foldername: string }, hre) => {
    const images = readdirSync(`./art_engine/build/${foldername}/`)
      .filter((subject) => subject.includes('.png'))
      .map((subject) => {
        return subject.replace(/\.[^/.]+$/, '');
      });

    console.log('');
    console.log(
      chalk.gray.dim(
        '--------------------------------------------------------------------------'
      )
    );
    console.log(
      `Preparing ${chalk.yellow.bold(
        images.length
      )} placeholders for the pre-reveal stage:`
    );

    const imageCID: string = await hre.run('ipfs-upload-file', {
      sourcepath: './assets/placeholder/placeholder.png',
      ipfspath: '/thumbzup-placeholder/placeholder.png',
    });
    console.log(
      `  Placeholder image: ${chalk.green.bold(`ipfs://${imageCID}`)}`
    );

    const metadata = JSON.parse(
      readFileSync('./assets/placeholder/placeholder.json', 'utf8')
    );
    metadata.image = `ipfs://${imageCID}`;
    mkdirSync('./assets/generated/', { recursive: true });

    for (let i = 1; i <= images.length; i++) {
      writeFileSync(
        `./assets/generated/placeholder-${i}.json`,
        JSON.stringify({ ...metadata, name: `${metadata.name} #${i}` }, null, 2)
      );
      await hre.run('ipfs-upload-file', {
        sourcepath: `./assets/generated/placeholder-${i}.json`,
        ipfspath: `/thumbzup-placeholder/${i}.json`,
      });
    }
    console.log(`  Uploading metadata: ${chalk.green.bold(`DONE`)}`);

    const folderCID: string = await hre.run('ipfs-cid', {
      ipfspath: `/thumbzup-placeholder`,
    });
    console.log(`  baseTokenURI: ${chalk.green.bold(`ipfs://${folderCID}`)}`);

    console.log(
      chalk.gray.dim(
        '--------------------------------------------------------------------------'
      )
    );
    console.log('');

    return folderCID;
  });
