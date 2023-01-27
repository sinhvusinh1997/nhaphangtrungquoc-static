import {Pagination, Space, Tag} from "antd";
import React from "react";
import {ActionButton, DataTable} from "~/components";
import {smallPackageStatusConfirm, smallPackageStatusData} from "~/configs/appConfigs";
import {TColumnsType, TTable} from "~/types/table";
import {_format} from "~/utils";
type TProps = {
	filter;
	handleFilter: (newFilter) => void;
	refetch: () => void;
	handleAssign;
};
export const FloatingPackageTable: React.FC<TTable<TSmallPackage> & TProps> = ({
	data,
	loading,
	filter,
	handleFilter,
	refetch,
	handleAssign,
}) => {
	const columns: TColumnsType<TSmallPackage> = [
		{
			dataIndex: "Id",
			title: "ID",
		},
		{
			dataIndex: "Created",
			title: "Ngày tạo",
			render: (date) => date && _format.getVNDate(date),
			responsive: ["xl"],
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
		// {
		// 	dataIndex: "MainOrderCode",
		// 	title: "Mã đơn hàng",
		// 	responsive: ["md"],
		// },
		{
			dataIndex: "ProductType",
			title: "Loại hàng",
			responsive: ["md"],
		},
		{
			dataIndex: "FeeShip",
			title: "Phí ship tệ",
			align: "right",
			responsive: ["md"],
		},
		{
			dataIndex: "Weight",
			title: "Cân kg",
			align: "right",
			responsive: ["lg"],
		},
		{
			dataIndex: "Volume",
			title: "Khối m3",
			align: "right",
			responsive: ["lg"],
		},
		{
			dataIndex: "Status",
			title: "Trạng thái kiện",
			render: (status, record) => (
				<Tag color={smallPackageStatusData.find((x) => x.id === record.Status)?.color}>{record.StatusName}</Tag>
			),
			responsive: ["lg"],
		},
		{
			dataIndex: "FloatingUserName",
			title: "Người nhận hàng",
			responsive: ["xl"],
		},
		{
			dataIndex: "FloatingStatus",
			title: "Trạng thái",
			render: (status, record) => (
				<Tag color={smallPackageStatusConfirm.find((x) => x.id === record?.FloatingStatus)?.color}>
					{record.FloatingStatusName == "" ? "Chưa xác nhận" : record.FloatingStatusName}
				</Tag>
			),
			responsive: ["xl"],
		},
		{
			dataIndex: "action",
			align: "right",
			title: "Thao tác",
			render: (_, record) => (
				<Space>
					{/* <ActionButton
						onClick={() => handleModalUpdate(record)}
						onClick={() => alert("update")}
						icon="fas fa-edit"
						title="Cập nhật"
					/> */}
					<ActionButton
						icon="fas fa-plus"
						onClick={() => handleAssign(record, "assign1")}
						title="Gán đơn cho khách mua hộ"
					/>
					<ActionButton
						icon="fas fa-plus"
						onClick={() => handleAssign(record, "assign2")}
						title="Gán đơn cho khách ký gửi"
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
					<span className="font-medium mr-4">Bao hàng:</span>
					<div>{record?.Code}</div>
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Mã đơn hàng:</span>
					<div>{record?.MainOrderCode}</div>
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Loại hàng:</span>
					<div>{record?.ProductType}</div>
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Phí ship (TỆ):</span>
					<div>{record?.FeeShip}</div>
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Cân (KG):</span>
					<div>{record?.Weight}</div>
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Khối (M3):</span>
					<div>{record?.Volume}</div>
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Trạng thái kiện:</span>
					<Tag color={smallPackageStatusData.find((x) => x.id === record?.Status)?.color}>{record?.StatusName}</Tag>
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Người nhận hàng:</span>
					{record?.Volume}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Trạng thái xác nhận:</span>
					<Tag color={smallPackageStatusConfirm.find((x) => x.id === record?.FloatingStatus)?.color}>
						{record.FloatingStatusName == "" ? "Chưa xác nhận" : record.FloatingStatusName}
					</Tag>
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ngày tạo:</span>
					<div>{_format.getVNDate(record?.Created)}</div>
				</li>

				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Thao tác:</span>
					<div>
						<Space>
							<ActionButton
								// onClick={() => handleModalUpdate(record)}
								icon="fas fa-edit"
								title="Cập nhật"
							/>
							<ActionButton
								// onClick={() => handleModal(record)}
								icon="fas fa-box-check"
								title="Xác nhận"
								btnYellow
							/>
						</Space>
					</div>
				</li>
			</ul>
		),
	};

	return (
		<>
			<div>
				<DataTable
					{...{
						columns,
						data,
						loading,
						bordered: true,
						expandable: expandable,
					}}
				/>
			</div>
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
