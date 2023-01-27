import {Modal, Pagination, Space, Tag} from "antd";
import Link from "next/link";
import router from "next/router";
import React from "react";
import {ActionButton, DataTable, toast} from "~/components";
import {TColumnsType, TTable} from "~/types/table";
import {_format} from "~/utils";

type TProps = {
	filter: {
		TotalItems: number;
		PageIndex: number;
		PageSize: number;
	};
	handleFilter: (newFilter) => void;
	handlePayment: (id: number) => void;
	RoleID: number;
};

export const BonusManagementTable: React.FC<TTable<TBonus> & TProps> = ({
	data,
	filter,
	handleFilter,
	loading,
	handlePayment,
	RoleID,
}) => {
	const columns: TColumnsType<TBonus> = [
		{
			dataIndex: "MainOrderId",
			title: "ID Đơn",
			width: 80,
		},
		{
			dataIndex: "PercentReceive",
			title: "Phần trăm (%)",
			align: "right",
			width: 100,
			responsive: ["sm"],
		},
		{
			dataIndex: "TotalPriceReceive",
			title: "Hoa hồng (VNĐ)",
			align: "right",
			render: (_, record) => {
				return <div>{_format.getVND(record?.TotalPriceReceive, "")}</div>;
			},
		},
		{
			dataIndex: "UserName",
			title: "Username",
			responsive: ["sm"],
		},
		{
			dataIndex: "RoleName",
			title: "Quyền hạn",
			responsive: ["md"],
		},
		{
			dataIndex: "Status",
			title: "Trạng thái",
			render: (status, record) => <Tag color={status !== 1 ? "blue" : "red"}>{record.StatusName}</Tag>,
			responsive: ["md"],
		},
		{
			dataIndex: "Created",
			title: "Ngày tạo",
			render: (_, record) => {
				return (
					<>
						<div>{_format.getVNDate(record.Created)}</div>
						<div>{record.CreatedBy}</div>
					</>
				);
			},
		},
		{
			dataIndex: "Updated",
			title: "Ngày cập nhật",
			render: (_, record) => {
				return (
					<>
						<div className="">{_format.getVNDate(record.Updated)}</div>
						<div className="">{record.UpdatedBy}</div>
					</>
				);
			},
		},
		{
			dataIndex: "action",
			key: "action",
			title: "Thao tác",
			align: "right",
			render: (_, record) => {
				return (
					<Space>
						{record.Status === 1 && (RoleID === 1 || RoleID === 3) && (
							<ActionButton
								onClick={() =>
									Modal.confirm({
										title: "Thanh toán hoa hồng đơn hàng này?",
										content: (
											<div className="mt-4 pb-4 border-b border-[#d5d4d4]">
												<div className="py-1 pl-5 flex justify-between">
													Username: <span className="font-bold">{record?.UserName}</span>
												</div>
												<div className="py-1 pl-5 flex justify-between">
													Hoa hồng:{" "}
													<span className="font-bold">{_format.getVND(record?.TotalPriceReceive, " VNĐ")}</span>
												</div>
											</div>
										),
										okText: "Thanh toán",
										cancelText: "Hủy",

										onOk: () => {
											if (!record?.TotalPriceReceive) {
												toast.warning("Chưa có tiền hoa hồng để thanh toán!");
												return;
											}
											return handlePayment(record.Id);
										},
									})
								}
								icon="far fa-credit-card"
								title="Thanh toán"
								iconContainerClassName="iconBlue"
								btnBlue
							/>
						)}
						<ActionButton
							onClick={() =>
								router.push({
									pathname: "/manager/order/order-list/detail",
									query: {id: record.MainOrderId},
								})
							}
							icon="fas fa-info"
							title="Xem chi tiết đơn"
							iconContainerClassName=" iconYellow"
							btnYellow
						/>
					</Space>
				);
			},
			responsive: ["xl"],
		},
	];

	const expandable = {
		expandedRowRender: (record) => (
			<ul className="px-2 text-xs">
				<li className="sm:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Phần trăm:</span>
					{record.PercentReceive}
				</li>
				<li className="sm:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Username:</span>
					{record.UserName}
				</li>
				<li className="md:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Quyền hạn:</span>
					{record.RoleName}
				</li>
				<li className="md:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Trạng thái:</span>
					<Tag color={record.Status === 1 ? "green" : "red"}>{record.StatusName}</Tag>
				</li>
				<li className="lg:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Ngày giờ:</span>
					{_format.getVNDate(record.Created)}
				</li>
				<li className="xl:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Thao tác:</span>
					<Space>
						<ActionButton
							onClick={() =>
								router.push({
									pathname: "/manager/order/order-list/detail",
									query: {id: record.Id},
								})
							}
							icon="far fa-info-square"
							title="Xem chi tiết đơn"
						/>
						{record.Status === 2 && (
							<ActionButton
								onClick={() =>
									Modal.confirm({
										title: "Thanh toán hoa hồng đơn hàng này?",
										content: (
											<div className="mt-4 pb-4 border-b border-[#d5d4d4]">
												<div className="py-1 pl-5 flex justify-between">
													Username: <span className="font-bold">{record?.UserName}</span>
												</div>
												<div className="py-1 pl-5 flex justify-between">
													Hoa hồng:{" "}
													<span className="font-bold">{_format.getVND(record?.TotalPriceReceive, " VNĐ")}</span>
												</div>
											</div>
										),
										okText: "Thanh toán",
										cancelText: "Hủy",

										onOk: () => {
											if (!record?.TotalPriceReceive) {
												toast.warning("Chưa có tiền hoa hồng để thanh toán!");
												return;
											}
											return handlePayment(record.Id);
										},
									})
								}
								icon="far fa-credit-card"
								title="Thanh toán"
							/>
						)}
					</Space>
				</li>
			</ul>
		),
	};

	return (
		<>
			<DataTable
				{...{
					loading,
					columns,
					data,
					bordered: true,
					expandable: expandable,
					scroll: {y: 700},
				}}
			/>
			<div className="mt-4 text-right">
				<Pagination
					total={filter?.TotalItems}
					current={filter?.PageIndex}
					pageSize={filter?.PageSize}
					onChange={(page, pageSize) => handleFilter({...filter, PageIndex: page, PageSize: pageSize})}
				/>
			</div>
		</>
	);
};
