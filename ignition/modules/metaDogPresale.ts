import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const MetaDogPresale = buildModule('MetaDogPresale', (m) => {
  const metadogAddress = m.getParameter('address');
  const whitelistRoot = m.getParameter('whitelistRoot');
  const metadog = m.contractAt('MetaDog', metadogAddress);
  m.call(metadog, 'setWhitelistMerkleRoot', [whitelistRoot]);
  return { metadog };
});

export default MetaDogPresale;
