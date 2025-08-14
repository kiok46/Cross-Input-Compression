export default {
	'contractName': 'Main',
	'constructorInputs': [
		{
			'name': 'lpPKH',
			'type': 'bytes20',
		},
		{
			'name': 'tradeLockingBytecode',
			'type': 'bytes35',
		},
	],
	'abi': [
		{
			'name': 'withdraw',
			'inputs': [
				{
					'name': 'pk',
					'type': 'pubkey',
				},
				{
					'name': 's',
					'type': 'sig',
				},
			],
		},
		{
			'name': 'trade',
			'inputs': [],
		},
	],
	'bytecode': 'OP_2 OP_PICK OP_0 OP_NUMEQUAL OP_IF OP_3 OP_PICK OP_HASH160 OP_EQUALVERIFY OP_2SWAP OP_CHECKSIG OP_NIP OP_NIP OP_ELSE OP_ROT OP_1 OP_NUMEQUALVERIFY OP_0 OP_UTXOBYTECODE OP_ROT OP_EQUAL OP_NIP OP_ENDIF',
	'source': 'pragma cashscript 0.11.4;\n\ncontract Main(bytes20 lpPKH, bytes35 tradeLockingBytecode) {\n  function withdraw(pubkey pk, sig s) {\n    require(hash160(pk) == lpPKH);\n    require(checkSig(s, pk));\n  }\n\n  function trade() {\n    // Approach 1: Using a static index\n    require(tx.inputs[0].lockingBytecode == tradeLockingBytecode);\n\n    // Approach 2: Expect the index from unlockingbytecode i.e function trade(int idx) {\n\n    // Approach 3: Search for index\n\n    // int inputs = tx.inputs.length;\n    // bool found = false;\n    // for(int idx = 0; idx < inputs; idx++) {\n    //   if(tx.inputs[idx].lockingBytecode == tradeLockingBytecode) {\n    //     found = true;\n    //     break;\n    //   }\n    // }\n    // require(found);\n  }\n}',
	'debug': {
		'bytecode': '5279009c635379a98872ac7777677b519d00c77b877768',
		'sourceMap': '4:2:7:3;;;;;5:20:5:22;;:12::23:1;:4::34;6:21:6:26:0;:4::29:1;4:2:7:3;;;9::26::0;;;11:22:11:23;:12::40:1;:44::64:0;:4::66:1;9:2:26:3;3:0:27:1',
		'logs': [],
		'requires': [
			{
				'ip': 10,
				'line': 5,
			},
			{
				'ip': 13,
				'line': 6,
			},
			{
				'ip': 23,
				'line': 11,
			},
		],
	},
	'compiler': {
		'name': 'cashc',
		'version': '0.11.4',
	},
	'updatedAt': '2025-08-14T12:10:40.245Z',
};
