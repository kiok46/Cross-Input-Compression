import { hash160 } from '@cashscript/utils';
import {
	deriveHdPrivateNodeFromSeed,
	deriveHdPath,
	secp256k1,
	encodeCashAddress,
	deriveSeedFromBip39Mnemonic,
	binToHex,
	hexToBin,
	padMinimallyEncodedVmNumber,
	bigIntToVmNumber,
} from '@bitauth/libauth';
import { SignatureTemplate, randomNFT } from 'cashscript';

export const baseTokenCategory1 = randomNFT().category;
export const reversedbaseTokenCategory1 = binToHex(hexToBin(baseTokenCategory1).reverse());

export const baseTokenCategory2 = randomNFT().category;
export const reversedbaseTokenCategory2 = binToHex(hexToBin(baseTokenCategory2).reverse());

// @ts-ignore
const seed = deriveSeedFromBip39Mnemonic(Math.random().toString());
const rootNode = deriveHdPrivateNodeFromSeed(seed, { assumeValidity: true, throwErrors: true });
const baseDerivationPath = "m/44'/145'/0'/0";

// Derive Alice's private key, public key, public key hash and address
const aliceNode = deriveHdPath(rootNode, `${baseDerivationPath}/0`);

export const alicePub = secp256k1.derivePublicKeyCompressed(aliceNode.privateKey);
export const alicePriv = aliceNode.privateKey;
// @ts-ignore
export const alicePkh = hash160(alicePub);
export const aliceAddress = encodeCashAddress({ prefix: 'bchtest', type: 'p2pkh', payload: alicePkh, throwErrors: true }).address;
export const aliceTokenAddress = encodeCashAddress({ prefix: 'bchtest', type: 'p2pkhWithTokens', payload: alicePkh, throwErrors: true }).address;
export const aliceTemplate = new SignatureTemplate(alicePriv);

// Derive Bob's private key, public key, public key hash and address
const bobNode = deriveHdPath(rootNode, `${baseDerivationPath}/1`);

export const bobPub = secp256k1.derivePublicKeyCompressed(bobNode.privateKey);
export const bobPriv = bobNode.privateKey;
// @ts-ignore
export const bobPkh = hash160(bobPub);
export const bobAddress = encodeCashAddress({ prefix: 'bchtest', type: 'p2pkh', payload: bobPkh, throwErrors: true }).address;
export const bobTokenAddress = encodeCashAddress({ prefix: 'bchtest', type: 'p2pkhWithTokens', payload: bobPkh, throwErrors: true }).address;
export const bobTemplate = new SignatureTemplate(bobPriv);

export const padVmNumber = (num: bigint, length: number): string =>
{
	return binToHex(padMinimallyEncodedVmNumber(bigIntToVmNumber(num), length).slice(0, length));
};