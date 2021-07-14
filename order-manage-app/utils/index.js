export const baseUrl = 'http://127.0.0.1:3000';

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
			if (!err) {
				resolve(result.data)
			} else {
				reject(err)
			}
		}catch(e){
			reject(e)
			//TODO handle the exception
		}
		
	})
	
}