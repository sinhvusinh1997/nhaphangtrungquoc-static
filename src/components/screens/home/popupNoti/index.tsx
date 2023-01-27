import {Modal} from "antd";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useQuery} from "react-query";
import configHomeData from "~/api/config-home";
import styles from "./index.module.css";

export const PopupNoti = () => {
	const router = useRouter();
	const [openModal, setOpenModal] = useState(() => {
		localStorage.setItem("popupNoti", JSON.stringify(true));
		return true;
	});

	const {data, isFetching, isLoading} = useQuery(["confighome"], () => configHomeData.get(), {
		onSuccess: (res) => {
			return res?.data?.Data;
		},
		retry: false,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		const localOpen = localStorage.getItem("popupNoti");
		if (JSON.parse(localOpen)) {
			setOpenModal(true);
		}
	}, [router]);

	return (
		<Modal
			visible={!data?.data?.Data?.NotiPopupTitle ? false : openModal}
			closeIcon={false}
			footer={false}
			className="homePopupNoti"
		>
			<div className={styles.popupNoti}>
				<div className={styles.head}>
					<h1>{data?.data?.Data?.CompanyLongName}</h1>
				</div>
				<div className={styles.content}>
					<h3>{data?.data?.Data?.NotiPopupTitle}</h3>
					<div dangerouslySetInnerHTML={{__html: data?.data?.Data?.NotiPopup}}></div>
				</div>
				<div className={styles.foot}>
					<button
						className={`${styles.btn} ${styles.btn1}`}
						onClick={() => {
							setOpenModal(!openModal);
							localStorage.setItem("popupNoti", JSON.stringify(false));
						}}
					>
						Đóng và không hiện lại
					</button>
					<button className={`${styles.btn} ${styles.btn2}`} onClick={() => setOpenModal(!openModal)}>
						Đóng
					</button>
				</div>
				<div className={styles.contact}>
					<a href={`mailto:${data?.data?.Data?.NotiPopupEmail}`}>{data?.data?.Data?.NotiPopupEmail}</a>
					<span className="text-white">||</span>
					<a href={`tel:${data?.data?.Data?.Hotline}`}>{data?.data?.Data?.Hotline}</a>
				</div>
			</div>
		</Modal>
	);
};
