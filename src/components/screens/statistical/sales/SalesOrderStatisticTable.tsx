import {Tag} from "antd";
import React from "react";
import {DataTable, IconButton} from "~/components";
import {orderStatus} from "~/configs";
import {TColumnsType} from "~/types/table";
import {_format} from "~/utils/index";

export const SalesOrderStatisticTable = ({loading, pagination, handlePagination, data, exportExcel, RoleID}) => {
	const columns: TColumnsType<TStatisticalOrder> = [
		{
			dataIndex: "Id",
			title: "ID",
			fixed: "left",
			width: 80,
		},
		{
			dataIndex: "Created",
			key: "Created",
			title: "Ngày tạo",
			render: (date) => _format.getShortVNDate(date),
			fixed: "left",
		},
		{
			dataIndex: "SalerUserName",
			key: "SalerUserName",
			title: (
				<>
					Nhân viên <br /> bán hàng
				</>
			),
			width: 80,
			render: (_, record) => <>{record.SalerUserName ?? "--"}</>,
		},
		{
			dataIndex: "PriceVND",
			title: (
				<>
					Tổng <br /> tiền hàng
				</>
			),
			align: "right",
			render: (money) => _format.getVND(money, ""),
		},
		{
			dataIndex: "FeeShipCN",
			key: "FeeShipCN",
			title: (
				<>
					Phí ship <br /> Trung Quốc
				</>
			),
			align: "right",
			render: (money) => _format.getVND(money, ""),
		},
		{
			dataIndex: "FeeBuyPro",
			key: "FeeBuyPro",
			title: (
				<>
					Phí <br /> mua hàng
				</>
			),
			align: "right",
			render: (money) => _format.getVND(money, ""),
		},
		{
			dataIndex: "IsFastDeliveryPrice",
			key: "IsFastDeliveryPrice",
			title: (
				<>
					Phí <br /> giao hàng <br /> tận nhà
				</>
			),
			align: "right",
			render: (money) => _format.getVND(money, ""),
		},
		{
			dataIndex: "FeeWeight",
			key: "FeeWeight",
			title: (
				<>
					Phí <br /> cân nặng
				</>
			),
			align: "right",
			render: (money) => _format.getVND(money, ""),
		},
		{
			dataIndex: "IsCheckProductPrice",
			key: "IsCheckProductPrice",
			title: (
				<>
					Phí <br /> kiểm đếm
				</>
			),
			align: "right",
			render: (money) => _format.getVND(money, ""),
		},
		{
			dataIndex: "IsPackedPrice",
			key: "IsPackedPrice",
			title: (
				<>
					Phí <br /> đóng gói
				</>
			),
			align: "right",
			render: (money) => _format.getVND(money, ""),
		},
		{
			dataIndex: "TotalPriceVND",
			key: "TotalPriceVND",
			title: "Tổng tiền",
			align: "right",
			render: (money) => _format.getVND(money, ""),
		},
		{
			dataIndex: "Deposit",
			key: "Deposit",
			title: "Đặt cọc",
			align: "right",
			render: (money) => _format.getVND(money, ""),
		},
		{
			dataIndex: "RemainingAmount",
			key: "RemainingAmount",
			title: "Còn lại",
			align: "right",
			render: (money) => _format.getVND(money, ""),
		},
		{
			dataIndex: "StatusName",
			key: "StatusName",
			title: "Trạng thái",
			width: 180,
			render: (statusName, _record) => {
				const color = orderStatus.find((x) => x.id === _record?.Status);
				return <Tag color={color?.color}>{statusName}</Tag>;
			},
			fixed: "right",
		},
	];

	const expandable = {
		expandedRowRender: (data) => (
			<ul className="px-2 text-xs">
				<li className="sm:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Nhân viên bán hàng:</span>
					{data.saler}
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Phí ship TQ:</span>
					{data.chineseShippingFee}
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Phí mua hàng:</span>
					{data.purchaseFee}
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Phí giao hàng tận nhà:</span>
					{data.homeArrivedFee}
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Phí cân nặng:</span>
					{data.weightFee}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Phí kiểm đếm:</span>
					{data.inventoryFee}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Phí đóng gói:</span>
					{data.packageFee}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Phí hoả tốc:</span>
					{data.expressFee}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Tổng tiền:</span>
					{data.tocalCash}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Đặt cọc:</span>
					{data.deposit}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Trạng thái:</span>
					{data.status}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ngày tạo:</span>
					{_format.getShortVNDate(data.createdAt)}
				</li>
			</ul>
		),
	};

	return (
		<React.Fragment>
			<div className="lg:flex items-end mb-4 justify-between">
				<h2 className="text-base font-bold py-2 uppercase">THỐNG KÊ ĐƠN HÀNG</h2>
				{(RoleID === 1 || RoleID === 3) && (
					<IconButton
						title="Xuất Thống Kê"
						onClick={exportExcel}
						btnClass={"lg:mx-4"}
						icon="fas fa-file-export"
						btnIconClass="!mr-2"
						showLoading
					/>
				)}
			</div>
			<DataTable
				{...{
					columns,
					data,
					bordered: true,
					pagination,
					onChange: (pagination) => handlePagination(pagination),
					// expandable: expandable,
					loading,
					scroll: {x: 1500, y: 700},
				}}
			/>
		</React.Fragment>
	);
};
