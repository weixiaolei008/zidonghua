<template>
	<div style="display: inline-block;">
<!--		<el-button :class="(type == 'solid')?'button-solid':'button-hollow'" @click="addClick" v-text="text" round></el-button>-->
		<el-button :class="type | typeMethod" @click="addClick" v-text="text" class="buttonSize" round></el-button>
	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		filters: {
			typeMethod: function(value){
				if(value == 'solid'){
					return 'button-solid'
				}
				else{
					return 'button-hollow'
				}
			}
		},	
		methods: {
			addClick() {
				this.$emit('click', '')
			}
		},
		props: ['text', 'type']
	}
</script>

<style scoped="scoped">
	.buttonSize {
		width: 84px;
		height: 37px;
		border-radius: 15px;
	}
	
	/*实心*/
	.button-solid {
		background: #D9524F;
		color: white;
		border-color: #D9524F;
	}
	
	.button-solid.is-active,
	.button-solid:active {
		background: #D9524F;
		border-color: #D9524F;
		color: white;
	}
	
	.button-solid:focus,
	.button-solid:hover {
		background: #d85e5b;
		border-color: #d85e5b;
		color: white;
	}
	
	/*空心*/
	.button-hollow {
		color: #D9524F;
		border-color: #D9524F;
	}
	
	.button-hollow.is-active,
	.button-hollow:active {
		color: #D9524F;
		border-color: #D9524F;
	}
	
	.button-hollow:focus,
	.button-hollow:hover {
		color: #d85e5b;
		background: white;
		border-color: #d85e5b;
	}
</style>