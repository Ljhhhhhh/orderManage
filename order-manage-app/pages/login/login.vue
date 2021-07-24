<template>
	<view class="login">
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image :src="logoImage"></image>
			</view>
			<!-- 主体表单 -->
			<view class="main">
				<wInput v-model="username" type="text" placeholder="用户名" :focus="isFocus"></wInput>
				<wInput v-model="password" type="password" maxlength="16" placeholder="密码"></wInput>
			</view>
			<wButton class="wbutton" text="登 录" :rotate="isRotate" @click="startLogin"></wButton>

			<!-- 底部信息 -->
			<view class="footer">
				<!-- <navigator url="forget" open-type="navigate">找回密码</navigator> -->
				<!-- <text>|</text>
				<navigator url="register" open-type="navigate">注册账号</navigator> -->
			</view>
		</view>
	</view>
</template>

<script>
	let _this;
	import wInput from '../component/watch-login/watch-input.vue' //input
	import wButton from '../component/watch-login/watch-button.vue' //button
	import {
		baseUrl
	} from '../../utils/index.js'
	import {
		mapMutations
	} from 'vuex'
	import logo from './logo-f.png';

	export default {
		data() {
			return {
				//logo图片 base64
				logoImage: logo,
				username: '', //用户/电话
				password: '', //密码
				isRotate: false, //是否加载旋转
				isFocus: true // 是否聚焦
			};
		},
		components: {
			wInput,
			wButton,
		},
		mounted() {
			_this = this;
			//this.isLogin();
		},
		methods: {
			...mapMutations([
				'setInfo'
			]),
			isLogin() {
				//判断缓存中是否登录过，直接登录
				// try {
				// 	const value = uni.getStorageSync('setUserData');
				// 	if (value) {
				// 		//有登录信息
				// 		console.log("已登录用户：",value);
				// 		_this.$store.dispatch("setUserData",value); //存入状态
				// 		uni.reLaunch({
				// 			url: '../../../pages/index',
				// 		});
				// 	}
				// } catch (e) {
				// 	// error
				// }
			},
			async startLogin() {
				const _this = this;
				//登录
				if (this.isRotate) {
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.username.length === "") {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '用户名不能为空'
					});
					return;
				}
				if (this.password.length < 5) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '密码不正确'
					});
					return;
				}
				_this.isRotate = true
				const [err, result] = await uni.request({
					url: baseUrl + '/users/login',
					method: 'POST',
					data: {
						username: _this.username,
						password: _this.password
					}
				})
				if (!err && result.data.code === 0) {
					const userinfo = result.data.data;
					console.log(userinfo, 'userinfo')
					_this.setInfo(userinfo)
					uni.setStorageSync('token', userinfo.token)
					uni.setStorageSync('role', userinfo.role)
					uni.showToast({
						title: '登录成功',
					})
					uni.redirectTo({
						url: '/pages/index/index'
					})
				} else {
					uni.showToast({
						title: '登录失败，请重试',
						icon: 'none'
					})
				}
				_this.isRotate = false


				// uni.showLoading({
				// 	title: '登录中'
				// });
				// getLogin()
				// .then(res => {
				// 	//console.log(res)
				// 	//简单验证下登录（不安全）
				// 	if(_this.phoneData==res.data.username && _this.passData==res.data.password){
				// 		let userdata={
				// 			"username":res.data.username,
				// 			"nickname":res.data.nickname,
				// 			"accesstoken":res.data.accesstoken,
				// 		} //保存用户信息和accesstoken
				// 		_this.$store.dispatch("setUserData",userdata); //存入状态
				// 		try {
				// 			uni.setStorageSync('setUserData', userdata); //存入缓存
				// 		} catch (e) {
				// 			// error
				// 		}
				// 		uni.showToast({
				// 			icon: 'success',
				// 			position: 'bottom',
				// 			title: '登录成功'
				// 		});
				// 		uni.reLaunch({
				// 			url: '../../../pages/index',
				// 		});
				// 	}else{
				// 		_this.passData=""
				// 		uni.showToast({
				// 			icon: 'error',
				// 			position: 'bottom',
				// 			title: '账号或密码错误，账号admin密码admin'
				// 		});
				// 	}
				// 	uni.hideLoading();
				// }).catch(err => {
				// 	uni.hideLoading();
				// })

			},
			login_weixin() {
				//微信登录
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '...'
				});
			},
			login_weibo() {
				//微博登录
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '...'
				});
			},
			login_github() {
				//github登录
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '...'
				});
			}
		}
	}
</script>

<style>
	@import url("../component/watch-login/css/icon.css");
	@import url("./css/main.css");
</style>
