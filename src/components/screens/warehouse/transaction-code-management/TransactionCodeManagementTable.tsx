import {Pagination, Tag} from "antd";
import React from "react";
import {DataTable} from "~/components";
import {packageStatus, smallPackageStatusData} from "~/configs/appConfigs";
import {TColumnsType, TTable} from "~/types/table";
import {_format} from "~/utils";
type TProps = {
	filter;
	handleFilter: (newFilter) => void;
};
export const TransactionCodeManagementTable: React.FC<TTable<TSmallPackage> & TProps> = ({
	data,
	loading,
	filter,
	handleFilter,
}) => {
	const columns: TColumnsType<TSmallPackage> = [
		{
			dataIndex: "Id",
			title: "ID",
			fixed: "left",
		},
		{
			dataIndex: "Created",
			title: "Ngày tạo",
			render: (date) => {
				return (
					<>
						<div>{_format.getShortVNDate(date)}</div>
						<div>{_format.getTime(date)}</div>
					</>
				);
			},
			responsive: ["xl"],
			fixed: "left",
		},
		{
			dataIndex: "UserName",
			title: "Username",
			responsive: ["sm"],
			fixed: "left",
		},
		{
			dataIndex: "Code",
			title: "Bao hàng",
			responsive: ["sm"],
		},
		{
			dataIndex: "OrderTransactionCode",
			title: "Mã vận đơn",
		},
		{
			dataIndex: "MainOrderCode",
			title: "Mã đơn hàng",
			responsive: ["md"],
		},
		{
			dataIndex: "ProductType",
			title: "Loại hàng",
			responsive: ["lg"],
		},
		{
			dataIndex: "Weight",
			title: "Cân nặng (KG)",
			align: "right",
			responsive: ["lg"],
		},
		{
			dataIndex: "Width",
			title: "D x R x C",
			align: "right",
			responsive: ["lg"],
			render: (_, record) => <>{`${record.Length} x ${record.Width} x ${record.Height}`}</>,
		},
		{
			dataIndex: "Volume",
			title: "Cân quy đổi (KG)",
			align: "right",
			responsive: ["xl"],
		},
		{
			dataIndex: "Description",
			title: "Ghi chú",
			responsive: ["xl"],
		},
		{
			dataIndex: "Status",
			title: "Trạng thái",
			fixed: "right",
			render: (status, record) => {
				const color = packageStatus.find((x) => x.id === status);
				return <Tag color={color?.color}>{record?.StatusName}</Tag>;
			},
			responsive: ["xl"],
			width: 160,
		},
	];

	const expandable = {
		expandedRowRender: (record) => (
			<ul className="px-2 text-xs">
				<li className="sm:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Username:</span>
					{record.UserName}
				</li>
				<li className="sm:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Bao hàng:</span>
					{record.Code}
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Mã đơn hàng:</span>
					{record.MainOrderCode}
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Loại hàng:</span>
					{record.ProductType}
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Cân nặng (KG):</span>
					{record.Weight}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Cân nặng QĐ (KG):</span>
					{record.Volume}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ghi chú:</span>
					{record.Description}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Trạng thái:</span>
					<Tag color={smallPackageStatusData.find((x) => x.id === record.Status)?.color}>{record.StatusName}</Tag>
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ngày tạo:</span>
					{_format.getVNDate(record.Created)}
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
