import { MockNetworkProvider, Contract, TransactionBuilder, randomUtxo, type Utxo } from 'cashscript';
import { binToHex, cashAddressToLockingBytecode } from '@bitauth/libauth';
import { Main, CrossInputCompressionIndex, CrossInputCompressionP2RS } from '../lib/index.js';
import { alicePkh, baseTokenCategory1, bobAddress, bobTemplate, bobTokenAddress, padVmNumber } from '../utils/common.js';

const provider = new MockNetworkProvider();

let cicUtxo: Utxo;
let lpUtxo: Utxo;
let bobUtxo: Utxo;
let mainContract: Contract;
let cicIndexContract: Contract;
let cicP2RSContract: Contract;

describe('CrossInputCompressionP2RS', () =>
{
	beforeAll(() =>
	{
		cicP2RSContract = new Contract(CrossInputCompressionP2RS, [ Main.debug.bytecode ], { provider });
		const cicP2RSLockingBytecode = cashAddressToLockingBytecode(cicP2RSContract.address);
		// @ts-ignore
		const cicP2RSLockingBytecodeHex = binToHex(cicP2RSLockingBytecode.bytecode);
		mainContract = new Contract(Main, [ alicePkh, cicP2RSLockingBytecodeHex ], { provider });

		cicUtxo = randomUtxo();
		provider.addUtxo(cicP2RSContract.address, cicUtxo);

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
			.addInput(cicUtxo, cicP2RSContract.unlock.execute())
			.addInput(lpUtxo, mainContract.unlock.trade())
			.addInput(bobUtxo, bobTemplate.unlockP2PKH())
			.addOutput({
				to: cicP2RSContract.tokenAddress,
				amount: cicUtxo.satoshis,
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


describe('CrossInputCompressionIndex', () =>
{
	beforeAll(() =>
	{
		cicIndexContract = new Contract(CrossInputCompressionIndex, [ ], { provider });
		const cicIndexLockingBytecode = cashAddressToLockingBytecode(cicIndexContract.address);
		// @ts-ignore
		const cicIndexLockingBytecodeHex = binToHex(cicIndexLockingBytecode.bytecode);
		mainContract = new Contract(Main, [ alicePkh, cicIndexLockingBytecodeHex ], { provider });

		cicUtxo = randomUtxo();
		provider.addUtxo(cicIndexContract.address, cicUtxo);

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

		const indexes = padVmNumber(BigInt(1), 2);

		const transaction = new TransactionBuilder({ provider })
			.addInput(cicUtxo, cicIndexContract.unlock.execute(indexes))
			.addInput(lpUtxo, mainContract.unlock.trade())
			.addInput(bobUtxo, bobTemplate.unlockP2PKH())
			.addOutput({
				to: cicIndexContract.tokenAddress,
				amount: cicUtxo.satoshis,
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