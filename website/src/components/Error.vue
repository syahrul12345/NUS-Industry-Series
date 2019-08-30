<template>
	<v-card>  
	<v-card-title style="color: black">Oops something went wrong</v-card-title>
    <v-card-text>{{ErrorMessage}}</v-card-text>
    <v-card-actions>
    	<v-btn @click="close" dark> OK </v-btn>
    </v-card-actions>
	</v-card>
	
</template>
<script>
	export default {
		props:['ErrorMessage'],
		data() {
			return {
				created: true
			}
		},
		methods: {
			close() {
				this.$emit('close')
			}
		}
	}
</script>
<style></style>