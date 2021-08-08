<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{username ? username : '创建订单'}}</block>
		</cu-custom>
		<form>
			<view v-if="id" class="cu-form-group margin-top margin-bottom">
				<view class="title">订单状态</view>
				<view class="value" v-if="status === 0">未确认（可修改）</view>
				<view class="value" v-if="status === 1">生产中</view>
				<view class="value" v-if="status === 2">待发货</view>
				<view class="value" v-if="status === 3">已发货（不可取消）</view>
			</view>
			<view class="cu-form-group" v-if="roleType === 's'">
				<view class="title">订单客户</view>
				<picker :disabled="id" range-key="username" @change="customerChange" :value="customerIndex"
					:range="customerList">
					<view :class="['picker', customerIndex === -1 ? 'empty' : '']">
						{{customerIndex>-1?customerList[customerIndex].username:'请选择客户'}}
					</view>
				</picker>
			</view>
			<template v-for="(product,index) in productList">
				<view :key="index">
					<view class="cu-form-group margin-top">
						<view class="title"><span class="required-symbol">*</span>选择产品</view>
						<!-- <text  >{{product.name || '请选择产品'}}</text> -->
						<input @click="selectProduct(index)" readonly disabled placeholder="请选择产品"
							v-model="product.name"></input>
						<text class="cuIcon-right" style="color:#999;font-size: 34rpx;"></text>
					</view>
					<view class="cu-form-group">
						<view class="title"><span class="required-symbol">*</span>规格型号</view>
						<input disabled placeholder="请输入规格型号" v-model="product.spec"></input>
					</view>
					<view class="cu-form-group ">
						<view class="title"><span class="required-symbol">*</span>产品数量</view>
						<input :disabled="!canUpdate || roleType === 'p'" type="digit" placeholder="请输入数量"
							v-model="product.number"></input>
					</view>
					
					<!-- <view class="cu-form-group ">
						<view class="title"><span class="required-symbol">*</span>产品编号</view>
						<input :disabled="!canUpdate || roleType === 'p'" placeholder="请输入编号" v-model="product.code" name="code"></input>
					</view>
					
					<view class="cu-form-group">
						<view class="title"><span class="required-symbol">*</span>产品类别</view>
						<input :disabled="!canUpdate || roleType === 'p'" placeholder="请输入类别" v-model="product.category"></input>
					</view>
					<view class="cu-form-group">
						<view class="title"><span class="required-symbol">*</span>规格型号</view>
						<input :disabled="!canUpdate || roleType === 'p'" placeholder="请输入规格型号" v-model="product.spec"></input>
					</view> -->
					<view class="cu-form-group">
						<view class="title">价格体系</view>
						<picker :disabled="!canUpdate || roleType === 'p'" @change="pickerChange" :data-index="index"
							:value="product.discountIndex" :range="discountRange">
							<view :class="['picker', product.discountIndex === -1 ? 'empty' : '']">
								{{product.discountIndex>-1?discountRange[product.discountIndex]:'请选择价格体系'}}
							</view>
						</picker>
					</view>
					<view class="cu-form-group align-start">
						<view class="title">备注信息</view>
						<textarea :disabled="!canUpdate || roleType === 'p'" :maxlength="150" v-model="product.remark"
							placeholder="备注"></textarea>
						<!--  @input="textareaBInput" -->
					</view>
					<view class="cu-form-group text-right"
						v-if="roleType !== 'p' && canUpdate && productList.length > 1">
						<button class="cu-btn bg-gray" @click="remove(index)">删除</button>
					</view>
				</view>
			</template>

			<view class="submit-btn-wrap" v-if="roleType==='p'">
				<button v-if="status === 0" class="cu-btn bg-gradual-orange lg submit-btn"
					@click="changeStatus(1)">更新为生产中</button>
				<button v-if="status === 1" class="cu-btn bg-gradual-red lg submit-btn"
					@click="changeStatus(2)">更新为待发货</button>
				<button v-if="status === 2" class="cu-btn bg-gradual-green lg submit-btn"
					@click="changeStatus(3)">更新为已发货</button>
				<button v-if="status === 3" class="cu-btn bg-gradual-purple lg submit-btn">已发货</button>
			</view>

			<template v-if="roleType==='s'">
				<view class="submit-btn-wrap" v-if="canUpdate">
					<button v-if="!id" class="cu-btn bg-green lg submit-btn" @click="add">添加产品</button>
					<view v-if="!id" style="width: 30rpx;height: 1rpx;"></view>
					<button class="cu-btn bg-primary lg submit-btn" @click="submit">{{
						id ? '更新' : '保存'
					}}</button>
				</view>
				<view v-if="canCancel && id" class="submit-btn-wrap">
					<button class="cu-btn bg-red lg submit-btn" @click="cancel">取消订单</button>
				</view>
			</template>

		</form>
		<uni-popup ref="products" type="bottom">
			<!-- <view class="search-input">
				<input placeholder="搜索产品" v-model="searchValue" type="text">
			</view> -->
			<v-tabs v-model="currentNameIndex" :tabs="productNameList" @change="changeName"></v-tabs>
			<view class="cu-form-group" style="border-bottom: 1rpx solid #aaa;">
				<view class="title">搜索型号</view>
				<input placeholder="请输入型号" v-model="searchValue"></input>
			</view>
			<!-- <scroll-view scroll-x="true" class="name-list">
				<view v-for="(item,index) in productNameList" :key="item" class="cu-tag">{{item}}</view>
			</scroll-view> -->
			<scroll-view scroll-y="true" class="product-wrap">
				<view class="cu-list menu sm-border" @click="handleProduct(item)" v-for="item in searchedList"
					:key="item.id">
					<view class="cu-item">
						<view class="content">
							<text class="text-sm">{{item.name}}</text>
							<text style="display: inline-block;width: 10rpx;height: 1rpx;"></text>
							<text class="cu-tag round bg-orange light">{{item.spec}}</text>
						</view>
						<view class="action">
							
							<view class="cu-tag round bg-olive light">{{item.code}}</view>
							<!-- <view class="" v-if="item.category">{{item.category}}</view> -->
						</view>
					</view>
				</view>
			</scroll-view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getCurPage,
		request
	} from '../../utils'
	const productInitial = {
		id: null,
		productId: '',
		name: '',
		discountIndex: 0,
		number: 1,
		remark: '',
	}
	export default {
		onShow(re) {
			const pageInfo = getCurPage()
			uni.showLoading({
				 title: '加载中……',
				position: 'center'
			})
			const id = pageInfo.options.id;
			this.id = id;
			if (uni.getStorageSync('role') === 'PRODUCTION') {
				this.roleType = 'p';
			} else {
				this.roleType = 's';
			}
			this.getCustomerList();

		},
		data() {
			return {
				currentName: '',
				currentNameIndex: -1,
				searchValue: '',
				status: 0,
				roleType: 's',
				canUpdate: true,
				canCancel: true,
				customerList: [],
				products: [],
				productNameList: [],
				searchedList: [],
				filterList: [],
				discountRange: ['无折扣', '95折', '9折', '85折', '8折', ],
				customerIndex: -1,
				id: '',
				remark: '',
				productList: [{
					...productInitial
				}],
				handleProductIndex: -1,
			};
		},
		watch: {
			searchValue: function(val) {
				if (!val) {
					this.searchedList = this.filterList;
				} else {
					this.searchedList = this.filterList.filter(item => {
						return item.spec.toLowerCase().includes(val.toLowerCase());
					})
				}
			},
			filterList: function(val) {
				this.searchedList = val.filter(item => {
					return item.spec.toLowerCase().includes(this.searchValue);
				})
			}
		},
		methods: {
			changeName(index) {
				this.currentNameIndex = index;
				const name = this.productNameList[index];
				const list = this.products.filter(product => product.name === name)
				this.filterList = list.filter(item => item.spec.toLowerCase().includes(this.searchValue))
			},
			handleProduct(product) {
				this.productList[this.handleProductIndex].productId = product.id;
				this.productList[this.handleProductIndex].name = product.name;
				this.productList[this.handleProductIndex].spec = product.spec;
				this.handleProductIndex = -1;
				this.searchValue = ''
				this.$refs.products.close()
			},
			selectProduct(index) {
				if (!this.canUpdate || this.roleType === 'p') return;
				this.$refs.products.open('bottom')
				this.handleProductIndex = index;
			},
			async changeStatus(status) {
				let message = '';
				switch (status){
					case 1:
						message = '更新为生产中'
						break;
					case 2:
						message = '更新为待发货'
						break;
					case 3:
						message = '更新为已发货'
						break;
					default:
						break;
				}
				uni.showModal({
					title: '提示',
					content: message,
					cancelText: '取消',
					confirmText: '确认',
					success: async (res) => {
						if (res.confirm) {
						    const customerId = this.productList[0].customerId;
						    const newList = [...this.productList];
						    newList.forEach(item => {
						    	item.status = status;
						    });
						    const [err, data] = await request(`/order/${this.id}`, 'put', {
						    	customerId,
						    	productList: newList,
						    })
						    if (!err) {
						    	this.status = status;
						    }
						} else if (res.cancel) {
						    console.log('用户点击取消');
						}
					}
				})
				
				
			},
			async cancel() {
				uni.showModal({
					title: '提示',
					content: '确认取消订单？',
					cancelText: '取消',
					confirmText: '确认',
					success: async (res) => {
						if (res.confirm) {
							const [err, data] = await request(`/order/${this.id}`, 'DELETE');
							if (!err) {
								uni.showToast({
									title: '操作成功，请刷新页面'
								})
								setTimeout(() => {
									uni.redirectTo({
										url: '/pages/index/index'
									})
								}, 1000)
							
							}
						}}
				})
				
			},
			async getOrderDetail() {
				const [err, data] = await request(`/order/${this.id}`, 'GET');
				const list = []
				data.forEach(item => {
					const ddp = this.products.find(p => item.productId === p.id)
					const product = {
						id: item.id,
						productId: item.productId,
						name: ddp.name,
						spec: ddp.spec,
						discountIndex: this.discountRange.findIndex((o) => item.discount === o),
						number: item.number,
						remark: item.remark,
					}
					list.push(product)
				})
				this.productList = list;
				const {
					customerId,
					status
				} = data[0]
				this.customerIndex = this.customerList.findIndex((o) => customerId === o.id)
				this.canUpdate = status === 0; // 未确认就可以更新
				this.canCancel = status !== 3; // 未发货就可以取消
				this.status = +status;
			},
			remove(index) {
				this.productList.splice(index, 1);
			},
			customerChange(e) {
				this.customerIndex = e.detail.value;
			},
			pickerChange(e) {
				const index = e.target.dataset.index
				this.productList[index].discountIndex = e.detail.value;
			},
			getProductList: async function() {
				const [err, data] = await request(`/product`, 'GET', {
					pageSize: 99999,
					current: 1,
				});
				this.products = this.searchedList = this.filterList = data.list;
				const nameList = ['小型减速电机', '微型齿轮减速机']
				
				data.list.forEach(product => {
					if (!nameList.includes(product.name)) {
						nameList.push(product.name)
					}
					// if (!nameList[product.name]) {
					// 	nameList[product.name] = []
					// }
					// nameList[product.name].push(product)
				})
				this.productNameList = nameList
				if (this.id) {
					this.getOrderDetail();
				}
				uni.hideLoading()
			},
			getCustomerList: async function(id) {
				const url = uni.getStorageSync('role') === 'PRODUCTION' ? '/customer/list' : '/customer'
				const [err, data] = await request(url, 'GET', {
					pageSize: 99999,
					current: 1,
				});
				this.customerList = data.list;
				this.getProductList();
			},
			add() {
				this.productList.push({
					...productInitial
				})
			},
			submit: async function() {
				if (this.customerIndex < 0) {
					uni.showToast({
						title: '请选择客户',
						icon: 'none'
					})
					return;
				}

				let valid = true;
				const productFormat = this.productList.map((product) => {
					const requiredKeys = ['name', 'productId', 'number'];
					requiredKeys.forEach(key => {
						if (!product[key]) {
							uni.showToast({
								title: '请正确填写',
								icon: 'none'
							})
							valid = false;
						}
					})
					if (!product.number) {
						uni.showToast({
							title: '产品数量必填',
							icon: 'none'
						})
						valid = false;
					}
					product.discount = this.discountRange[product.discountIndex];
					return product;
				})
				if (!valid) return;

				const _this = this;
				let method = 'POST'
				let url = '/order'
				if (this.id) {
					method = 'PUT'
					url += `/${this.id}`
				}
				const customerId = this.customerList[this.customerIndex].id;


				const [err, data] = await request(url, method, {
					customerId,
					productList: productFormat
				})
				console.log(err, 'err')
				if (!err) {
					uni.showToast({
						title: _this.id ? '更新订单成功' : '添加订单成功'
					})
					uni.redirectTo({
						url: '/pages/index/index'
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
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.required-symbol {
		color: #f63;
	}

	.submit-btn {
		width: 100%;
	}
	
	.name-list {
		width: 100%;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	.product-wrap {
		max-height: 960rpx;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}

	.product-wrap .cu-list+.cu-list {
		margin-top: 0;
		border-top: 1rpx solid #e5e5e5;
	}

	.search-input {
		height: 88rpx;
		line-height: 88rpx;
		background: #fff;
		border-bottom: 1rpx solid #999;
		padding: 0 30rpx;
	}

	.search-input input {
		line-height: 88rpx;
	}
</style>
