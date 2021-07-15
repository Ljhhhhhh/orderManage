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
			<template v-for="(product,index) in productList">
				<view :key="index">
					<view class="cu-form-group margin-top">
						<view class="title">产品名称</view>
						<input placeholder="请输入产品名称" v-model="product.name"></input>
					</view>
					<view class="cu-form-group ">
						<view class="title">产品编号</view>
						<input placeholder="请输入编号" v-model="product.code" name="code"></input>
					</view>
					<view class="cu-form-group ">
						<view class="title">产品数量</view>
						<input type="digit" placeholder="请输入数量" v-model="product.number"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">产品类别</view>
						<input placeholder="请输入类别" v-model="product.category"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">规格型号</view>
						<input placeholder="请输入规格型号" v-model="product.spec"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">价格体系</view>
						<picker @change="pickerChange" :data-index="index" :value="product.discountIndex" :range="discountRange">
							<view :class="['picker', product.discountIndex === -1 ? 'empty' : '']">
								{{product.discountIndex>-1?discountRange[product.discountIndex]:'请选择价格体系'}}
							</view>
						</picker>
					</view>
					<view class="cu-form-group text-right" v-if="productList.length > 1">
						<button class="cu-btn bg-gray" @click="remove(index)">删除</button>
					</view>
				</view>
			</template>
			

			<view class="cu-form-group align-start margin-top">
				<view class="title">备注信息</view>
				<textarea maxlength="-1" v-model="remark" placeholder="备注"></textarea>
				<!--  @input="textareaBInput" -->
			</view>
			
			<view class="submit-btn-wrap">
				<button class="cu-btn bg-green lg submit-btn" @click="add">添加产品</button>
				<view style="width: 30rpx;height: 1rpx;"></view>
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
	const productInitial = {
		code: '',
		name: '',
		spec: '',
		category: '',
		discountIndex: -1,
		number: 1,
	}
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
				discountRange: ['无折扣', '95折','9折', '85折', '8折', ],
				customerIndex: -1,
				id: '',
				remark: '',
				productList: [
					{...productInitial}
				]
			};
		},
		methods: {
			remove(index) {
				this.productList.splice(index, 1);
			},
			customerChange(e) {
				this.customerIndex = e.detail.value;
			},
			pickerChange(e) {
				console.log(e, 'e')
				const index = e.target.dataset.index
				this.productList[index].discountIndex = e.detail.value;
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
			add() {
				this.productList.push({...productInitial})
			},
			submit: async function() {
				const _this = this;
				let method = 'POST'
				let url = '/order'
				if (this.id) {
					method = 'PUT'
					url += `/${this.id}`
				}
				const customerId = this.customerList[this.customerIndex].id;
				
				const productFormat = this.productList.map((product) => {
					product.discount = this.discountRange[product.discountIndex];
					return product;
				})
				console.log(productFormat, 'productFormat')
				// const { code, data } = await request(url, method, {
				// 	name: _this.name,
				// 	code: _this.code,
				// 	customerId,
				// 	category: _this.category,
				// 	spec: _this.spec,
				// 	discount,
				// 	remark: _this.remark,
				// });
				
				// if (code === 0) {
				// 	uni.showToast({
				// 		title: _this.id ? '更新订单成功' : '添加订单成功'
				// 	})
				// 	uni.redirectTo({
				// 		url: '/pages/index/index'
				// 	})
				// } else {
				// 	uni.showToast({
				// 		title: "操作失败",
				// 		icon: 'none'
				// 	})
				// }
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
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.submit-btn {
		width: 100%;
	}
</style>
