import { readdirSync } from 'fs';
import { task } from 'hardhat/config';

task('check-images', 'Checks if images have been generated')
  .addParam<string>(
    'foldername',
    'the foldername of final images in the art_engine/build folder, adjust for static vs gif images'
  )
  .setAction(async ({ foldername }: { foldername: string }) => {
    const images = readdirSync(`./art_engine/build/${foldername}/`)
      .filter((subject) => subject.includes('.png'))
      .map((subject) => {
        return subject.replace(/\.[^/.]+$/, '');
      });

    return images.length > 0;
  });
