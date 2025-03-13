import { readFileSync } from 'fs';
import { task } from 'hardhat/config';
import { create } from 'ipfs-http-client';
import { Blob, NFTStorage } from 'nft.storage';

// NFT Storage token - ideally this would be in config or .env
const nftStorageToken = process.env.NFT_STORAGE_TOKEN || '';

async function pinToNFTStorage(blob: Blob) {
  if (!nftStorageToken || nftStorageToken === '') {
    return;
  }
  const pinning = new NFTStorage({
    endpoint: new URL('https://api.nft.storage'),
    token: nftStorageToken,
  });
  return pinning.storeBlob(blob);
}

async function ipfsUpload(
  filePath: string,
  content: Buffer | Record<string, any>,
  pin?: true
) {
  // Use SettleMint IPFS API endpoint directly from .env file
  const btpIpfs = process.env.SETTLEMINT_IPFS_API_ENDPOINT;

  if (!btpIpfs) {
    throw new Error(`No IPFS node configured. Please run 'settlemint connect' to set up your environment.`);
  }

  // Create IPFS client with the API endpoint
  const ipfsClient = create({
    url: btpIpfs,
    headers: {
      'x-auth-token': process.env.SETTLEMINT_ACCESS_TOKEN!,
    },
  });
  const contentToStore = Buffer.isBuffer(content)
    ? content
    : Buffer.from(JSON.stringify(content, null, 2));
  await ipfsClient.files.write(filePath, contentToStore, {
    create: true,
    parents: true,
    cidVersion: 1,
    hashAlg: 'sha2-256',
  });
  if (pin) {
    await pinToNFTStorage(new Blob([contentToStore]));
  }
  const { cid } = await ipfsClient.files.stat(filePath);
  await ipfsClient.pin.add(cid);
  console.log(`       Uploaded ${filePath} to IPFS (${cid})`);
  return cid;
}

task('ipfs-upload-file', 'Uploads a file to IPFS')
  .addParam<string>('sourcepath', 'the path to the file on your filesystem')
  .addParam<string>(
    'ipfspath',
    'the path where you want to store the file on your ipfs node'
  )

  .setAction(
    async ({
      sourcepath,
      ipfspath,
    }: {
      sourcepath: string;
      ipfspath: string;
    }) => {
      const fileContents = readFileSync(sourcepath);
      return (await ipfsUpload(ipfspath, fileContents)).toString();
    }
  );

task('ipfs-upload-string', 'Uploads a file to IPFS')
  .addParam<string>('data', 'the path to the file on your filesystem')
  .addParam<string>(
    'ipfspath',
    'the path where you want to store the file on your ipfs node'
  )
  .addParam<string>('ipfsnode', 'the key of the ipfs node to use')
  .setAction(async ({ data, ipfspath }: { data: string; ipfspath: string }) => {
    return (await ipfsUpload(ipfspath, Buffer.from(data, 'utf8'))).toString();
  });
