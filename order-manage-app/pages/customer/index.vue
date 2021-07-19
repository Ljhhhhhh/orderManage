<template>
	<view>
		<cu-custom bgColor="bg-primary">
			<block slot="content">我的客户</block>
		</cu-custom>
		<view class="content">
			<mescroll-uni :down="downOption" :up="{textNoMore: '— — 我是有底线的 — —'}" top="168rpx" ref="mescrollRef" @init="mescrollInit"
				@down="downCallback" @up="upCallback">
				<view style="width: 1px;height: 30rpx;"></view>
				<view class="customer-item" @click="goCustomer(customer)" v-for="customer in list" :key="customer.id">
					<view class="user-info">
						<text class="cuIcon-my"></text>
						<text> {{customer.username}}</text>
					</view>
					<view class="user-info">
						<text>{{customer.phone.substr(3)}} </text>
						<text class="cuIcon-right"></text>
					</view>

				</view>
			</mescroll-uni>
		</view>

		<view class="flat-btn" @click="createCustomer">
			<image src="../../static/flatAdd.png" mode=""></image>
		</view>
		<tabbar :current="1" />
	</view>
</template>

<script>
	import tabbar from '../component/tabbar.vue';
	import {
		request
	} from '../../utils/index.js'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		components: {
			tabbar
		},
		data() {
			return {
				downOption: {
					auto: false //是否在初始化后,自动执行downCallback; 默认true
				},
				list: [],
				current: 0,
			};
		},
		methods: {
			downCallback: function() {
				const num = 1
				this.mescroll.setPageNum(num)
				this.fetchCustomer(num)
			},
			upCallback: function() {
				const num = +this.current + 1
				this.mescroll.setPageNum(num)
				this.fetchCustomer(num)
			},
			fetchCustomer: async function(current = 1) {
				const [err, data] = await request('/customer', 'GET', {
					current,
					pageSize: 10
				})
				if (!err) {
					let curList = []
					if (current === 1) {
						curList = data.list;
					} else {
						curList = [...this.list, ...data.list]
					}
					const hasNext = curList.length < data.total;
					this.mescroll.endSuccess(data.list.length, hasNext);
					this.list = curList;
					this.current = data.current;
					
				} else {
					this.mescroll.endErr();
				}
			},
			goCustomer: function(customer) {
				uni.navigateTo({
					url: `/pages/customer/info?id=${customer.id}`
				})
			},
			createCustomer: function() {
				uni.navigateTo({
					url: '/pages/customer/info?type=create'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		margin-top: 168rpx;
	}

	.flat-btn {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		position: fixed;
		bottom: 200rpx;
		right: 30rpx;
		z-index: 9999;

		image {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			box-shadow: 0 0 10rpx #0092ff inset;
		}
	}

	.customer-item {
		&.header {
			color: #000;
			font-size: 28rpx;
			box-shadow: none;
			border-bottom: 1rpx solid #000;
		}

		width: 690rpx;
		margin: 0 30rpx;
		display: flex;
		padding: 0 20rpx;
		line-height: 120rpx;
		justify-content: space-between;
		align-items: center;
		color: #333;
		border-bottom: 1rpx solid #e4e4e4;

		.user-info {
			text-align: center;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 28rpx;
		}
	}
</style>
