import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const MetaDogReveal = buildModule('MetaDogReveal', (m) => {
  const metadogAddress = m.getParameter('address');
  const revealTokenURI = m.getParameter('revealTokenURI');
  const metadog = m.contractAt('MetaDog', metadogAddress);

  m.call(metadog, 'setBaseURI', [`ipfs://${revealTokenURI}/`]);
  return { metadog };
});

export default MetaDogReveal;
