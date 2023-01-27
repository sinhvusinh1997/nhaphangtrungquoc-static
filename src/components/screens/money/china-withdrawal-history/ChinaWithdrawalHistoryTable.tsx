import {Tag} from "antd";
import React from "react";
import {ActionButton, DataTable} from "~/components";
import {paymentStatusData} from "~/configs";
import {TColumnsType, TTable} from "~/types/table";
import {_format} from "~/utils";

const ChinaWithdrawHistoryTable: React.FC<TTable<TRechargeRMB | TRefund>> = ({
	data,
	handleModal,
	loading,
	pagination,
}) => {
	const columns: TColumnsType<TRechargeRMB | TRefund> = [
		{
			dataIndex: "Id",
			title: "ID",
			align: "center",
		},
		{
			dataIndex: "UserName",
			title: "Username",
			align: "center",
		},
		{
			dataIndex: "Amount",
			title: "Số tiền",
			align: "center",
			responsive: ["sm"],
			render: (record) => _format.getVND(record, ""),
		},
		{
			dataIndex: "Status",
			title: "Trạng thái",
			align: "center",
			render: (status, record) => {
				return (
					<Tag
						color={
							paymentStatusData?.find((x) => x.id === record?.Status)?.color
						}
					>
						{record?.StatusName}
					</Tag>
				);
			},
			responsive: ["md"],
		},
		{
			dataIndex: "Created",
			title: "Ngày tạo",
			align: "center",
			render: (date) => date && _format.getShortVNDate(date),
			responsive: ["lg"],
		},
		{
			dataIndex: "CreatedBy",
			title: "Người tạo",
			align: "center",
			responsive: ["lg"],
		},

		{
			dataIndex: "UpdatedBy",
			title: "Người duyệt",
			align: "center",
			responsive: ["xl"],
		},

		{
			dataIndex: "Updated",
			title: "Ngày duyệt",
			align: "center",
			render: (date) => date && _format.getShortVNDate(date),
			responsive: ["xl"],
		},

		{
			dataIndex: "action",
			title: "Thao tác",
			align: "center",
			render: (_, record) => (
				<ActionButton
					onClick={() => handleModal(record)}
					icon="fad fa-edit"
					title="Cập nhật"
				/>
			),
			responsive: ["xl"],
		},
	];

	const expandable = {
		expandedRowRender: (record) => (
			<ul className="px-2 text-xs">
				<li className="sm:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Số tiền:</span>
					{record.cash}
				</li>
				<li className="md:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Trạng thái:</span>
					{record.statusId}
				</li>
				<li className="lg:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Ngày tạo:</span>
					{_format.getShortVNDate(record.createdAt)}
				</li>
				<li className="lg:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Người tạo:</span>
					{record.createdBy}
				</li>
				<li className="xl:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Người duyệt:</span>
					{record.approvedBy}
				</li>
				<li className="xl:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Ngày duyệt:</span>
					{_format.getShortVNDate(record.approvedDate)}
				</li>

				<li className="xl:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Thao tác:</span>
					<ActionButton
						onClick={() => handleModal(record)}
						icon="fad fa-edit"
						title="Cập nhật"
					/>
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
				expandable: expandable,
				loading,
				pagination,
			}}
		/>
	);
};

export {ChinaWithdrawHistoryTable};
