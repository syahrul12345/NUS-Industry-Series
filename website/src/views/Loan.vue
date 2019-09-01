<template>
	<v-container style="margin-top: 100px">
		<v-row>
			<v-col cols="12" sm="12">
				<div>
				<h1>Total Collatarized ETH = {{totalEth}} ETH</h1>
				<h2> Your Collatarized Eth = {{yourEth}} ETH </h2>
				<h2> nDAI loaned from the Maker Smart Contract = {{yourLoanedNDAi}} nDAI</h2>
				<h2> nDAI in your wallet = {{yourNDai}} nDAI</h2>
				</div>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" sm="12">
				<h2> Want to generate more nDAI? <v-btn @click="borrow"> Click Here! </v-btn></h2>
				<h2> Want to get back your ETH?  <v-btn @click="lend"> Click Here! </v-btn></h2>
			</v-col>
		</v-row>
		<v-dialog v-model="borrowDialog" max-width="500">
			<v-card>
				<v-card-title style="color: black"> Generate nDAI by using ur ETH as collateral </v-card-title>
				<v-card-text>Sending one Ether will give 200 nDAI</v-card-text>
				<v-card-actions>
					<v-text-field
					v-model="ethToSend"
					label="Ethers to send"
					style="padding-left: 10px;padding-right: 10px"></v-text-field>
					<v-btn 
					@click="sendEth"
					:disabled="sendEthBtnToggle"> Send </v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="lendDialog" max-width="500">
			<v-card>
				<v-card-title style="color:black"> Get back your ETH</v-card-title>
				<v-card-text> You borrowed a total of {{yourLoanedNDAi}} nDAI with a collateral of {{yourEth}}</v-card-text>
				<v-card-text> To get back your ETH, send {{yourLoanedNDAi}} nDAI back to the smart contract</v-card-text>
				<v-card-actions>
					<v-text-field
					v-model="daiToSend"
					label="nDAI to return"
					style="padding-left: 10px;padding-right: 10px"
					:rules="[required,check]"></v-text-field>
					<v-btn 
					@click="sendNDai"
					:disabled="sendDAIBtnToggle"> Send </v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="errorDialog" persistent max-width="300" >
      <Error :ErrorMessage="errorMessage" v-on:close="closeDialog"></Error>
    </v-dialog>
	</v-container>
</template>
<script>
	import Error from './../components/Error.vue'
	import nDAI from './../../../build/contracts/NDAI.json'
	const Web3 = require('web3')
	export default {
		props:[],
		components: {
			Error
		},
		data() {
			return {
				created:true,
				totalEth:null,
				yourEth:null,
				yourNDai:null,
				yourLoanedNDAi:null,
				borrowDialog:false,
				lendDialog:false,
				ethToSend:null,
				daiToSend:null,
				errorDialog:false,
				errorMessage:null,
				web3:null,
				nDaiContract:null,
				sendEthBtnToggle:false,
				sendDAIBtnToggle:false,
				wantedNetwork:5777,
			}
		},
		async created() {
			await this.updateStats()
			//lets watch for the events fired which is transfers
			const accounts = await ethereum.enable()
			//all contributions
			this.nDaiContract.events.Contribute()
				.on('data',(data)=>{
				console.log(data)
				this.updateStats()
			})
			//find returnEth events for current account
			this.nDaiContract.events.ReturnEth({
				filter:{
					contributor:accounts[0]
				}
			}).on('data',(data) => {
				this.updateStats()
			})
			//
			this.nDaiContract.events.Transfer({
				filter:{
					from:accounts[0]
				}
			}).on('data',(data) => {
				console.log("detected transfer event")
				this.updateStats()
			})
		},

		beforeRouteEnter(to,from,next) {
			//make sure to check for metamask
			const wantedNetwork = 5777
			if(window.ethereum) {
				window.web3.version.getNetwork(async(err,id) => {
					if(id == wantedNetwork){
						next()
					}else{
					}
				})
			}else{
				this.error("No Metamask installed")
			}
		},
		methods: {
			borrow() {
				this.borrowDialog = true
			},
			lend() {
				this.lendDialog = true
			},
			sendEth() {
				if(window.ethereum){
					window.web3.version.getNetwork(async (err,id) => {
						if(id == this.wantedNetwork) {
							const accounts = await ethereum.enable()
							//form the transaction payload
							const txPayload = {
								from:accounts[0],
								to:nDAI.networks[this.wantedNetwork].address,
								value:this.web3.utils.toWei(this.ethToSend.toString(),'ether'),
								gasLimit:6721975,
								gasPrice:20000000000
							}
							//send the ether
							this.web3.eth.sendTransaction(txPayload).on('receipt',(receipt) => {
								this.updateStats()
								this.borrowDialog = false;
								
							}).on('error',(error) => {
								this.error(error)
							})
						}else{
							this.error("You are not on ropsten, please be on ropsten to ensure you dont lose your Ethers")
						}
					})

				}else{
					this.error("No metamask")
				}
			},
			async sendNDai() {
				if(window.ethereum){
					window.web3.version.getNetwork(async (err,id) => {
						if(id == this.wantedNetwork) {
							const accounts = await ethereum.enable()
							if(this.yourNDai >= this.daiToSend){
								this.nDaiContract.methods.getBackContribution(this.web3.utils.toWei(this.daiToSend,'ether')).send({
									from:accounts[0]
								}).on('receipt',(receipt) => {
									this.updateStats()
								})
							}else{
								console.log("you have lesser nDAI in your wallet than you want to spend")
							}
							
						}else{
							this.error("You are not on ropsten, please be on ropsten to ensure you dont lose your Ethers")
						}
					})

				}else{
					this.error("No metamask")
				}
			},
			async updateStats() {
				if(window.ethereum) {
					const accounts = await ethereum.enable()
					this.web3 = new Web3(ethereum)
					this.nDaiContract = new this.web3.eth.Contract(nDAI.abi,nDAI.networks[this.wantedNetwork].address)
					//get nDAI balance of account
					this.nDaiContract.methods.balanceOf(accounts[0]).call().then((result) =>{
						this.yourNDai = parseInt(result)/1000000000000000000
					})
					//check how much ETH contribution by account
					this.nDaiContract.methods.getContribution(accounts[0]).call().then((result) =>{
						this.yourEth = parseInt(result)/1000000000000000000
						this.yourLoanedNDAi = this.yourEth*200
					})

					//check how much ETH contributed by ALL accounts
					this.web3.eth.getBalance(nDAI.networks[this.wantedNetwork].address).then((result) => {
						this.totalEth = parseInt(result)/1000000000000000000
					})
				}else{
					this.error("No Metamask or metamask crashed")
				}
			},
			error(value){
				this.errorMessage = value
				this.errorDialog = true
			},
			closeDialog(){
				this.errorDialog = false
			},
			required(value) {
						return !!value || 'Required.'
			},
			check(value) {
				if(value > this.yourNDai) {
					this.sendDAIBtnToggle = true
					return false || 'You cant send more nDAI than you owe'
				}else{
					this.sendDAIBtnToggle = false
					return true 
				}
			}
		}
	}
</script>
<style>
	div {
		font-family: monaco
	}
	.v-messages__message{
		color:red;
	}
</style>