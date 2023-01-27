import {Collapse} from "antd";
import clsx from "clsx";
import React from "react";
import {_format} from "~/utils";

type TProps = {
	moneyOfOrders: any;
	numberOfOrder: any;
};

export const UserAnotherOrderInfo: React.FC<TProps> = ({numberOfOrder, moneyOfOrders}) => {
	return (
		<div className="grid grid-cols-2 gap-4">
			<Collapse expandIconPosition="right" className="col-span-1">
				<Collapse.Panel
					key={1}
					header={<span className="select-none text-sm font-semibold text-white">Thông tin đơn hàng</span>}
				>
					{numberOfOrder?.map((item, index) => (
						<div className="flex border-[#be612b1a] " key={`${item.name}-${index}`}>
							<div
								className={clsx(
									"text-sm px-4 py-2 border-r border-[#be612b1a] w-[70%]",
									index !== 0 && "border-t",
									item?.bold === true && "font-medium text-[#000]"
								)}
							>
								{item.name}
							</div>
							<div
								className={clsx(
									"text-sm px-4 py-2 border-[#be612b1a] w-[30%] font-medium text-warning text-right",
									index !== 0 && "border-t",
									item?.bold && "text-[#b81c1c]"
								)}
							>
								{item.value}
							</div>
						</div>
					))}
				</Collapse.Panel>
			</Collapse>

			<Collapse expandIconPosition="right" className="col-span-1">
				<Collapse.Panel
					key={2}
					header={<span className="select-none text-sm font-semibold text-white">Thông tin tiền hàng</span>}
				>
					{moneyOfOrders?.map((item, index) => (
						<div className="flex border-[#be612b1a] " key={`${item.label}-${index}`}>
							<div
								className={clsx(
									"text-sm px-4 py-2 border-r border-[#be612b1a] w-[70%]",
									index !== 0 && "border-t",
									item?.bold === true && "font-medium text-[#000]"
								)}
							>
								{item.label}
							</div>
							<div
								className={clsx(
									"text-sm px-4 py-2 border-[#be612b1a] w-[30%] font-medium text-warning text-right",
									index !== 0 && "border-t",
									item?.bold && "text-[#b81c1c]"
								)}
							>
								{_format.getVND(item.value)}
							</div>
						</div>
					))}
				</Collapse.Panel>
			</Collapse>
		</div>
	);
};
