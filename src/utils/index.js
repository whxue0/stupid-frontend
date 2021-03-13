
// 前端对图片进行压缩
function dealImage(base64, w, callback) {
	var newImage = new Image();
	var quality = 0.6;    //压缩系数0-1之间
	newImage.src = base64;
	newImage.setAttribute("crossOrigin", 'Anonymous');	//url为外域时需要
	var imgWidth, imgHeight;
	newImage.onload = function () {
		imgWidth = this.width;
		imgHeight = this.height;
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		if (Math.max(imgWidth, imgHeight) > w) {
			if (imgWidth > imgHeight) {
				canvas.width = w;
				canvas.height = w * imgHeight / imgWidth;
			} else {
				canvas.height = w;
				canvas.width = w * imgWidth / imgHeight;
			}
		} else {
			canvas.width = imgWidth;
			canvas.height = imgHeight;
			quality = 0.6;
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
		var base64 = canvas.toDataURL("image/jpeg", quality); //压缩语句
		callback(base64);//必须通过回调函数返回，否则无法及时拿到该值
	}
}

function dealImageList(base64List, w, callback) {
	const len = base64List.length;
	const urlList = [];
	for(let i = 0 ; i<len ; i++) {
		let newImage = new Image();
		let quality = 0.6;    //压缩系数0-1之间
		newImage.src = base64List[i];
		newImage.setAttribute("crossOrigin", 'Anonymous');	//url为外域时需要
		let imgWidth, imgHeight;
		newImage.onload = function () {
			imgWidth = this.width;
			imgHeight = this.height;
			let canvas = document.createElement("canvas");
			let ctx = canvas.getContext("2d");
			if (Math.max(imgWidth, imgHeight) > w) {
				if (imgWidth > imgHeight) {
					canvas.width = w;
					canvas.height = w * imgHeight / imgWidth;
				} else {
					canvas.height = w;
					canvas.width = w * imgWidth / imgHeight;
				}
			} else {
				canvas.width = imgWidth;
				canvas.height = imgHeight;
				quality = 0.6;
			}
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
			let base64 = canvas.toDataURL("image/jpeg", quality); //压缩语句
			urlList.push(base64);
		}
	}
	callback(urlList);
}

const formatTime = date => {
	//const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	//const second = date.getSeconds()
  
	return `${[month, day].map(formatNumber).join('/')} ${[hour, minute].map(formatNumber).join(':')}`
  }
  
const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : `0${n}`
}

export {dealImage, dealImageList, formatTime}