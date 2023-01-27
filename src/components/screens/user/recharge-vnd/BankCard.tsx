import {Card} from "antd";
import React, {FC} from "react";

type TProps = {
	Id: number;
	Branch: string;
	BankNumber: string;
	BankName: string;
	IMG: string;
};

export const BankCard = ({item}) => {
	return (
		<React.Fragment key={item?.Id}>
			<Card
				title={""}
				extra={
					<div className="flex justify-between items-center w-full">
						<p className="font-semibold text-[#595857]">{item?.BankName}</p>
						<a href="#">
							<img src={item?.IMG} alt="" className="h-[30px]" />
						</a>
					</div>
				}
			>
				<div className="flex justify-between">
					<p className="font-semibold text-[#595857] tracking-wider">Chủ tài khoản</p>
					<p>{item?.Branch}</p>
				</div>
				<div className="flex justify-between">
					<p className="font-semibold text-[#595857] tracking-wider">Số tài khoản</p>
					<p>{item?.BankNumber}</p>
				</div>
				<div className="flex justify-between">
					<p className="font-semibold text-[#595857] tracking-wider">Chi nhánh</p>
					<p>{item?.Name}</p>
				</div>
			</Card>
		</React.Fragment>
	);
};