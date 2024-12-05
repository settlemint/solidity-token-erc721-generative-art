import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const MetaDogReserve = buildModule('MetaDogReserve', (m) => {
  const metadogAddress = m.getParameter('address');
  const metadog = m.contractAt('MetaDog', metadogAddress);
  m.call(metadog, 'collectReserves');

  return { metadog };
});

export default MetaDogReserve;
