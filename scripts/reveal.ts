import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import hre, { network, run } from 'hardhat';
import path from 'path';
import { execSync } from 'child_process';

async function main() {
  // Check if the image collection exists
  const collectionExists = await run('check-images');
  if (!collectionExists) {
    throw new Error('You have not created any assets.');
  }

  // Get the chain ID
  const chainIdHex = await network.provider.send('eth_chainId');
  const chainId = String(parseInt(chainIdHex, 16));

  // Get the reveal token URI
  const revealTokenURI = await run('reveal');
  if (!revealTokenURI) {
    throw new Error('Reveal token URI could not be generated.');
  }
  console.log(`Reveal Token URI: ${revealTokenURI}`);

  // Read the deployed addresses JSON to get the MetaDog contract address
  const deployedAddressesPath = `./ignition/deployments/chain-${chainId}/deployed_addresses.json`;
  let address: string;
  try {
    const jsonData = JSON.parse(readFileSync(deployedAddressesPath, 'utf8'));
    address = jsonData['MetaDogModule#MetaDog'];
    if (!address) {
      throw new Error(
        `MetaDogModule address not found in ${deployedAddressesPath}`
      );
    }
  } catch (err) {
    console.error('Error reading deployed addresses:', err);
    throw err;
  }

  console.log(`MetaDog contract address: ${address}`);

  // Prepare the parameters
  const parameters = {
    MetaDogReveal: {
      address,
      revealTokenURI,
    },
  };

  // Define the parameter file path
  const dirPath = path.resolve(__dirname, '../ignition/parameters');
  const filePath = path.resolve(dirPath, 'metaDogReveal.json');

  // Ensure the parameters directory exists
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  }

  // Write the parameters to the file
  writeFileSync(filePath, JSON.stringify(parameters, null, 2));
  console.log(`Parameters written to ${filePath}:`);
  console.log(JSON.stringify(parameters, null, 2));

  // Construct the deployment command
  const modulePath = path.resolve(
    __dirname,
    '../ignition/modules/metaDogReveal.ts'
  );
  const command = `npx hardhat ignition deploy ${modulePath} --parameters ${filePath} --network btp`;

  console.log(`Executing deployment: ${command}`);

  // Execute the deployment command
  try {
    execSync(command, { stdio: 'inherit' });
    console.log('MetaDogReveal deployed successfully.');
  } catch (err) {
    console.error('Error during deployment:', err);
    throw err;
  }
}

main().catch(console.error);
