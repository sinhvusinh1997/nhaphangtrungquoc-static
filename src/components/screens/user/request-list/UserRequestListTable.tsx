import {Modal, Pagination, Space, Tag} from "antd";
import router from "next/router";
import React from "react";
import {payHelp} from "~/api";
import {ActionButton, DataTable, showToast} from "~/components";
import {EPaymentData, paymentData, paymentStatus} from "~/configs/appConfigs";
import {TColumnsType, TTable} from "~/types/table";
import {_format} from "~/utils";

type TProps = {
	filter;
	handleFilter: (newFilter) => void;
	refetch: () => void;
};

export const UserRequestListTable: React.FC<TTable<TRequestPaymentOrder> & TProps> = ({
	data,
	filter,
	handleFilter,
	loading,
	refetch,
}) => {
	const handleAction = async (targetData: TRequestPaymentOrder, type: number) => {
		try {
			await payHelp.updatePayHelp({id: targetData?.Id, status: type});
			showToast({
				title: "Thành công",
				message: type === 2 ? "Thanh toán thành công!" : "Hủy thành công!",
				type: "success",
			});
			refetch();
		} catch (error) {
			showToast({
				title: "",
				message: (error as any)?.response?.data?.ResultMessage,
				type: "error",
			});
		}
	};

	const columns: TColumnsType<TRequestPaymentOrder> = [
		{
			dataIndex: "Id",
			title: "ID đơn hàng",
		},
		{
			dataIndex: "Created",
			title: "Ngày gửi",
			render: (date) => _format.getVNDate(date),
		},
		{
			dataIndex: "TotalPrice",
			title: "Tổng tiền (¥)",
			align: "right",
			render: (money) => _format.getVND(money, " "),
		},
		{
			dataIndex: "TotalPriceVND",
			title: "Tổng tiền (VNĐ)",
			align: "right",
			responsive: ["sm"],
			render: (money) => _format.getVND(money, " "),
		},
		{
			dataIndex: "Currency",
			title: "Tỷ giá (VNĐ)",
			align: "right",
			responsive: ["sm"],
			render: (excharge) => _format.getVND(excharge, " "),
		},
		{
			dataIndex: "Status",
			title: "Trạng thái",
			render: (status, record) => {
				const color = paymentStatus.find((x) => x.id === status);
				return <Tag color={color?.color}>{record?.StatusName}</Tag>;
			},
			responsive: ["md"],
		},
		{
			dataIndex: "action",
			title: "Thao tác",
			align: "right",
			render: (_, record) => {
				return (
					<Space>
						<ActionButton
							onClick={() =>
								router.push({
									pathname: "/user/request-list/detail",
									query: {id: record?.Id},
								})
							}
							icon="far fa-info-square"
							title="Xem chi tiết đơn"
						/>

						{record.Status !== EPaymentData.Finished &&
							record.Status !== EPaymentData.Paid &&
							record.Status !== EPaymentData.Canceled && (
								<ActionButton
									onClick={() => {
										Modal.confirm({
											title: <b>Hủy yêu cầu thanh toán này!</b>,
											onOk: () => handleAction(record, 3),
										});
									}}
									icon="fas fa-trash"
									title="Hủy yêu cầu"
								/>
							)}
						{record?.Status === EPaymentData.Unpaid ||
							(record?.Status === EPaymentData.Confirmed && (
								<ActionButton
									onClick={() => {
										Modal.confirm({
											title: <b>Thanh toán đơn này!</b>,
											onOk: () => handleAction(record, 2),
										});
									}}
									icon="fas fa-dollar-sign"
									title="Thanh toán"
								/>
							))}
					</Space>
				);
			},
			responsive: ["md"],
		},
	];

	const expandable = {
		expandedRowRender: (record) => (
			<ul className="px-2 text-xs">
				<li className="sm:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Tổng tiền:</span>
					{record.TotalPrice}
				</li>
				<li className="sm:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Tỷ giá:</span>
					{record.Currency}
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Trạng thái:</span>
					<Tag color={paymentData[record.Status]?.color}>{paymentData[record.Status]?.name}</Tag>
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Thao tác:</span>
					<ActionButton
						onClick={() =>
							router.push({
								pathname: "/user/request-list/detail",
								query: {id: record?.Id},
							})
						}
						icon="far fa-info-square"
						title="Xem chi tiết đơn"
					/>
				</li>
			</ul>
		),
	};

	return (
		<>
			<DataTable
				{...{
					loading,
					columns,
					data,
					expandable: expandable,
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
