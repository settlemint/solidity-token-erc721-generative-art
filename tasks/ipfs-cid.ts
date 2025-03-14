import { task } from 'hardhat/config';
import { create } from 'ipfs-http-client';

task('ipfs-cid', 'Gets a CID on IPFS for a path')
  .addParam<string>('ipfspath', 'the path')
  .setAction(async ({ ipfspath }: { ipfspath: string }) => {
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

    const { cid } = await ipfsClient.files.stat(ipfspath);
    return cid.toString();
  });
