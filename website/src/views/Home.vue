<template>
  <v-container fill-height>
  	<v-row >
     <v-col cols="12" sm="6">
      <div>
        <h1> Welcome to the NUS Collatarized </h1>
        <h1>Debt Portal</h1>
        <h2> This is the place where you can </h2>
        <h2>loan out Ether in return for nDAI </h2>
        <h2> Current interest rate is: {{interestRate}} % </h2>
      </div>
     </v-col>
     <v-col cols="12" sm="6" fill-height>
      <v-container fill-height>
        <v-row>
          <v-btn dark @click="login"> Log in via Metamask</v-btn>
        </v-row>
      </v-container>
     </v-col>
    </v-row>
    <v-dialog v-model="errorDialog" persistent max-width="300" >
      <Error :ErrorMessage="errorMessage" v-on:close="closeDialog"></Error>
    </v-dialog>
    
  </v-container>
</template>

<script>
  import Error from './../components/Error.vue'
  const Web3 = require('web3')
  export default {
    props: [],
    components: {
      Error
    },
    data() {
      return {
        interestRate:10,
        errorDialog:false,
        errorMessage:null,
        web3:null,
        network:null,
        userID:null,
      }
    },
    async created() {
        if(window.ethereum){
          this.checkNetwork()
          const accounts = await ethereum.enable()
          this.userID = accounts[0]
          this.web3 = new Web3(ethereum)
        }
    },
    methods: {
      async login() {
        if(window.ethereum){
          if(this.network === 3){
            this.$router.push(`/loan/${this.userID}`)
          }else{
            this.error("You're not on ropsten")
          }
        }else{
          this.error('No Metamask detected, please install it first')
        }
      },
      async checkNetwork() {
        window.web3.version.getNetwork((err,id) => {
          if(id != 3) {
            return;
          }else{
            this.network = 3
            return;
          }
        })
      },
      error(value) {
        this.errorDialog = true
        this.errorMessage = value
      },
      closeDialog() {
        this.errorDialog = false
      }
    }
  }


</script>

<style>
	div {
    font-family: monaco;
    color: white;


  }
</style>.
