import {Button, Drawer, Dropdown, Grid, Menu} from "antd";
import "antd/dist/antd.css";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import styles from "./index.module.css";

const activeMenuStyle =
	'font-bold after:content-[""] after:absolute after:top-[100%] after:left-[0px] after:w-[100%] after:h-[3px] after:bg-[#fff]';

const {useBreakpoint} = Grid;

const handleSetMenu = (dataMenu) => {
	if (!dataMenu) return;
	const newDataMenu = dataMenu.map((menu) => {
		if (menu?.Children < 0) return menu;
		const newChildren = [];

		for (let i in menu?.Children) {
			if (menu.Children[i].Active) {
				newChildren.push(menu.Children[i]);
			}
		}

		return {
			...menu,
			Children: newChildren,
		};
	});

	return newDataMenu;
};

const Navbar = ({dataConfig, dataMenu}) => {
	const {sm, md, lg} = useBreakpoint();
	const router = useRouter();
	const [activeMenu, setActiveMenu] = useState(`${router?.query?.code}`.split("/")[0]);
	const [visible, setVisible] = useState(false);
	const [newMenu, setNewMenu] = useState(handleSetMenu(dataMenu));

	useEffect(() => {
		if (!dataMenu) return;
		setNewMenu(handleSetMenu(dataMenu));
	}, [dataMenu]);

	useEffect(() => {
		setActiveMenu(`${router?.query?.code}`.split("/")[0]);
	}, [router?.query?.code]);

	return (
		<React.Fragment>
			<div className={styles.mobileHidden}>
				<ul className={styles.MenuList}>
					<li
						key={"trang-chu"}
						className={`${activeMenu === "" && activeMenuStyle}`}
						onClick={() => {
							setActiveMenu("");
							router.push("/");
						}}
					>
						<a>Trang chủ</a>
					</li>
					{newMenu?.map((item) => {
						return item?.Children.length <= 0 ? (
							<React.Fragment key={item?.Id}>
								<li
									key={item?.Name}
									className={`${activeMenu === item?.Code && activeMenuStyle}`}
									onClick={() => {
										setActiveMenu(item?.Name);
									}}
								>
									<a
										onClick={() =>
											router.push({
												pathname: "/chuyen-muc",
												query: {code: item?.Link},
											})
										}
									>
										{item?.Name}
									</a>
								</li>
							</React.Fragment>
						) : (
							<Dropdown
								overlay={
									<Menu>
										{item?.Children.map((child) => (
											<Menu.Item key={child?.Id}>
												<a
													onClick={() =>
														router.push({
															pathname: "/chuyen-muc/detail",
															query: {code: child?.Link},
														})
													}
												>
													{child?.Name}
												</a>
											</Menu.Item>
										))}
									</Menu>
								}
								key={item?.Id}
							>
								<li
									key={item?.Name}
									className={`${activeMenu === item?.Code && activeMenuStyle}`}
									onClick={() => {
										setActiveMenu(item?.Name);
										// router.push(`/chuyen-muc/${item?.Code}`);
									}}
								>
									<a
										onClick={() =>
											router.push({
												pathname: "/chuyen-muc",
												query: {code: item?.Code},
											})
										}
									>
										{item?.Name}
									</a>
								</li>
							</Dropdown>
						);
					})}
				</ul>
			</div>
			<div className={styles.mobileVisible}>
				<Button className={styles.bgColor} onClick={() => setVisible(true)}>
					<i className="fas fa-bars"></i>
				</Button>
				<Drawer
					title={`${dataConfig?.CompanyLongName}`}
					placement="left"
					width={300}
					onClose={() => setVisible(false)}
					visible={visible}
					closable={false}
					style={{zIndex: "10000000"}}
				>
					<Menu className={styles.MenuList} mode={lg ? "horizontal" : "inline"}>
						<li
							key={"Trang chủ"}
							className={`${activeMenu === "Trang chủ" && activeMenuStyle}`}
							onClick={() => {
								setActiveMenu("Trang chủ");
								router.push("/");
							}}
						>
							<a>Trang chủ</a>
						</li>
						{newMenu?.map((item) => (
							<li
								key={item?.Name}
								className={`${activeMenu === item?.Name && activeMenuStyle}`}
								onClick={() => {
									setActiveMenu(item?.Name);
									router.push({
										pathname: "/chuyen-muc",
										query: {code: item?.Code},
									});
								}}
							>
								<a>{item?.Name}</a>
							</li>
						))}
					</Menu>
				</Drawer>
			</div>
		</React.Fragment>
	);
};

export default Navbar;
