<template>
	<hans-tabber v-if="role === 'SALESMAN'" :list="list" style="position:fixed;bottom:0;width:100%;left:0;right:0; z-index: 9;" :current="current" >
	</hans-tabber>
</template>

<script>
	import hansTabber from '../../components/hans-tabbar/hans-tabbar.vue';
	export default {
		props: {
			current: {
				type: Number,
				default: 0
			}
		},
		mounted() {
			console.log(2)
			this.role = uni.getStorageSync('role')
		},
		data() {
			return {
				role: '',
				list: [{
					"pagePath": "pages/index/index",
					"iconPath": "../../static/tabbar/order.png",
					"selectedIconPath": "../../static/tabbar/order-active.png",
					"text": "订单"
				}, {
					"pagePath": "pages/customer/index",
					"iconPath": "../../static/tabbar/customer.png",
					"selectedIconPath": "../../static/tabbar/customer_active.png",
					"text": "客户"
				}]
			};
		},
		components: {
			hansTabber
		},
		methods: {
			tabChange(index) {
				if (index === 1) {
					uni.switchTab({
						url: '/pages/customer/index'
					})
				} else {
					uni.switchTab({
						url: '/pages/index/index'
					})
					
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
