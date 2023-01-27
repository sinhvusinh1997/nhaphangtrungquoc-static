import {Tag} from "antd";
import React from "react";
import {ActionButton, DataTable} from "~/components";
import {ERechargeStatusData, moneyStatus, withdrawStatusData} from "~/configs/appConfigs";
import {TColumnsType, TTable} from "~/types/table";
import {_format} from "~/utils";

export const WithDrawalVNDTable: React.FC<TTable<TWithDraw>> = ({
	data,
	loading,
	pagination,
	handlePagination,
	handleModal,
}) => {
	const columns: TColumnsType<TWithDraw> = [
		{
			dataIndex: "Id",
			title: "ID đơn",
		},
		{
			dataIndex: "Created",
			title: "Ngày rút",
			render: (date) => <>{_format.getVNDate(date)}</>,
		},
		{
			dataIndex: "Amount",
			title: "Số tiền rút (VNĐ)",
			align: "right",
			render: (record) => _format.getVND(record, " "),
		},
		{
			dataIndex: "Note",
			title: "Nội dung",
			responsive: ["md"],
		},
		{
			dataIndex: "Status",
			title: "Trạng thái",
			render: (status, _) => {
				const color = moneyStatus.find((x) => x.id === status);
				return <Tag color={color?.color}>{_?.StatusName}</Tag>;
			},
			responsive: ["md"],
		},
		{
			title: "Thao tác",
			dataIndex: "action",
			align: "right",
			render: (_, record) => (
				<ActionButton
					onClick={() => handleModal(record)}
					icon="far fa-trash-alt"
					title="Xóa"
					btnRed
					disabled={!(record?.Status === ERechargeStatusData.Pending)}
				/>
			),
			responsive: ["lg"],
		},
	];

	const expandable = {
		expandedRowRender: (record) => (
			<ul className="px-2 text-xs">
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Nội dung:</span>
					<div>{record.Note}</div>
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Trạng thái:</span>
					<Tag color={withdrawStatusData?.[record.Status - 1]?.color}>
						{withdrawStatusData?.[record.Status - 1]?.name}
					</Tag>
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Thao tác:</span>
					{_format.getVND(record.Amount)}
				</li>
			</ul>
		),
	};

	return (
		<div className="tableBox">
			<p className="titleTable !py-0">Lịch sử rút tiền</p>
			<div className="mt-4">
				<DataTable
					{...{
						loading,
						columns,
						data,
						style: "secondary",
						pagination,
						onChange: handlePagination,
						expandable: expandable,
					}}
				/>
			</div>
		</div>
	);
};
