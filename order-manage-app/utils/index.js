export const baseUrl = 'https://cixing-api.plusdoit.com'
// http://localhost:3000 'https://cixing-api.plusdoit.com'; // 
export function getCurPage(){
    let pages = getCurrentPages();
    let curPage = pages[pages.length-1];
    return curPage
}

function cleanArray(actual) {
   const newArray = []
   for (let i = 0; i < actual.length; i++) {
     if (actual[i]) {
       newArray.push(actual[i])
     }
   }
   return newArray
 }

function param(json) {
   if (!json) return ''
   return cleanArray(Object.keys(json).map(key => {
     if (json[key] === undefined) return ''
     return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key])
   })).join('&')
 }

export async function request(url, method, data) {
	const header = {
		'Content-Type': 'application/json',
	}
	const token = uni.getStorageSync('token');
	if (token) {
		header['Authorization'] = 'Bearer ' + token
	}
	
	return new Promise(async (resolve, reject) => {
		try{
			const [err, result] = await uni.request({
				url: baseUrl + url,
				header,
				method,
				data
				// ...options
			})
			if (result.data.status === 401) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				})
				uni.clearStorageSync();
				uni.redirectTo({
					url: 'pages/login/login'
				})
				return;
			}
			if (!err) {
				const { code, status, message } = result.data;
				const errCode = status || code;
				console.log(result.data.response, '=-=-0')
				if (errCode) {
					const responseMessage = result.data.response.message && result.data.response.message.join(',')
					uni.showToast({
						title: responseMessage || message || '网络错误',
						icon: 'none'
					})
				}
				resolve([errCode, result.data.data])
			} else {
				resolve([err, (result|| {}).data])
			}
		}catch(e){
			resolve([e, null])
			//TODO handle the exception
		}
		
	})
	
}