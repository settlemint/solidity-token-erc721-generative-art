import { readFileSync } from 'fs';
import hre, { network } from 'hardhat';
import { ThumbzUpProvenanceHash } from '../ignition/modules/ThumbzUp';

async function main() {
  const collectionExists = await run('check-images', { foldername: 'images' });

  if (!collectionExists) {
    throw new Error('You have not created any assets.');
  }
  const chainIdHex = await network.provider.send('eth_chainId');
  const chainId = String(parseInt(chainIdHex, 16));

  const {
    provenance,
  }: {
    provenance: string;
  } = JSON.parse(
    readFileSync('./art_engine/build/json/provenanceHash.json', 'utf8')
  );

  try {
    const jsonData = JSON.parse(
      readFileSync(
        `./ignition/deployments/chain-${chainId}/deployed_addresses.json`,
        'utf8'
      )
    );
    const address = jsonData['ThumbzUpModule#ThumbzUp'];
    const { thumbzup } = await hre.ignition.deploy(ThumbzUpProvenanceHash, {
      parameters: {
        ThumbzUpProvenanceHash: { address: address, provenance: provenance },
      },
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

main().catch(console.error);
