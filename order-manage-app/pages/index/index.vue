<template>
	<view>
		<cu-custom bgColor="bg-primary">
			<block slot="content">订单</block>
		</cu-custom>
		<view class="op-content">
			<mescroll-uni :down="downOption" :up="{textNoMore: '— — 我是有底线的 — —'}" top="168rpx" ref="mescrollRef" @init="mescrollInit"
				@down="downCallback" @up="upCallback">
				<view style="width: 1px;height: 30rpx;"></view>
				<!-- <view class="customer-item" @click="goCustomer(order)" v-for="order in list" :key="order.orderId">
					<view class="user-info">
						<text>订单编号：{{order.orderId}}</text>
						<view v-if="order.status === 0" class="cu-tag round bg-red light">待确认</view>
						<view v-if="order.status === 1" class="cu-tag round bg-blue light">生产中</view>
						<view v-if="order.status === 2" class="cu-tag round bg-green light">待发货</view>
						<view v-if="order.status === 3" class="cu-tag round bg-orange light">已发货</view>
					</view>
					<view class="right">
						<text class="cuIcon-right"></text>
					</view>
				</view> -->
				<view class="cu-list menu sm-border" @click="goCustomer(order)" v-for="order in list" :key="order.orderId">
					<view class="cu-item arrow">
						<view class="content">
							<view>
								<text v-if="roleType === 's'" class="cu-tag bg-primary">{{order.customerName}}</text>
								<text>{{order.nameList.split('!@!@').join('、')}}</text>
							</view>
							
							<view class="text-gray text-sm">订单编号：{{order.orderId}}</view>
						</view>
						<view class="action">
							<view v-if="order.status === 0" class="cu-tag round bg-red light">待确认</view>
							<view v-if="order.status === 1" class="cu-tag round bg-blue light">生产中</view>
							<view v-if="order.status === 2" class="cu-tag round bg-green light">待发货</view>
							<view v-if="order.status === 3" class="cu-tag round bg-orange light">已发货</view>
							
						</view>
					</view>
				</view>
				<!-- <view class="customer-item" @click="goCustomer(order)" v-for="order in list" :key="order.orderId">
					<view class="user-info">
						<text>订单编号：{{order.orderId}}</text>
						<view v-if="order.status === 0" class="cu-tag round bg-red light">待确认</view>
						<view v-if="order.status === 1" class="cu-tag round bg-blue light">生产中</view>
						<view v-if="order.status === 2" class="cu-tag round bg-green light">待发货</view>
						<view v-if="order.status === 3" class="cu-tag round bg-orange light">已发货</view>
					</view>
					<view class="right">
						<text class="cuIcon-right"></text>
					</view>
				</view> -->
			</mescroll-uni>
		</view>

		<view class="flat-btn left" @click="logout">
			<image src="../../static/logout.png" mode=""></image>
		</view>
		<view v-if="roleType === 's'" class="flat-btn" @click="createOrder">
			<image src="../../static/flatAdd.png" mode=""></image>
		</view>
		<tabbar :current="0" />
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
				roleType: 's'
			};
		},
		mounted() {
			if (uni.getStorageSync('role') === 'PRODUCTION') {
				this.roleType = 'p'
			}
		},
		methods: {
			logout: function() {
				uni.showModal({
				    title: '提示',
				    content: '确认退出登录？',
					showCancel: true,
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定');
							uni.clearStorageSync()
							uni.redirectTo({
							    url: '/pages/login/login'
							});
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
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
				const url = uni.getStorageSync('role') === 'SALESMAN' ? '/order/list' : '/order'
				try {
					const [err, data] = await request(url, 'GET', {
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
						
					}
				} catch (e) {
					this.mescroll.endErr();
					console.log(e, 'e')
					//TODO handle the exception
				}
			},
			goCustomer: function(customer) {
				uni.navigateTo({
					url: `/pages/index/orderInfo?id=${customer.orderId}`
				})
			},
			createOrder: function() {
				uni.navigateTo({
					url: '/pages/index/orderInfo'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.op-content {
		margin-top: 168rpx;
	}

	.flat-btn {
		width: 60rpx;
		height: 60rpx;
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

	.flat-btn.left {
		left: 30rpx;
		width: 50rpx;
		height: 50rpx;
		image {
			box-shadow: none;
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
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex: 1;
		}
		.right {
			// width: 60rpx;
			text-align: right;
		}
	}
</style>
