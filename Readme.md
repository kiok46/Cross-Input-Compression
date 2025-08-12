# P2RS and P2RSH: Pay to Redeem Script, Pay to Redeem Script Hash

This is a subset of **Contract as a Function** where the function contract is responsible for enforcing logic for other contracts.

The contracts in this repository are an example implementation of a CPMM (Constant Product Market Maker) contract, e.g. cauldron contract, where the function contract enforces logic once for all the CPMM inputs, resulting in a significant reduction in transaction size.

The function contract uses introspection to read the unlocking bytecode of each input and checks if a redeem script matches to that of CPMM, if it does it enforces the trade logic.

> **Note:** Only P2RS is implemented in the example

----

### Inspiration

https://bitcoincashresearch.org/t/chip-2025-05-functions-function-definition-and-invocation-operations/1576/18?u=kiok46


> I'd like to share my opinion :)
> 
> I think we already have most of what we want from functions. I'd prefer to avoid code injection and mutation, and I see compression as the most valuable benefit of functions. Ideally, if a function can be used across multiple contracts (i.e., inputs), it would save a lot of bytes.
> 
> Based on the discussions I've followed, allowing arbitrary code execution is dangerous but I think it can be contained and enforced. So if we go ahead with this CHIP, I think there are ways where the contract authors can enforce how and what gets executed.
> 
> That said, let me share the approach where I think we do not need functions at all.
> 
> Let me call this concept "Contract as a Function" a way to achieve function like behaviour using existing opcodes.
> 
> **Contract as a Function**
> 
> 1. Contract as a Function:  Write to OP_RETURN or nftCommitment
> 
> Let's say ContractA has a function that adds two numbers. It enforces that whatever two parameters are passed to it in the unlocking bytecode are summed, and then it ensures an OP_RETURN output is created to act as the function's return data.
> 
> Any other contract relying on this contract can then read the returned value from the OP_RETURN or from an NFT commitment, thanks to introspection.
> 
> ```
> Input 0 (ContractA) -> Output 0: back to the same contract so it can be reused
> Input 1 (ContractB) -> Output 1: does whatever it needs to do
> x                   -> Output 2: OP_RETURN
> ```
> When Input1 is evaluated, it uses introspection to read the value from the OP_RETURN. The value is guaranteed to be correct because ContractA enforces that the calculation result must be written into Output 2 as an OP_RETURN
> 
> 2. Contract as a function: Process
> 
> This type of function does not return any value but processes something. For example, a loop that goes through all the outputs of transaction and ensures that there is no tokenAmount burn
> 
> ```
> Input 0 (ContractA) -> Output 0: back to the same contract so it can be reused  
> Input 1 (ContractB) -> Output 1: does whatever it needs to do
> ```
> 
> Here, ContractA has the code to validate the transaction outputs and ContractB can simply add a check to expect the 0th input to be from ContractA i.e, it enforces the locking bytecode of input 0 to be ContractA.
> 
> 3. Contract as a function: Nested functions and Closures
> 
> ContractA can be a function contract that internally relies on other function contracts, either providing some information to the parent function or using it's value to make some logical decisions.
> 
> Example:
> 
> - FunctionContractA: Generates a random number(VRF) and updates it's own value in it's nftcommitment
> - FunctionContractB: Reads the output nftcommitment of functionA and performs a calculation and updates it's own nftcommitment (Maybe update the global state of a staking contract)
> - CallerContractA: Reads output of FunctionContractB and does whatever
> 
> ```
> Input 0 (FunctionContractA) -> Output 0: back to itself with updated commitment
> Input 1 (FunctionContracBA) -> Output 0: back to itself with updated commitment
> Input 2 (CallerContractA)   -> Output 1: does whatever it needs to do
> ```
> 
> 4. Contract as a Function: Single Input Multiple Uses
> 
> The unlocking bytecode of a function contract can follow a predefined structure of byte sequences. For example: `<input_index_x><input_index_x_param><input_index_y><input_index_y_param>`. Using loops, these segments can be split and processed, with the results later stored in an NFT commitment or OP_RETURN. Relevant contracts can then read this processed information.
> 
> ---
> 
> **Threads**
> 
> The UTXOs in the function contracts can be dust-sized, since we're only using them for the 'code' they require to be unlocked. Sending the UTXO back to the same script ensures that the function can be executed again. This is not a single-threaded operation, as multiple dust UTXOs can be sent to the function contracts to enable parallel execution.
> 
> **Libraries**
> 
> This approach also allows us to have known public contract libraries(e.g., Math, VRF) that can be used by multiple independent contract systems. These contracts simply expect an input from one of these libraries and perform actions accordingly.