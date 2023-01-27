import { Tag } from "antd";
import router from "next/router";
import React from "react";
import { smallPackage } from "~/api";
import { DataTable, IconButton, toast } from "~/components";
import { smallPackageStatusData } from "~/configs";
import { TColumnsType, TTable } from "~/types/table";

export const OrderTransportList: React.FC<TTable<TSmallPackage>> = ({data}) => {
	const onExportExcel = async () => {
		try {
			const res = await smallPackage.exportExcel({
				MainOrderId: data[0].MainOrderId,
			});
			router.push(`${res.Data}`);
		} catch (error) {
			toast.error(error);
		}
	};
	const columns: TColumnsType<TSmallPackage> = [
		{
			dataIndex: "OrderTransactionCode",
			title: "Mã vận đơn",
		},
		{
			dataIndex: "Weight",
			align: "right",
			title: "Cân nặng (KG)",
		},
		{
			dataIndex: "LWH",
			align: "right",
			title: () => (
				<span>
					KÍCH THƯỚC <br /> (D x R x C)
				</span>
			),
			responsive: ["sm"],
		},
		{
			dataIndex: "Volume",
			align: "right",
			title: "Cân quy đổi (KG)",
			responsive: ["md"],
		},
		{
			dataIndex: "PayableWeight",
			align: "right",
			title: "Cân tính tiền (KG)",
			responsive: ["md"],
		},
		{
			dataIndex: "UserNote",
			title: "Ghi chú",
			responsive: ["lg"],
		},
		{
			dataIndex: "Status",
			align: "right",
			title: "Trạng thái",
			render: (status, record) => {
				const orderStatus = smallPackageStatusData.find((x) => x.id === status);
				return <Tag color={orderStatus?.color}>{record?.StatusName}</Tag>;
			},
			responsive: ["lg"],
		},
	];

	const expandable = {
		expandedRowRender: (record) => (
			<ul className="px-2 text-xs">
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Kích thước:</span>
					<div>{record.size}</div>
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Cân quy đổi (KG):</span>
					<div>{record.exchangeKg}</div>
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Cân tính tiền (KG):</span>
					<div>{record.lastKg}</div>
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ghi chú:</span>
					<div>{record.note}</div>
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Trạng thái:</span>
					<Tag color={record.Status === 1 ? "yellow" : "red"}>
						<div>{record.statusName}</div>
					</Tag>
				</li>
			</ul>
		),
	};

	return (
		<div className="tableBox mt-4">
			<div className="flex justify-between my-2">
				<div className="titleTable">Danh sách mã vận đơn</div>
				<IconButton
					onClick={() => onExportExcel()}
					title="Xuất"
					icon="fas fa-file-export"
					showLoading
					toolip="Xuất thống kê"
					green
				/>
			</div>
			<DataTable
				{...{
					columns,
					data,
					bordered: true,
					expandable: expandable,
				}}
			/>
		</div>
	);
};
