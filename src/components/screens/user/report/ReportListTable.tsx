import {Tag} from "antd";
import React from "react";
import {DataTable} from "~/components";
import {complainStatus} from "~/configs/appConfigs";
import {TColumnsType, TTable} from "~/types/table";
import {_format} from "~/utils";

export const ReportListTable: React.FC<TTable<TReport>> = ({data, loading, pagination, handlePagination}) => {
	const columns: TColumnsType<TReport> = [
		{
			dataIndex: "MainOrderId",
			title: "Mã đơn hàng",
			width: 120,
		},
		{
			dataIndex: "ComplainText",
			title: "Nội dung",
			responsive: ["sm"],
		},
		{
			dataIndex: "Amount",
			align: "right",
			title: "Tiền bồi thường (VNĐ)",
			render: (money) => _format.getVND(money, ""),
		},
		{
			dataIndex: "Created",
			align: "right",
			title: "Ngày tạo",
			render: (date) => <div>{_format.getVNDate(date)}</div>,
			responsive: ["xl"],
		},
		{
			dataIndex: "Status",
			title: "Trạng thái",
			render: (status, record) => <Tag color={complainStatus[status - 1]?.color}>{record?.StatusName}</Tag>,
			responsive: ["lg"],
			width: 200,
		},
	];

	const expandable = {
		expandedRowRender: (record) => (
			<ul className="px-2 text-xs">
				<li className="sm:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Nội dung:</span>
					<div>{record.ComplainText}</div>
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Trạng thái:</span>
					<div>
						<Tag color={complainStatus[record.Status - 1]?.color}>{record?.StatusName}</Tag>
					</div>
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ngày tạo:</span>
					<div>{_format.getVNDate(record.Created)}</div>
				</li>
			</ul>
		),
	};

	return (
		<DataTable
			{...{
				columns,
				data,
				loading,
				bordered: false,
				pagination,
				onChange: handlePagination,
				expandable: expandable,
				scroll: {y: 600},
			}}
		/>
	);
};
