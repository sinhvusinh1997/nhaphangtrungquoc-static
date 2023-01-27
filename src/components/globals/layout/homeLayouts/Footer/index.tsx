import {Image} from "antd";
import Link from "next/link";
import router from "next/router";
import React, {useEffect, useState} from "react";
import {useQuery} from "react-query";
import {Page} from "~/api";
import {socialList} from "~/configs";
import styles from "./index.module.css";

const handleSetMenu = (dataConfig) => {
	const socialListRender = socialList?.map((social) => {
		return {
			...social,
			link: dataConfig[social.title],
		};
	});
	return socialListRender;
};

const Footer = ({dataConfig, dataMenu}) => {
	if (!dataConfig || !dataMenu) return null;
	const [socialListRender, setSocialListRender] = useState(handleSetMenu(dataConfig));
	useEffect(() => setSocialListRender(handleSetMenu(dataConfig)), [dataConfig, dataMenu]);

	const {data: articalList} = useQuery(["articalList"], () =>
		Page.getList({
			Active: true,
			PageIndex: 1,
			PageSize: 6,
			OrderBy: "Id desc",
		}).then((res) => res?.Data?.Items)
	);

	return (
		<footer className="border border-t border-[#46464652]">
			<div className={styles.footerTop}>
				<div className="container">
					<div className={styles.inner}>
						<div className="col-span-1">
							<div className={styles.logo}>
								<Link href="/">
									<a>
										<img src={`${dataConfig?.LogoIMG}` ?? "/logo.png"} alt="" height={"auto"} />
									</a>
								</Link>
								<div className={styles.socialFoot}>
									{socialListRender.map((item, index) => {
										return (
											<React.Fragment key={index}>
												<Link href={item?.link ?? "/"}>
													<a style={{display: !item?.link && "none"}}>
														{item.icon ? (
															<i className={item.icon}></i>
														) : (
															<div
																style={{
																	backgroundImage: `url(${item.imgSrc})`,
																	width: "100%",
																	height: "100%",
																	backgroundSize: "cover",
																	backgroundPosition: "center",
																}}
															></div>
														)}
													</a>
												</Link>
											</React.Fragment>
										);
									})}
								</div>
								<p>
									Chúng tôi chuyên nhận order và vận chuyển hộ hàng hóa từ Trung Quốc về Việt Nam, với chi phí ưu đãi
									thấp nhất có thể. Hàng về nhanh chóng đúng thời gian cam kết.
								</p>
							</div>
						</div>
						<div className="col-span-1 pl-6">
							<div className={styles.title}>
								<p className="uppercase font-bold text-lg !mb-4"> Liên hệ </p>
							</div>
							<div className={styles.contentFoot}>
								<div className={styles.contactBox}>
									<img src="./location.png" alt="" />
									<span className={styles.colorD} dangerouslySetInnerHTML={{__html: dataConfig?.Address}}></span>
								</div>
								<div className={styles.contactBox}>
									<a href={`mailto:${dataConfig?.EmailContact}`} className={`${styles.contactLink}`}>
										<img src="./envelope.png" alt="" />
										<span className={styles.colorD}>{dataConfig?.EmailContact}</span>
									</a>
								</div>
								<div className={styles.contactBox}>
									<a href={`tel:${dataConfig?.Hotline}`} className={`${styles.contactLink}`}>
										<img src="./phone.png" alt="" />
										<span className={styles.colorD}>{dataConfig?.Hotline}</span>
									</a>
								</div>
							</div>
						</div>
						<div className="col-span-1">
							<div className={styles.title}>
								<p className="uppercase font-bold text-lg !mb-4"> Menu </p>
							</div>
							<div className={styles.contentFoot}>
								{dataMenu?.map((item) => (
									<div key={item.Name} className={styles.menuItem}>
										<a
											className={styles.colorD}
											onClick={() =>
												router.push({
													pathname: "/chuyen-muc",
													query: {code: item?.Code},
												})
											}
										>
											{item?.Name}
										</a>
									</div>
								))}
							</div>
						</div>
						<div className="col-span-1">
							<div className={styles.title}>
								<p className="uppercase font-bold text-lg !mb-4 mb-5">Blog</p>
							</div>
							{articalList?.map((art) => {
								return (
									<div className={styles.menuItem} key={art?.Code}>
										<a
											onClick={() =>
												router.push({
													pathname: "/chuyen-muc/detail",
													query: {code: art?.Code},
												})
											}
											className={styles.colorD}
										>
											{art?.Title}
										</a>
									</div>
								);
							})}
							{/* {dataConfig?.FacebookFanpage && (
								<div className="mt-4">
									<iframe
										src={dataConfig?.FacebookFanpage}
										width="100%"
										height="300"
										allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
									/>
								</div>
							)} */}
						</div>
					</div>
				</div>
			</div>
			<div className={styles.footerBottom}>
				<p className={styles.cRight}>Website được thiết kế bởi MONA MEDIA</p>
			</div>
		</footer>
	);
};

export default Footer;
