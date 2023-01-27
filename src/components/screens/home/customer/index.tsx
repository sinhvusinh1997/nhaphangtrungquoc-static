import styles from "./index.module.css";
import {Navigation, Pagination} from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {Swiper, SwiperSlide} from "swiper/react";
import {useState} from "react";
import {useQuery} from "react-query";
import {customerTalk} from "~/api";

export const Customer = () => {
	const [cur, setCur] = useState(1);
	const [newData, setNewData] = useState([]);

	useQuery(["customer-talk"], () => customerTalk.getList(), {
		onSuccess: (res) => {
			setNewData(res?.Data?.Items);
		},
		refetchOnWindowFocus: false,
	});

	return (
		<div className={styles.customerWrapper}>
			<div className="container">
				<h1 className="mainTitle text-center">Khách hàng nói về chúng tôi</h1>
				<p className="mainDes !w-[50%] text-center m-auto">
					Luôn là đơn vị nhập khẩu có uy tín hàng đầu, đem lại sự hài lòng về dịch vụ nhờ vào những giải pháp vận chuyển
					xuyên biên giới
				</p>
			</div>
			<div className="container">
				<Swiper
					pagination={false}
					slidesPerView={1}
					spaceBetween={50}
					navigation={true}
					modules={[Pagination, Navigation]}
					className="mySwiper customerSwiper"
					onSlideChange={(val) => setCur(val.activeIndex + 1)}
					breakpoints={{
						680: {
							slidesPerView: 2,
							spaceBetween: 20,
						},
						860: {
							slidesPerView: 3,
							spaceBetween: 40,
						},
						1200: {
							slidesPerView: 4,
							spaceBetween: 50,
						},
					}}
				>
					{newData?.map((item, index) => (
						<SwiperSlide key={`${index}`}>
							<div className={styles.boxSlider}>
								<div>
									<div className={styles.boxSliderImg}>
										<img src={item?.IMG} alt="" />
									</div>
									<h3 className="secondTitle mt-4 !text-[18px]">{item?.Name}</h3>
								</div>
								<div className={styles.boxSliderContent}>
									<p className="mainDes text-justify !text-sm">{item?.Description}</p>
								</div>
							</div>
						</SwiperSlide>
					))}
					<div className={styles.count}>{cur}</div>
				</Swiper>
			</div>
		</div>
	);
};
