export default {
	'contractName': 'CrossInputCompressionIndex',
	'constructorInputs': [],
	'abi': [
		{
			'name': 'execute',
			'inputs': [
				{
					'name': 'indexes',
					'type': 'bytes',
				},
			],
		},
	],
	'bytecode': 'OP_TXVERSION OP_2 OP_NUMEQUALVERIFY OP_DUP OP_SIZE OP_NIP OP_2 OP_MOD OP_0 OP_NUMEQUALVERIFY OP_0 OP_DUP OP_2 OP_MUL OP_ROT OP_SWAP OP_2 OP_ADD OP_SPLIT OP_DROP OP_OVER OP_SPLIT OP_NIP OP_BIN2NUM OP_DUP OP_OUTPUTTOKENCATEGORY OP_OVER OP_UTXOTOKENCATEGORY OP_EQUALVERIFY OP_DUP OP_OUTPUTBYTECODE OP_OVER OP_UTXOBYTECODE OP_EQUALVERIFY OP_DUP OP_UTXOVALUE OP_OVER OP_OUTPUTVALUE OP_2DUP OP_SWAP OP_SUB OP_ABS OP_3 OP_MUL e803 OP_DIV OP_SUB OP_2 OP_PICK OP_UTXOTOKENAMOUNT OP_3 OP_ROLL OP_OUTPUTTOKENAMOUNT OP_ROT OP_SWAP OP_MUL OP_ROT OP_ROT OP_MUL OP_GREATERTHANOREQUAL OP_NIP',
	'source': 'pragma cashscript 0.11.4;\n\n// Cross Input Compression via Indexes\ncontract CrossInputCompressionIndex() {\n\n  function execute(bytes indexes) {\n    require(tx.version == 2);\n\n    require(indexes.length % 2 == 0);\n\n    // LOOPED\n    // Loop starts from 0 to totalIndexes\n    // int totalIndexes = indexes.length / 2;\n    // for (int i = 0; i < totalIndexes; i++) {\n    int i = 0;\n    \n    i = i*2;\n    bytes InputIndexBytes = indexes.slice(i, i + 2);\n    int InputIndex = int(InputIndexBytes);\n\n    // Trade logic\n    require(tx.outputs[InputIndex].tokenCategory == tx.inputs[InputIndex].tokenCategory);\n    require(tx.outputs[InputIndex].lockingBytecode == tx.inputs[InputIndex].lockingBytecode);\n  \n    int inputSat = tx.inputs[InputIndex].value;\n    int outputSat = tx.outputs[InputIndex].value;\n    int fee = (abs(outputSat - inputSat) * 3) / 1000;\n\n    int outputValueAfterFee = outputSat - fee;\n\n    int inputTokenValue = tx.inputs[InputIndex].tokenAmount;\n    int outputTokenValue = tx.outputs[InputIndex].tokenAmount;\n\n    int effectiveK = outputValueAfterFee * outputTokenValue;\n    int targetK = inputSat * inputTokenValue;\n\n    require(effectiveK >= targetK);\n  }\n}',
	'debug': {
		'bytecode': 'c2529d7682775297009d007652957b7c52937f75787f778176d178ce8876cd78c78876c678cc6e7c9490539502e80396945279d0537ad37b7c957b7b95a277',
		'sourceMap': '7:12:7:22;:26::27;:4::29:1;9:12:9:19:0;:::26:1;;:29::30:0;:12:::1;:34::35:0;:4::37:1;15:12:15:13:0;17:8:17:9;:10::11;:8:::1;18:28:18:35:0;:45::46;:49::50;:45:::1;:28::51;;:42::43:0;:28::51:1;;19:21:19:41;22:23:22:33:0;:12::48:1;:62::72:0;:52::87:1;:4::89;23:23:23:33:0;:12::50:1;:64::74:0;:54::91:1;:4::93;25:29:25:39:0;:19::46:1;26:31:26:41:0;:20::48:1;27:19:27:39:0;;::::1;:15::40;:43::44:0;:15:::1;:48::52:0;:14:::1;29:30:29:45;31:36:31:46:0;;:26::59:1;32:38:32:48:0;;:27::61:1;34:21:34:40:0;:43::59;:21:::1;35:18:35:26:0;:29::44;:18:::1;37:4:37:35;6:2:38:3',
		'logs': [],
		'requires': [
			{
				'ip': 2,
				'line': 7,
			},
			{
				'ip': 9,
				'line': 9,
			},
			{
				'ip': 28,
				'line': 22,
			},
			{
				'ip': 33,
				'line': 23,
			},
			{
				'ip': 60,
				'line': 37,
			},
		],
	},
	'compiler': {
		'name': 'cashc',
		'version': '0.11.4',
	},
	'updatedAt': '2025-08-14T12:10:40.624Z',
};
