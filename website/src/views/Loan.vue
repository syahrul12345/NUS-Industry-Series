<template>
	<v-container style="margin-top: 100px">
		<v-row>
			<v-col cols="12" sm="12">
				<div>
				<h1>Total Collatarized ETH = {{totalEth}} ETH</h1>
				<h2> Your Collatarized Eth = {{yourEth}} ETH </h2>
				<h2> nDAI loaned from the Maker Smart Contract = {{yourNDai}} nDAI</h2>
				</div>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" sm="12">
				<h2> Want to generate more nDAI? <v-btn> Click Here! </v-btn></h2>
				<h2> Want to get back your ETH?  <v-btn> Click Here! </v-btn></h2>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
	export default {
		data() {
			return {
				created:true,
				totalEth:100,
				yourEth:10,
				yourNDai:102342,
			}
		}
	}
</script>
<style>
	div {
		font-family: monaco
	}
</style>