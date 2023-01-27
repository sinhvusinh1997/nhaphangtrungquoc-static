import {Space, Tag} from "antd";
import router from "next/router";
import React from "react";
import {ActionButton, DataTable} from "~/components";
import {TColumnsType, TTable} from "~/types/table";
import {_format} from "~/utils";

export const SurplusTable: React.FC<TTable<TStatisticalSurplus>> = ({data, handlePagination, pagination}) => {
	const columns: TColumnsType<TStatisticalSurplus> = [
		{
			dataIndex: "Id",
			title: "ID",
			width: 90,
		},
		{
			dataIndex: "Created",
			key: "Created",
			title: "Ngày tạo",
			render: (date) => _format.getVNDate(date),
			responsive: ["xl"],
			width: 120,
		},
		{
			dataIndex: "UserName",
			key: "UserName",
			title: "Username",
			width: 150,
		},
		{
			dataIndex: "UserGroupName",
			key: "UserGroupName",
			title: "Quyền hạn",
			responsive: ["md"],
			width: 150,
		},
		{
			dataIndex: "Wallet",
			key: "Wallet",
			title: "Số dư (VNĐ)",
			align: "right",
			render: (money) => _format.getVND(money, " "),
			responsive: ["sm"],
			width: 200,
		},
		{
			dataIndex: "Status",
			key: "Status",
			title: "Trạng thái",
			render: (status, record) => {
				let color = "red";
				if (status === 1) {
					color = "green";
				} else if (status === 2) {
					color = "yellow";
				}
				return <Tag color={color}>{record.StatusName}</Tag>;
			},
			responsive: ["md"],
			width: 120,
		},
		{
			dataIndex: "SalerUserName",
			key: "SalerUserName",
			title: "NV kinh doanh",
			responsive: ["lg"],
			render: (record) => <>{record?.SalerUserName ? record?.SalerUserName : "--"}</>,
			width: 120,
		},
		{
			dataIndex: "OrdererUserName",
			key: "OrdererUserName",
			title: "NV đặt hàng",
			responsive: ["lg"],
			render: (record) => <>{record?.OrdererUserName ? record?.OrdererUserName : "--"}</>,
			width: 120,
		},
		{
			dataIndex: "action",
			key: "action",
			title: "Thao tác",
			align: "right",
			render: (_, record) => (
				<Space>
					<ActionButton
						icon="fas fa-edit"
						title="Cập nhật"
						onClick={() =>
							router.push({
								pathname: "/manager/client/client-list/detail",
								query: {id: record?.Id},
							})
						}
					/>
					<ActionButton
						icon="fas fa-badge-dollar"
						title="Nạp tiền"
						onClick={() =>
							router.push({
								pathname: "/manager/money/vietnam-recharge",
								query: {id: record?.Id},
							})
						}
					/>

					<ActionButton
						icon="fas fa-dolly-flatbed"
						title="Lịch sử giao dịch"
						onClick={() =>
							router.push({
								pathname: "/manager/client/transaction-history",
								query: {id: record?.Id},
							})
						}
					/>
				</Space>
			),
			responsive: ["xl"],
			width: 200,
		},
	];

	const expandable = {
		expandedRowRender: (record) => (
			<ul className="px-2 text-xs">
				<li className="sm:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Số dư:</span>
					{record.surplus}
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Quyền hạn:</span>
					{record.role}
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Trạng thái:</span>
					{record.statusId}
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Nv Kinh doanh:</span>
					{record.saler}
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Nv đặt hàng:</span>
					{record.orderedBy}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ngày tạo:</span>
					{_format.getVNDate(record.createdAt)}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Thao tác:</span>
					<Space>
						<ActionButton
							icon="fas fa-edit"
							title="Cập nhật"
							onClick={() =>
								router.push({
									pathname: "/manager/client/client-list/detail",
									query: {id: record?.Id},
								})
							}
						/>
						<ActionButton
							icon="fas fa-badge-dollar"
							title="Nạp tiền"
							onClick={() =>
								router.push({
									pathname: "/manager/money/vietnam-recharge",
									query: {id: record?.Id},
								})
							}
						/>

						<ActionButton
							icon="fas fa-dolly-flatbed"
							title="Lịch sử giao dịch"
							onClick={() =>
								router.push({
									pathname: "/manager/client/transaction-history",
									query: {id: record?.Id},
								})
							}
						/>
					</Space>
				</li>
			</ul>
		),
	};

	return (
		<DataTable
			{...{
				columns,
				data,
				bordered: true,
				pagination,
				onChange: handlePagination,
				expandable: expandable,
				scroll: {y: 700},
			}}
		/>
	);
};
