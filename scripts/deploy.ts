import { execSync } from 'child_process';
import fs from 'fs';
import { network } from 'hardhat';
import path from 'path';

async function main() {
  const chainIdHex = await network.provider.send('eth_chainId');
  const chainId = String(parseInt(chainIdHex, 16));

  const proxyaddress = await run('opensea-proxy-address', {
    chainid: chainId,
  });

  await run('generate-assets');

  const placeholder: string = await run('placeholder', {
    amount: 1,
  });

  // Prepare the parameters
  const parameters = {
    MetaDogModule: {
      placeholder,
      proxyaddress,
    },
  };

  // Define the parameter file path
  const dirPath = path.resolve(__dirname, '../ignition/parameters');
  const filePath = path.resolve(dirPath, 'metaDogDeploy.json');

  // Ensure the directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  }

  // Write the parameters to the file
  fs.writeFileSync(filePath, JSON.stringify(parameters, null, 2));
  console.log(`Parameters written to ${filePath}:`);
  console.log(JSON.stringify(parameters, null, 2));

  // Construct the deployment command
  const modulePath = path.resolve(__dirname, '../ignition/modules/main.ts');
  const command = `npx hardhat ignition deploy ${modulePath} --parameters ${filePath} --network btp`;

  console.log(`Executing deployment: ${command}`);

  // Execute the deployment command
  execSync(command, { stdio: 'inherit' });

  console.log('MetaDogModule deployed successfully.');
}

main().catch(console.error);
