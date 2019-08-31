const Web3 = require('Web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'),null,{
	transactionConfirmationBlocks:1,
})

//lets get all the testing for mocha
const assert = require('assert')
//get the contract ABI
const nDAIABI = require('./../build/contracts/NDAI.json')
let accounts;
let nDAI;

before(async() => {
	accounts = await web3.eth.getAccounts()
	let contract = new web3.eth.Contract(nDAIABI.abi)
	await contract.deploy({
		data:nDAIABI.bytecode
	}).send({
		from:accounts[0],
		gasLimit:6721975,
		gasPrice:20000000000
	}).on('transactionHash',(transactionHash) => {
		console.log("Propogated transaction to the blockchain")
	}).on('reciept',(receipt) => {
	}).then((instance) => {
		nDAI = new web3.eth.Contract(nDAIABI.abi,instance.options.address)
	})

})

describe('Contract Creation',() => {
	it('Contract created succesfully',() => {
		console.log(`Created at: ${nDAI.options.address}`)
		assert.ok(nDAI.options.address)

	})
	
})

describe('Checking values for sending and receiving',() => {
	it(`Checking that the number of nDAi owned is totalSupply for owner`,async() => {
		var balance = await nDAI.methods.balanceOf(accounts[0]).call()
		assert.equal(parseInt(balance),1000000000000000000000000,'Balance is correct')
	})
	it('Checking that the number of nDai owned is 0 for other accounts',async() => {
		var balance = await nDAI.methods.balanceOf(accounts[1]).call()
		assert.equal(parseInt(balance),0,'Balance is correct')
	})
	it('Checking that the number of nDai owned is 0 for other accounts',async() => {
		var balance = await nDAI.methods.balanceOf(accounts[2]).call()
		assert.equal(parseInt(balance),0,'Balance is correct')
	})
	it('Checking that the number of nDai owned is 0 for other accounts',async() => {
		var balance = await nDAI.methods.balanceOf(accounts[3]).call()
		assert.equal(parseInt(balance),0,'Balance is correct')
	})
	
})

describe('Each Account send a variable amount of ether and then check balance',() => {
	const ethersToSend = [1,2,2,5,3,4,2,5]
	ethersToSend.forEach((ether,index) => {
		it(`${index}th account to send ${ether} ether and check that the balance is ${ether*200} nDAI`,async() => {
			await web3.eth.sendTransaction({
				from:accounts[index+1],
				to:nDAI.options.address,
				value:web3.utils.toWei(ether.toString(),'ether')
			})
			var balance = await nDAI.methods.balanceOf(accounts[index+1]).call()
			assert.equal(parseInt(balance),ether*200,'Balance is correct')
			
		})
	})

	

})
