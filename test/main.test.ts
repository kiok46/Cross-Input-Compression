import { MockNetworkProvider, Contract, TransactionBuilder, randomUtxo, type Utxo } from 'cashscript';
import { binToHex, cashAddressToLockingBytecode } from '@bitauth/libauth';
import { Main, Function } from '../lib/index.js';
import { alicePkh, baseTokenCategory1, bobAddress, bobTemplate, bobTokenAddress } from '../utils/common.js';

const provider = new MockNetworkProvider();

const functionContract = new Contract(Function, [ Main.debug.bytecode ], { provider });
const functionLockingBytecode = cashAddressToLockingBytecode(functionContract.address);
// @ts-ignore
const functionLockingBytecodeHex = binToHex(functionLockingBytecode.bytecode);
const mainContract = new Contract(Main, [ alicePkh, functionLockingBytecodeHex ], { provider });

let functionUtxo: Utxo;
let lpUtxo: Utxo;
let bobUtxo: Utxo;

describe('Main', () =>
{
	beforeAll(() =>
	{
		functionUtxo = randomUtxo();
		provider.addUtxo(functionContract.address, functionUtxo);

		lpUtxo = {
			token: {
				category: baseTokenCategory1,
				amount: BigInt(10000),
			},
			...randomUtxo(),
		};

		bobUtxo = randomUtxo();
		provider.addUtxo(bobAddress, bobUtxo);
		provider.addUtxo(mainContract.address, lpUtxo);
	});

	it('should buy 1 token', async () =>
	{

		const tokenToBuy = BigInt(10);

		const lpInputSat = lpUtxo.satoshis;
		const lpInputTokens = lpUtxo.token!.amount;
		const tokensToRemove = tokenToBuy;

		const outputSat = Math.ceil((Number(lpInputSat) * Number(lpInputTokens)) / (Number(lpInputTokens) - Number(tokensToRemove)));
		const increaseInSatsContract = outputSat - Number(lpInputSat);

		const fee = Math.ceil(Math.abs(Number(outputSat) - Number(lpInputSat)) * Number(3) / Number(1000));

		const changeSats = bobUtxo.satoshis - BigInt(2000) - BigInt(increaseInSatsContract) - BigInt(fee);

		const transaction = new TransactionBuilder({ provider })
			.addInput(functionUtxo, functionContract.unlock.execute())
			.addInput(lpUtxo, mainContract.unlock.trade())
			.addInput(bobUtxo, bobTemplate.unlockP2PKH())
			.addOutput({
				to: functionContract.tokenAddress,
				amount: functionUtxo.satoshis,
			})
			.addOutput({
				to: mainContract.tokenAddress,
				amount: BigInt(outputSat) + BigInt(fee),
				token: {
					category: lpUtxo.token!.category,
					amount: lpUtxo.token!.amount - tokenToBuy,
				},
			})
			.addOutput({
				to: bobTokenAddress,
				amount: changeSats,
				token: {
					category: lpUtxo.token!.category,
					amount: tokenToBuy,
				},
			});

		const txPromise = await transaction.send();

		console.log(txPromise);
	});
});