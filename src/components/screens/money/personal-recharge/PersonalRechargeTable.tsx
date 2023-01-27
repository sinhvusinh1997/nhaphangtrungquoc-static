import {Pagination, Space, Tag} from "antd";
import router from "next/router";
import React from "react";
import {ActionButton, DataTable} from "~/components";
import {activeData} from "~/configs";
import {TColumnsType, TTable} from "~/types/table";
import {_format} from "~/utils";
type TProps = {
	filter;
	handleFilter: (newFilter) => void;
};

export const PersonalRechargeTable: React.FC<TTable<TClient> & TProps> = ({data, loading, handleFilter, filter}) => {
	const columns: TColumnsType<TClient> = [
		{
			dataIndex: "Id",
			title: "ID",
			width: 60,
		},
		{
			dataIndex: "Created",
			title: "Ngày nạp",
			render: (_, record) => <>{_format.getVNDate(record.Created)}</>,
			responsive: ["lg"],
		},
		{
			dataIndex: "UserName",
			title: "Username",
		},
		{
			dataIndex: "FullName",
			title: "Họ và tên",
			responsive: ["sm"],
		},
		{
			dataIndex: "Phone",
			title: "Điện thoại",
			align: "right",
			responsive: ["md"],
		},
		{
			dataIndex: "Wallet",
			title: "Số dư",
			align: "right",
			responsive: ["lg"],
			render: (record) => _format.getVND(record, ""),
		},
		{
			dataIndex: "Status",
			title: "Trạng thái",
			render: (status: number) => <Tag color={activeData[status]?.color}>{activeData[status]?.name}</Tag>,
			responsive: ["xl"],
		},
		{
			dataIndex: "action",
			title: "Thao tác",
			align: "right",
			render: (_, record) => (
				<Space>
					<ActionButton
						onClick={() =>
							router.push({
								pathname: "/manager/money/vietnam-recharge",
								query: {id: record?.Id},
							})
						}
						icon="fas fa-badge-dollar"
						title="Nạp tiền"
						iconContainerClassName="iconYellow"
						btnYellow
					/>
					<ActionButton
						onClick={() =>
							router.push({
								pathname: "/manager/money/vietnam-withdrawal",
								query: {id: record?.Id},
							})
						}
						icon="fas fa-wallet"
						title="Rút tiền"
						iconContainerClassName="iconBlue"
						btnBlue
					/>
				</Space>
			),
			responsive: ["xl"],
		},
	];

	const expandable = {
		expandedRowRender: (record) => (
			<ul className="px-2 text-xs">
				<li className="sm:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Họ và tên:</span>
					{record.fullName}
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Điện thoại:</span>
					{record.phone}
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Số dư:</span>
					{record.surplus}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Trạng thái:</span>
					<Tag color={record.Status === 1 ? "green" : "red"}>Đã kích hoạt</Tag>
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ngày tạo:</span>
					{_format.getVNDate(record.Created)}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Thao tác:</span>
					<Space>
						<ActionButton
							onClick={() =>
								router.push({
									pathname: "/manager/money/vietnam-recharge",
									query: {id: record?.Id},
								})
							}
							icon="fas fa-badge-dollar"
							title="Nạp tiền"
							iconContainerClassName="iconYellow"
							btnYellow
						/>
						<ActionButton
							onClick={() =>
								router.push({
									pathname: "/manager/money/vietnam-withdrawal",
									query: {id: record?.Id},
								})
							}
							icon="fas fa-wallet"
							title="Rút tiền"
							iconContainerClassName="iconBlue"
							btnBlue
						/>
					</Space>
				</li>
			</ul>
		),
	};

	return (
		<>
			<DataTable
				{...{
					columns,
					data,
					bordered: true,
					expandable: expandable,
					loading: loading,
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
