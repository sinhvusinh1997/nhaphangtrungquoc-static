import styles from "./index.module.css";

import {Swiper, SwiperSlide} from "swiper/react";

// Import Swiper styles
import {useState} from "react";
import {Navigation, Pagination} from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const HomeBenefit = ({data}) => {
	const [cur, setCur] = useState(1);
	return (
		<div className={styles.benefitWrap}>
			<div className="container">
				<div className={styles.innerBenefit}>
					<div className={styles.left}>
						<img src="./benefit.png" alt="" />
					</div>
					<div className={styles.right}>
						<h1 className="mainTitle">Quyền lợi khách hàng</h1>
						<p className="mainDes">
							Mona nhằm mang đến cho quý khách hàng dịch vụ nhập hàng tốt nhất, chúng tôi luôn nỗ lực cải tiền không
							ngừng nhằm nâng cao chất lượng phục vụ , đem đến sự hài lòng cho khách hàng sử dụng dịch vụ của chúng tôi
							!
						</p>
						<Swiper
							pagination={{
								type: "progressbar",
							}}
							navigation={true}
							modules={[Pagination, Navigation]}
							className={`mySwiper ${styles.mySwiper}`}
							onSlideChange={(val) => setCur(val.activeIndex)}
						>
							{data?.map((item, index) => (
								<SwiperSlide key={`${item?.Code}--${index}`}>
									<div className={styles.boxSlider}>
										<div className="w-[4.5rem] h-[4.5rem] mr-6">
											<img src={item?.IMG} alt="" />
										</div>
										<div className="flex-1">
											<h3 className="secondTitle">{item?.Name}</h3>
											<p className="mainDes">{item?.Description}</p>
										</div>
									</div>
								</SwiperSlide>
							))}
							<div className={styles.count}>{cur}</div>
						</Swiper>
					</div>
				</div>
			</div>
		</div>
	);
};
