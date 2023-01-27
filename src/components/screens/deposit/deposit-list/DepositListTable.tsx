import {Pagination, Tag} from "antd";
import router from "next/router";
import React from "react";
import {useMutation} from "react-query";
import {transportationOrder} from "~/api";
import {ActionButton, DataTable, toast} from "~/components";
import {orderStatusData, transportStatus} from "~/configs/appConfigs";
import {TColumnsType, TTable} from "~/types/table";
import {_format} from "~/utils";

type TProps = {
	refetch: () => void;
	RoleID: number;
	dathangList?: any;
	saleList?: any;
	filter;
	handleFilter: (newFilter) => void;
};

export const DepositListTable: React.FC<TTable<TUserDeposit> & TProps> = ({
	data,
	loading,
	refetch,
	RoleID,
	filter,
	handleFilter,
}) => {
	const mutationUpdate = useMutation(transportationOrder.update, {
		onSuccess: () => {
			toast.success("Cập nhật ký gửi thành công");
			refetch();
		},
		onError: toast.error,
	});

	const _onPress = (data: TUserDeposit) => {
		mutationUpdate.mutateAsync(data);
	};

	const columns: TColumnsType<TUserDeposit> = [
		{
			dataIndex: "Id",
			title: "ID Đơn",
			width: 80,
		},
		{
			dataIndex: "UserName",
			title: (
				<>
					User <br /> đặt hàng
				</>
			),
			width: 100,
		},
		{
			dataIndex: "Created",
			title: "Ngày tạo",
			width: 200,
			render: (date) => date && _format.getVNDate(date),
			responsive: ["xl"],
		},
		{
			dataIndex: "OrderTransactionCode",
			title: (
				<>
					Mã <br /> vận đơn
				</>
			),
			responsive: ["sm"],
			width: 240,
		},
		{
			dataIndex: "WareHouseFrom",
			title: (
				<>
					Kho <br /> Trung Quốc
				</>
			),
			responsive: ["lg"],
		},
		{
			dataIndex: "WareHouseTo",
			title: (
				<>
					Kho <br /> Việt Nam
				</>
			),
			responsive: ["lg"],
		},
		{
			dataIndex: "ShippingTypeName",
			title: (
				<>
					Phương thức <br /> vận chuyển
				</>
			),
			responsive: ["lg"],
		},
		{
			dataIndex: "TotalPriceVND",
			title: (
				<>
					Tổng tiền <br /> (VNĐ)
				</>
			),
			align: "right",
			render: (fee) => _format.getVND(fee, " "),
		},
		{
			dataIndex: "PayableWeight",
			align: "right",
			title: (
				<>
					Cân nặng <br /> (KG)
				</>
			),
			responsive: ["lg"],
			render: (weight) => _format.getVND(weight, " "),
		},
		{
			dataIndex: "Status",
			title: "Trạng thái",
			render: (status, record) => {
				const color = transportStatus.find((x) => x.id === status);
				return <Tag color={color?.color}>{record?.StatusName}</Tag>;
			},
			responsive: ["xl"],
			width: 120,
		},
		{
			dataIndex: "action",
			title: "Thao tác",
			align: "right",
			render: (_, record) => {
				return (
					<>
						{record?.Status === 2 && (RoleID === 1 || RoleID === 3) && (
							<ActionButton
								onClick={() => _onPress({...record, Status: 3})}
								icon="fas fa-check"
								title="Duyệt đơn này!"
							/>
						)}
						<ActionButton
							onClick={() => {
								router.push({
									pathname: "/manager/deposit/deposit-list/detail",
									query: {id: record.Id},
								});
							}}
							icon="fas fa-edit"
							title={"Cập nhật"}
						/>
					</>
				);
			},
			responsive: ["xl"],
		},
	];

	const expandable = {
		expandedRowRender: (record) => (
			<ul className="px-2 text-xs">
				<li className="sm:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Mã vận đơn:</span>
					{record.OrderTransactionCode}
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Cân nặng:</span>
					{_format.getVND(record.Weight, "KG")}
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Kho TQ:</span>
					{record.WareHouseFrom}
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Kho VN:</span>
					{record.WareHouseTo}
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">PTVC:</span>
					{record.ShippingTypeName}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Cước vật tư:</span>
					{_format.getVND(record.SensorFeeVND)}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">PP mặt hàng ĐB:</span>
					{_format.getVND(record.AdditionFeeVND)}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ngày tạo:</span>
					{_format.getVNDate(record.Created)}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ngày về đến kho đích:</span>
					{_format.getVNDate(record.DateInVNWareHouse)}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ngày yêu cầu xuất kho:</span>
					{_format.getVNDate(record.DateExportRequest)}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ngày xuất kho:</span>
					{_format.getVNDate(record.DateExport)}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Trạng thái:</span>
					{
						<Tag color={orderStatusData.find((x) => x.id === record.Status)?.color}>
							{orderStatusData.find((x) => x.id === record.Status)?.name}
						</Tag>
					}
				</li>

				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Thao tác:</span>

					<ActionButton
						onClick={() => {
							router.push({
								pathname: "/manager/deposit/deposit-list/detail",
								query: {id: record.Id},
							});
						}}
						icon="fas fa-edit"
						title={"Cập nhật"}
					/>
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
					loading,
					bordered: true,
					expandable: expandable,
					scroll: {y: 600},
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
