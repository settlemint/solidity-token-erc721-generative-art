import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const MetaDogModule = buildModule('MetaDogModule', (m) => {
  const placeholder = m.getParameter('placeholder', 'ipfs://');
  const proxyAddress = m.getParameter(
    'proxyaddress',
    '0xa5409ec958C83C3f309868babACA7c86DCB077c1'
  );

  const metadog = m.contract('MetaDog', [
    'metadog',
    'md',
    placeholder,
    proxyAddress,
    m.getAccount(0),
  ]);

  return { metadog };
});

export default MetaDogModule;
