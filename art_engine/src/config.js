const basePath = process.cwd();
const { MODE } = require(`${basePath}/constants/blend_mode.js`);
const { NETWORK } = require(`${basePath}/constants/network.js`);

const network = NETWORK.eth;

// General metadata for Ethereum
const namePrefix = "ThumbzUp";
const description = "👍 A collection of 111 carefully curated ThumbzUp NFTs, to bring a little good vibes back in your day. Experience a top of the line minting experience with our gas optimized smart contracts.";
const baseUri = "ipfs://NewUriToReplace"; // Only if you need to do this manually
const sellerFeeBasis = 500; // Indicates a 5% seller fee.
const feeRecipient = "0x52B8398551BB1d0BdC022355897508F658Ad42F8"; // obviously change this

const solanaMetadata = {
  symbol: "TMBZ",
  seller_fee_basis_points: 1000, // Define how much % you want from secondary market sales 1000 = 10%
  external_url: "https://settlemint.com",
  creators: [
    {
      address: "xxx",
      share: 100,
    },
  ],
};

// If you have selected Solana then the collection starts from 0 automatically
const layerConfigurations = [
  {
    growEditionSizeTo: 110,
    layersOrder: [
      { name: 'Background' },
      { name: 'Body' },
      { name: 'Face' },
      { name: 'Hair' },
      { name: 'Accessories' },
    ],
  },
  {
    growEditionSizeTo: 111,
    layersOrder: [
      { name: 'Unique' },
      { name: 'Body' },
      { name: 'Face' },
      { name: 'Hair' },
      { name: 'Accessories' },
    ],
  },
];

const shuffleLayerConfigurations = true;

const debugLogs = false;

const format = {
  width: 512,
  height: 512,
  smoothing: false,
};

const gif = {
  export: false,
  repeat: 0,
  quality: 100,
  delay: 500,
};

const text = {
  only: false,
  color: "#ffffff",
  size: 20,
  xGap: 40,
  yGap: 40,
  align: "left",
  baseline: "top",
  weight: "regular",
  family: "Courier",
  spacer: " => ",
};

const pixelFormat = {
  ratio: 2 / 128,
};

const background = {
  generate: true,
  brightness: "80%",
  static: false,
  default: "#000000",
};

const extraMetadata = {
  platform: "SettleMint",
};

const rarityDelimiter = "#";

const uniqueDnaTorrance = 10000;

const preview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.height / format.width,
  imageName: "preview.png",
};

const preview_gif = {
  numberOfImages: 5,
  order: "ASC", // ASC, DESC, MIXED
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: "preview.gif",
};

module.exports = {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  pixelFormat,
  text,
  namePrefix,
  network,
  solanaMetadata,
  gif,
  sellerFeeBasis,
  feeRecipient,
  preview_gif,
};
