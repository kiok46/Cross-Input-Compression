export default {
	'contractName': 'P2RS',
	'constructorInputs': [],
	'abi': [
		{
			'name': 'execute',
			'inputs': [],
		},
	],
	'bytecode': 'OP_TXVERSION OP_2 OP_NUMEQUAL',
	'source': 'pragma cashscript 0.11.4;\n\n// contract P2RS(bytes redeemeScript) {\ncontract P2RS() {\n  function execute() {\n    require(tx.version == 2);\n  }\n\n  // function p2rs() {\n  //   require(tx.version == 2);\n\n  //   int idx = 1;\n\n  //   bytes unlockingBytecodeOfInput1 = tx.inputs[idx].unlockingBytecode;\n  //   require(unlockingBytecodeOfInput1.length == 22);\n  //   bytes redeemeScriptInput = unlockingBytecodeOfInput1.split(22)[1];\n\n  //   if(redeemeScriptInput == redeemScript) {\n  //     require(tx.outputs[idx].tokenCategory == tx.inputs[idx].tokenCategory);\n  //     require(tx.outputs[idx].lockingBytecode == tx.inputs[idx].lockingBytecode);\n    \n  //     int inputSat = tx.inputs[idx].value;\n  //     int outputSat = tx.outputs[idx].value;\n  //     int fee = (abs(outputSat - inputSat) * 3) / 1000;\n\n  //     int inputTokenValue = tx.inputs[idx].tokenAmount;\n  //     int outputTokenValue = tx.outputs[idx].tokenAmount;\n\n  //     int targetK = inputSat * inputTokenValue;\n  //     int effectiveK = outputSat * outputTokenValue;\n\n  //     require(effectiveK >= targetK);\n  //   }\n  // }\n}',
	'debug': {
		'bytecode': 'c2529c',
		'sourceMap': '6:12:6:22;:26::27;:4::29:1',
		'logs': [],
		'requires': [
			{
				'ip': 3,
				'line': 6,
			},
		],
	},
	'compiler': {
		'name': 'cashc',
		'version': '0.11.4',
	},
	'updatedAt': '2025-08-12T13:57:12.344Z',
};
