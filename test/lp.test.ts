import { MockNetworkProvider, Contract, TransactionBuilder, randomUtxo, type Utxo } from 'cashscript';
import { binToHex, cashAddressToLockingBytecode } from '@bitauth/libauth';
import { LP, P2RS } from '../lib/index.js';
import { alicePkh } from '../utils/common.js';

const provider = new MockNetworkProvider();

const p2rsContract = new Contract(P2RS, [ ], { provider });
const p2rsLockingBytecode = cashAddressToLockingBytecode(p2rsContract.address);
// @ts-ignore
const p2rsLockingBytecodeHex = binToHex(p2rsLockingBytecode.bytecode);

const lpContract = new Contract(LP, [ alicePkh, p2rsLockingBytecodeHex ], { provider });
const lpLockingBytecode = cashAddressToLockingBytecode(lpContract.address);

// @ts-ignore
const lpLockingBytecodeHex = binToHex(lpLockingBytecode.bytecode);


console.log(lpLockingBytecodeHex);
console.log(p2rsLockingBytecodeHex);

let functionUtxo: Utxo;

describe('LP', () =>
{
	beforeAll(() =>
	{
		functionUtxo = randomUtxo();
		provider.addUtxo(p2rsContract.address, functionUtxo);
	});
	it('should trade', () =>
	{
		// Construct the transaction using the TransactionBuilder
		const transaction = new TransactionBuilder({ provider })
			.addInput(functionUtxo, p2rsContract.unlock.execute())
			.addOutput({
				to: lpContract.tokenAddress,
				amount: functionUtxo.satoshis,
			});

		const txPromise = transaction.send();

		console.log(txPromise);
	});
});