import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import router from "next/router";
import {toast} from "react-toastify";
import {apiWithoutToken, config} from "~/configs/appConfigs";
import Cookies from "js-cookie";

const apiConfig = {
	baseUrl: `${config.API_URL}`,
};

const instance = axios.create({
	baseURL: apiConfig.baseUrl,
	headers: {
		Accept: "application/json",
	},
	timeout: 30000, // 30 seconds
});

export const setToken = (token: string) => {
	instance.defaults.headers["Authorization"] = "Bearer " + token;
};

const getUrl = (config: any) => {
	if (config?.baseURL) {
		return config?.url.replace(config?.baseURL, "");
	}
	return config?.url;
};

// Intercept all request
instance.interceptors.request.use(
	async (config: AxiosRequestConfig) => {
		const configUrl = config.url;
		const configMethod = config?.method;
		if (
			(configMethod === "get" && apiWithoutToken.find((api) => api.match(configUrl))) ||
			(configMethod === "post" && configUrl.match("/authenticate/login"))
		) {
			config.headers = {
				Accept: "application/json",
			};
		}
		console.log(`%c ${config?.method.toUpperCase()} - ${getUrl(config)}:`, "color: #0086b3; font-weight: bold", config);
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Intercept all responses
instance.interceptors.response.use(
	(response: AxiosResponse) => {
		console.log(`%c ${response?.status} - ${getUrl(response?.config)}:`, "color: #008000; font-weight: bold", response);
		if (
			response?.data?.ResultCode === 401 &&
			response?.data?.ResultMessage === "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại"
		) {
			toast.error(response?.data?.ResultMessage, {
				position: "top-center",
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
			setTimeout(() => {
				localStorage.removeItem("currentUser");
				localStorage.removeItem("token");
				Cookies.remove("mToken");
				router.push("/");
			}, 1000);
			return null;
		}
		return response;
	},
	(error) => {
		// Phản hồi rồi mà bị lỗi từ phía server ...
		if (error?.response) {
			console.log("====== LỖI PHÍA SERVER =====");
			// console.log(error?.response);
		}
		// Lỗi request mãi mà không thấy
		else if (error?.request) {
			console.log("====== LỖI REQUEST MÃI KHÔNG THẤY =====");
		}
		// Lỗi gì đó ...
		else {
			console.log("====== LỖI CHƯA XÁC ĐỊNH =====");
		}

		// if (error?.response?.status === undefined && error?.response?.config === undefined) {
		// 	toast.error("Phiên đăng nhập đã hết! Vui lòng đăng nhập lại.", {
		// 		position: "top-center",
		// 		autoClose: 5000,
		// 		hideProgressBar: true,
		// 		closeOnClick: true,
		// 		pauseOnHover: true,
		// 		draggable: true,
		// 		progress: undefined,
		// 		theme: "colored",
		// 	});
		// 	setTimeout(signOut, 1000)
		// }

		console.log(
			`%c ${error?.response?.status} - ${getUrl(error?.response?.config)}:`,
			"color: #a71d5d; font-weight: bold",
			error?.response
		);
		return Promise.reject(error);
	}
);

export default instance;