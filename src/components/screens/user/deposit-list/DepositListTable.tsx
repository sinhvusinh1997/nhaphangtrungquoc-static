import {Modal, Pagination, Space, Tag} from "antd";
import "antd/dist/antd.css";
import React from "react";
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "react-query";
import {transportationOrder} from "~/api";
import {ActionButton, DataTable, FormInput, toast} from "~/components";
import {EOrderStatusData, orderStatusData, transportStatus} from "~/configs/appConfigs";
import {TColumnsType, TTable} from "~/types/table";
import {_format} from "~/utils";
type TProps = {
	handleSelectIds: (item: TUserDeposit) => void;
	filter;
	handleFilter: (newFilter) => void;
};

const DetailInfo = (record) => {
	const divStyle = `flex justify-between items-center py-2 my-2 border-b border-[#e4e4e4]`;
	const detailBox = `w-[50vw] grid grid-cols-2 gap-7 mt-[30px]`;
	const title = `text-[18px] font-bold`;
	const color = transportStatus.find((x) => x.id === record?.record?.Status);

	return (
		<div className={detailBox}>
			<div className="col-span-1">
				<span className={title}>Thông tin</span>
				<div className={divStyle}>
					Mã vận đơn: <span>{record?.record?.OrderTransactionCode}</span>
				</div>
				<div className={divStyle}>
					UserName: <span>{record?.record?.UserName}</span>
				</div>
				<div className={divStyle}>
					Kho Trung Quốc: <span>{record?.record?.WareHouseFrom}</span>
				</div>
				<div className={divStyle}>
					Kho Việt Nam: <span>{record?.record?.WareHouseTo}</span>
				</div>
				<div className={divStyle}>
					Ngày tạo: <span>{_format.getVNDate(record?.record?.Created)}</span>
				</div>
				<div className={divStyle}>
					Trạng thái: <Tag color={color?.color}>{record?.record?.StatusName}</Tag>
				</div>
				<div className={divStyle}>
					Phương thức vận chuyển: <span>{record?.record?.ShippingTypeName}</span>
				</div>
				<div className={`${divStyle} flex-col items-baseline`}>
					Ghi chú nhân viên:{" "}
					<textarea
						className="w-full border border-[#e4e4e4] px-3 py-2"
						readOnly
						disabled
						value={record?.record?.StaffNote ?? "--"}
					/>
				</div>
				<div className={`${divStyle} flex-col items-baseline`}>
					Ghi chú khách hàng (hủy nếu có):{" "}
					<textarea
						className="w-full border border-[#e4e4e4] px-3 py-2"
						readOnly
						disabled
						value={record?.record?.CancelReason === "" ? record?.record?.Note : record?.record?.CancelReason}
					/>
				</div>
			</div>

			<div className="col-span-1">
				<span className={title}>Phí chi tiết</span>
				<div className={divStyle}>
					Cân nặng: <span>{record?.record?.PayableWeight ?? 0} kg</span>
				</div>
				<div className={divStyle}>
					Phí cân nặng: <span>{_format.getVND(record?.record?.DeliveryPrice)}</span>
				</div>
				<div className={divStyle}>
					Phí COD Trung Quốc: <span>{_format.getVND(record?.record?.CODFee)}</span>
				</div>
				<div className={divStyle}>
					Phí đóng gỗ: <span>{_format.getVND(record?.record?.IsPackedPrice)}</span>
				</div>
				<div className={divStyle}>
					Phí bảo hiểm: <span>{_format.getVND(record?.record?.InsuranceMoney)}</span>
				</div>
				<div className={divStyle}>
					Phí kiểm hàng: <span>{_format.getVND(record?.record?.IsCheckProductPrice)}</span>
				</div>
				<div className={divStyle}>
					Tổng tiền: <span>{_format.getVND(record?.record?.TotalPriceVND)}</span>
				</div>
			</div>
		</div>
	);
};

