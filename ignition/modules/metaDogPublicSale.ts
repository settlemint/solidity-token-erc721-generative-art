import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const MetaDogPublicSale = buildModule('MetaDogPublicSale', (m) => {
  const metadogAddress = m.getParameter('address');
  const metadog = m.contractAt('MetaDog', metadogAddress);
  m.call(metadog, 'startPublicSale');

  return { metadog };
});

export default MetaDogPublicSale;
