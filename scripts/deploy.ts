import hre from 'hardhat';
import { default as ThumbzUpModule } from '../ignition/modules/ThumbzUp';

import { network } from 'hardhat';

async function main() {
  const chainIdHex = await network.provider.send('eth_chainId');
  const chainId = String(parseInt(chainIdHex, 16));

  const proxyaddress = await run('opensea-proxy-address', {
    chainid: chainId,
  });

  const collectionExists = await run('check-images', { foldername: 'images' });

  if (!collectionExists) {
    throw new Error('You have not created any assets.');
  }

  const placeholder: string = await run('placeholder', {
    amount: 1,
  });

  await run('previews');

  const placeholder = await run('placeholder', { foldername: 'images' });

  const { thumbzup } = await hre.ignition.deploy(ThumbzUpModule, {
    parameters: {
      ThumbzUpModule: { placeholder: placeholder, proxyaddress: proxyaddress },
    },
  });

  await run('compile-ui-info', {
    files: [`./assets/generated/json/previews.json`].join(','),
  });
}

main().catch(console.error);
