import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const ThumbzUpModule = buildModule('ThumbzUpModule', (m) => {
  const placeholder = m.getParameter('placeholder', 'ipfs://');
  const proxyAddress = m.getParameter(
    'proxyaddress',
    '0xa5409ec958C83C3f309868babACA7c86DCB077c1'
  );

  const thumbzup = m.contract('ThumbzUp', [
    'thumbzup',
    'tmb',
    placeholder,
    proxyAddress,
    m.getAccount(0),
  ]);

  return { thumbzup };
});

const ThumbzUpProvenanceHash = buildModule('ThumbzUpProvenanceHash', (m) => {
  const thumbzupAddress = m.getParameter('address');
  const provenance = m.getParameter('provenance');
  const thumbzup = m.contractAt('ThumbzUp', thumbzupAddress);
  m.call(thumbzup, 'setProvenanceHash', [provenance]);
  return { thumbzup };
});

const ThumbzUpReserve = buildModule('ThumbzUpReserve', (m) => {
  const thumbzupAddress = m.getParameter('address');
  const thumbzup = m.contractAt('ThumbzUp', thumbzupAddress);
  m.call(thumbzup, 'collectReserves');

  return { thumbzup };
});

const ThumbzUpPresale = buildModule('ThumbzUpPresale', (m) => {
  const thumbzupAddress = m.getParameter('address');
  const whitelistRoot = m.getParameter('whitelistRoot');
  const thumbzup = m.contractAt('ThumbzUp', thumbzupAddress);
  m.call(thumbzup, 'setWhitelistMerkleRoot', [whitelistRoot]);
  return { thumbzup };
});

const ThumbzUpPublicSale = buildModule('ThumbzUpPublicSale', (m) => {
  const thumbzupAddress = m.getParameter('address');
  const thumbzup = m.contractAt('ThumbzUp', thumbzupAddress);
  m.call(thumbzup, 'startPublicSale');

  return { thumbzup };
});

const ThumbzUpReveal = buildModule('ThumbzUpReveal', (m) => {
  const thumbzupAddress = m.getParameter('address');
  const revealTokenURI = m.getParameter('revealTokenURI');
  const thumbzup = m.contractAt('ThumbzUp', thumbzupAddress);

  m.call(thumbzup, 'setBaseURI', [`ipfs://${revealTokenURI}/`]);
  return { thumbzup };
});

export default ThumbzUpModule;
export {
  ThumbzUpProvenanceHash,
  ThumbzUpReserve,
  ThumbzUpPresale,
  ThumbzUpPublicSale,
  ThumbzUpReveal,
};
