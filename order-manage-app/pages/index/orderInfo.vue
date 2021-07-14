<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{username ? username : '创建订单'}}</block>
		</cu-custom>
		<form>
			<view class="cu-form-group">
				<view class="title">订单客户</view>
				<picker range-key="username" @change="customerChange" :value="customerIndex" :range="customerList">
					<view :class="['picker', customerIndex === -1 ? 'empty' : '']">
						{{customerIndex>-1?customerList[customerIndex].username:'请选择客户'}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group margin-top">
				<view class="title">产品名称</view>
				<input placeholder="请输入产品名称" v-model="name"></input>
			</view>
			<view v-if="code" class="cu-form-group ">
				<view class="title">产品编号</view>
				<input disabled placeholder="请输入编号" v-model="code" name="code"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">产品类别</view>
				<input placeholder="请输入类别" v-model="discount"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">规格型号</view>
				<input placeholder="请输入规格型号" v-model="spec"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">价格体系</view>
				<picker @change="PickerChange" :value="discountIndex" :range="discountRange">
					<view :class="['picker', discountIndex === -1 ? 'empty' : '']">
						{{discountIndex>-1?discountRange[discountIndex]:'请选择价格体系'}}
					</view>
				</picker>
			</view>

			<view class="cu-form-group align-start">
				<view class="title">备注信息</view>
				<textarea maxlength="-1" v-model="remark" placeholder="备注"></textarea>
				<!--  @input="textareaBInput" -->
			</view>
			<view class="submit-btn-wrap">
				<button class="cu-btn bg-primary lg submit-btn" @click="submit">{{
					id ? '更新' : '保存'
				}}</button>
			</view>

		</form>
	</view>
</template>

<script>
	import {
		getCurPage,
		request
	} from '../../utils'
	export default {
		onShow(re) {
			const pageInfo = getCurPage()
			const id = pageInfo.options.id;
			this.getCustomerList();

			if (id) {
				this.id = id;
				// this.getCustomerInfo(id)
			}
		},
		data() {
			return {
				customerList: [],
				discountRange: ['8折', '85折', '9折', '95折'],
				discountIndex: -1,
				customerIndex: -1,
				id: '',
				code: '',
				username: '',
				address: '',
				linkName: '',
				phone: '',
				remark: '',
			};
		},
		methods: {
			customerChange(e) {
				this.customerIndex = e.detail.value;
			},
			PickerChange(e) {
				this.discountIndex = e.detail.value
			},
			getCustomerList: async function(id) {
				const {
					data,
					code
				} = await request(`/customer`, 'GET', {
					pageSize: 99999,
					current: 1,
				});
				this.customerList = data.list;
				console.log(data, 'data', code)
			},
			submit: async function() {
				const _this = this;
				let method = 'POST'
				let url = '/customer'
				if (this.id) {
					method = 'PUT'
					url += `/${this.id}`
				}
				const {
					code,
					data
				} = await request(url, method, {
					username: _this.username,
					address: _this.address,
					linkName: _this.linkName,
					phone: '+86' + _this.phone,
					remark: _this.remark,
				});

				if (code === 0) {
					uni.showToast({
						title: _this.id ? '更新客户成功' : '添加客户成功'
					})
					uni.redirectTo({
						url: '/pages/customer/index'
					})
				} else {
					uni.showToast({
						title: "操作失败",
						icon: 'none'
					})
				}
			}

		}
	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}

	.submit-btn-wrap {
		margin: 30rpx;
	}

	.submit-btn {
		width: 100%;
	}
</style>
