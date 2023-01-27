import clsx from "clsx";
import styles from "./index.module.css";

export const HomeServices = ({data}) => {
	return (
		<div className={clsx(styles.servicesWrap)}>
			<div className="container">
				<h1 className="mainTitle text-center uppercase !text-white">dịch vụ của chúng tôi</h1>
				<p className="mainDes !text-white w-[50%] m-auto text-center">
					MONA là giải pháp nhập hàng tối ưu cho quý khách. Chúng tôi mang lại cho khách hàng nguồn hàng phong phú với
					mức giá cực rẻ.
				</p>
				<div className={styles.innerContent}>
					{data?.map((item, index) => (
						<div className={styles.box} key={`${item?.Code}-${index}`}>
							<div className={styles.logo}>
								<img src={item?.IMG} alt="" />
							</div>
							<h3 className="!text-white secondTitle !text-center my-4">{item?.Name}</h3>
							<p className="!text-white mainDes !text-[14px] !text-center">{item?.Description}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
