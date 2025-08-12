export default {
	'contractName': 'P2RS',
	'constructorInputs': [
		{
			'name': 'redeemScript',
			'type': 'bytes',
		},
	],
	'abi': [
		{
			'name': 'execute',
			'inputs': [],
		},
	],
	'bytecode': 'OP_TXVERSION OP_2 OP_NUMEQUALVERIFY OP_1 OP_DUP OP_UTXOBYTECODE OP_DUP OP_SIZE OP_NIP 23 OP_NUMEQUALVERIFY OP_DUP OP_2 OP_SPLIT OP_DROP aa20 OP_EQUALVERIFY 22 OP_SPLIT OP_NIP 87 OP_EQUALVERIFY OP_DUP OP_INPUTBYTECODE 53 OP_3 OP_PICK OP_SIZE OP_NIP OP_SUB OP_SPLIT OP_NIP OP_ROT OP_EQUAL OP_IF OP_DUP OP_OUTPUTTOKENCATEGORY OP_OVER OP_UTXOTOKENCATEGORY OP_EQUALVERIFY OP_DUP OP_OUTPUTBYTECODE OP_OVER OP_UTXOBYTECODE OP_EQUALVERIFY OP_DUP OP_UTXOVALUE OP_OVER OP_OUTPUTVALUE OP_2DUP OP_SWAP OP_SUB OP_ABS OP_3 OP_MUL e803 OP_DIV OP_2DUP OP_SUB OP_4 OP_PICK OP_UTXOTOKENAMOUNT OP_5 OP_PICK OP_OUTPUTTOKENAMOUNT OP_2 OP_PICK OP_OVER OP_MUL OP_6 OP_PICK OP_3 OP_PICK OP_MUL OP_2DUP OP_GREATERTHANOREQUAL OP_VERIFY OP_2DROP OP_2DROP OP_2DROP OP_2DROP OP_ENDIF OP_DROP OP_1',
	'source': "pragma cashscript 0.11.4;\n\n// P2RS, Pay to Redeem Script\ncontract P2RS(bytes redeemScript) {\n\n  function execute() {\n    require(tx.version == 2);\n\n    // LOOPED: This index will be updated using loops upgrade, it will go through all the inputs within the transaction\n    int idx = 1;\n\n    // Ensure it's a P2SH input\n    bytes lockingBytecode = tx.inputs[idx].lockingBytecode;\n    require(lockingBytecode.length == 35);\n    require(lockingBytecode.split(2)[0] == 0xaa20, \"P2SH32 locking bytecode must start with OP_SHA256 <Push 32-bytes> (0xaa20)\");\n    require(lockingBytecode.split(34)[1] == 0x87, \"P2SH32 locking bytecode must end with OP_EQUAL (0x87)\");\n\n    // Extract the redeem script\n    // 84 is the expected length of the unlocking bytecode based on how the main contract is constructed\n    bytes redeemScriptFromInput = tx.inputs[idx].unlockingBytecode.split(83 - redeemScript.length)[1];\n\n    // Execute the function logic\n    if(redeemScriptFromInput == redeemScript) {\n      require(tx.outputs[idx].tokenCategory == tx.inputs[idx].tokenCategory);\n      require(tx.outputs[idx].lockingBytecode == tx.inputs[idx].lockingBytecode);\n    \n      int inputSat = tx.inputs[idx].value;\n      int outputSat = tx.outputs[idx].value;\n      int fee = (abs(outputSat - inputSat) * 3) / 1000;\n\n      int outputValueAfterFee = outputSat - fee;\n\n      int inputTokenValue = tx.inputs[idx].tokenAmount;\n      int outputTokenValue = tx.outputs[idx].tokenAmount;\n\n      int effectiveK = outputValueAfterFee * outputTokenValue;\n      int targetK = inputSat * inputTokenValue;\n\n      require(effectiveK >= targetK);\n    }\n  }\n}",
	'debug': {
		'bytecode': 'c2529d5176c776827701239d76527f7502aa208801227f7701878876ca015353798277947f777b876376d178ce8876cd78c78876c678cc6e7c9490539502e803966e945479d05579d35279789556795379956ea2696d6d6d6d687551',
		'sourceMap': '7:12:7:22;:26::27;:4::29:1;10:14:10:15:0;13:38:13:41;:28::58:1;14:12:14:27:0;:::34:1;;:38::40:0;:4::42:1;15:12:15:27:0;:34::35;:12::36:1;:::39;:43::49:0;:4::129:1;16:34:16:36:0;:12::37:1;:::40;:44::48:0;:4::107:1;20:44:20:47:0;:34::66:1;:73::75:0;:78::90;;:::97:1;;:73;:34::98;:::101;23:32:23:44:0;:7:::1;:46:40:5:0;24:25:24:28;:14::43:1;:57::60:0;:47::75:1;:6::77;25:25:25:28:0;:14::45:1;:59::62:0;:49::79:1;:6::81;27:31:27:34:0;:21::41:1;28:33:28:36:0;:22::43:1;29:21:29:41:0;;::::1;:17::42;:45::46:0;:17:::1;:50::54:0;:16:::1;31:32:31:47:0;::::1;33:38:33:41:0;;:28::54:1;34:40:34:43:0;;:29::56:1;36:23:36:42:0;;:45::61;:23:::1;37:20:37:28:0;;:31::46;;:20:::1;39:14:39:35:0;::::1;:6::37;23:46:40:5;;;;;6:2:41:3;',
		'logs': [],
		'requires': [
			{
				'ip': 3,
				'line': 7,
			},
			{
				'ip': 11,
				'line': 14,
			},
			{
				'ip': 17,
				'line': 15,
				'message': 'P2SH32 locking bytecode must start with OP_SHA256 <Push 32-bytes> (0xaa20)',
			},
			{
				'ip': 22,
				'line': 16,
				'message': 'P2SH32 locking bytecode must end with OP_EQUAL (0x87)',
			},
			{
				'ip': 40,
				'line': 24,
			},
			{
				'ip': 45,
				'line': 25,
			},
			{
				'ip': 77,
				'line': 39,
			},
		],
	},
	'compiler': {
		'name': 'cashc',
		'version': '0.11.4',
	},
	'updatedAt': '2025-08-12T18:05:28.313Z',
};
