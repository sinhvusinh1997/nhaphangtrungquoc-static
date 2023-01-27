import styles from "./index.module.css";

const BoxExp = ({data}) => {
	return (
		<div className={styles.boxExp}>
			<span className={styles.value}>{data?.value}</span>
			<span className="title text-center">{data?.title}</span>
		</div>
	);
};

export const Experience = () => {
	const fakeData = [
		{
			title: "Năm kinh nghiệm",
			value: 6,
		},
		{
			title: "Kho hàng Việt - Trung",
			value: 7,
		},
		{
			title: "Đơn hàng mỗi ngày",
			value: 800,
		},
		{
			title: "Khách hàng đang sử dụng",
			value: 9101,
		},
	];

	return (
		<div className={styles.experience}>
			<div className="container">
				<div className={styles.experienceInner}>
					<div className={styles.left}>
						<h1 className="mainTitle">Giá trị cốt lõi</h1>
						<p className="mainDes">
							Với những nỗ lực không ngừng hoàn thiện trong lĩnh vực nhập hàng Trung Quốc, giá trị cốt lỗi của Mona khác
							biệt và độc đáo với các tiêu chí sau: NHANH CHÓNG - HIỆU QUẢ - UY TÍN
						</p>
					</div>
					<div className={styles.right}>
						<div className={styles.innerRight}>
							{fakeData?.map((item) => (
								<BoxExp key={item.title} data={item} />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