export const UserDepositListTable: React.FC<TTable<TUserDeposit> & TProps> = ({
	data,
	loading,
	handleModal,
	handleFilter,
	filter,
}) => {
	const {control, getValues, reset} = useForm({
		mode: "onBlur",
		defaultValues: {
			note: "",
		},
	});

	const queryClient = useQueryClient();
	const mutationUpdate = useMutation((data: Partial<TUserDeposit>) => transportationOrder.cancelOrder(data), {
		onSuccess: () => {
			queryClient.invalidateQueries("userDepositList");
			toast.success("Huỷ đơn thành công");
			reset();
		},
		onError: toast.error,
	});

	const columns: TColumnsType<TUserDeposit> = [
		{
			dataIndex: "Id",
			title: "ID",
			fixed: "left",
			width: 100,
		},
		{
			dataIndex: "Created",
			title: "Ngày tạo",
			render: (date) => <div>{_format.getVNDate(date)}</div>,
			responsive: ["lg"],
			fixed: "left",
			width: 200,
		},
		{
			dataIndex: "OrderTransactionCode",
			title: "Mã vận đơn",
			width: 120,
		},
		{
			dataIndex: "UserName",
			title: "Username",
			responsive: ["md"],
			width: 100,
		},
		{
			dataIndex: "TotalPriceVND",
			title: "Tổng tiền(VNĐ)",
			align: "right",
			render: (money) => _format.getVND(money, ""),
			responsive: ["xl"],
			width: 140,
		},
		{
			dataIndex: "PayableWeight",
			title: "Cân nặng (Kg)",
			responsive: ["sm"],
			align: "right",
			render: (PayableWeight) => <>{PayableWeight ? PayableWeight : "--"}</>,
			width: 140,
		},
		{
			dataIndex: "Status",
			title: "Trạng thái",
			render: (status, record) => {
				const color = transportStatus.find((x) => x.id === status);
				return <Tag color={color?.color}>{record?.StatusName}</Tag>;
			},
			responsive: ["xl"],
			width: 140,
		},
		{
			dataIndex: "action",
			title: "Thao tác",
			align: "right",
			fixed: "right",
			render: (_, record) => {
				return (
					<Space>
						{record.Status === EOrderStatusData.ArrivedToVietNamWarehouse && (
							<ActionButton
								onClick={() =>
									Modal.confirm({
										title: `Thanh toán đơn hàng #${record.Id}.`,
										content: <b>Tổng tiền: {_format.getVND(record.TotalPriceVND, " VNĐ")}</b>,
										onOk: () =>
											transportationOrder.makePayment([record.Id]).then(() => {
												queryClient.invalidateQueries("userDepositList");
											}),
									})
								}
								icon="fas fa-money-check"
								title="Thanh toán"
								iconContainerClassName="iconRed"
							/>
						)}
						{record.Status === EOrderStatusData.NewOrder && (
							<ActionButton
								onClick={() =>
									Modal.confirm({
										title: `Hủy đơn hàng #${record.Id} ?`,
										content: (
											<FormInput
												control={control}
												name="note"
												placeholder="Tại sao lại hủy đơn hàng?"
												rules={{required: "Vui lòng điền lý do hủy"}}
											/>
										),
										onOk: () =>
											mutationUpdate.mutateAsync({
												Id: record.Id,
												Note: getValues("note"),
											}),
									})
								}
								icon="far fa-trash-alt"
								title="Hủy đơn"
								iconContainerClassName="iconRed"
							/>
						)}
						<ActionButton
							onClick={() =>
								Modal.info({
									title: <div className="text-[20px] font-bold">Thông tin chi tiết</div>,
									className: "!w-fit",
									content: <DetailInfo record={record} />,
								})
							}
							icon="fas fa-info-square"
							title="Chi tiết đơn"
							iconContainerClassName="iconRed"
						/>
					</Space>
				);
			},
			responsive: ["xl"],
			width: 140,
		},
	];

	const expandable = {
		expandedRowRender: (record) => (
			<ul className="px-2 text-xs">
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Cân nặng:</span>
					{record.Weight && _format.getVND(record.Weight)}
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Kho TQ:</span>
					{record.WareHouseFrom}
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Kho VN:</span>
					{record.WareHouseTo}
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">PTVC:</span>
					{record.ShippingTypeName}
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ghi chú KH:</span>
					{record.Note}
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Cước vật tư:</span>
					{record.SensorFeeVND && _format.getVND(record.SensorFeeVND, "VNĐ")}
				</li>
				{/* <li className="lg:hidden justify-between flex py-2">
					<span className="font-medium  mr-4">PP Hàng ĐB:</span>
					{record.AdditionFeeVND && _format.getVND(record.AdditionFeeVND, "VNĐ")}
				</li> */}
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ngày tạo:</span>
					{_format.getShortVNDate(record.Created)}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ngày về kho TQ:</span>
					{_format.getShortVNDate(record.DateInTQWarehouse)}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ngày về kho VN:</span>
					{_format.getShortVNDate(record.DateInVNWarehouse)}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ngày YCXK:</span>
					{_format.getShortVNDate(record.DateExportRequest)}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ngày XK:</span>
					{record.DateExport && _format.getShortVNDate(record.DateExport)}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">HTVC:</span>
					{record.ShippingTypeVNName}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ghi chú:</span>
					{record.StaffNote}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Trạng thái:</span>
					<Tag color={orderStatusData.find((x) => x.id === record.Status)?.color}>
						{orderStatusData.find((x) => x.id === record.Status)?.name}
					</Tag>
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Thao tác:</span>
					{record.Status === EOrderStatusData.NewOrder && (
						<ActionButton onClick={() => handleModal(record)} icon="far fa-trash-alt" title="Hủy đơn" />
					)}
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
					bordered: true,
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
