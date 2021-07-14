<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{username ? username : '客户信息'}}</block>
		</cu-custom>
		<form>
			<view v-if="code" class="cu-form-group margin-top">
				<view class="title">客户编号</view>
				<input disabled placeholder="请输入编号" v-model="code" name="code"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">客户姓名</view>
				<input placeholder="请输入姓名" v-model="username"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">客户地址</view>
				<input placeholder="请输入地址" v-model="address"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">联系人</view>
				<input placeholder="请输入联系人" v-model="linkName"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">联系电话</view>
				<input placeholder="请输入联系电话" v-model="phone"></input>
				<view class="cu-capsule radius">
					<view class='cu-tag bg-blue '>
						+86
					</view>
					<view class="cu-tag line-blue">
						中国大陆
					</view>
				</view>
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

			if (id) {
				this.id = id;
				this.getCustomerInfo(id)
			}
		},
		data() {
			return {
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
			getCustomerInfo: async function(id) {
				const {
					data,
					code
				} = await request(`/customer/${id}`, 'GET');
				this.id = data.id;
				this.code = data.code;
				this.username = data.username;
				this.address = data.address;
				this.linkName = data.linkName;
				this.phone = data.phone ? data.phone.substr(3) : '';
				this.remark = data.remark;
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
