import {Popconfirm} from "antd";
import JsBarcode from "jsbarcode";
import Link from "next/link";
import React, {useRef} from "react";
import ReactToPrint, {useReactToPrint} from "react-to-print";
import {ActionButton, DataTable, FormInput, FormInputNumber, FormSelect, FormTextarea, FormUpload} from "~/components";
import {IconButton} from "~/components/globals/button/IconButton";
import {EOrderTypeStatusData, ESmallPackageStatusData, smallPackageStatusData} from "~/configs/appConfigs";
import {TControl} from "~/types/field";
import {TColumnsType, TTable} from "~/types/table";

export const CheckWarehouseChinaTable: React.FC<
	TTable<TWarehouseCN> &
		TControl<{[key: string]: TWarehouseVN[]}> & {
			type?: "china" | "vietnam";
			name: string;
			onPress: (data: (TWarehouseCN | TWarehouseVN)[]) => void;
			onHide: (key: string, item: TWarehouseCN | TWarehouseCN[]) => void;
			handleAssign?: (data?: TWarehouseVN, type?: "assign1" | "assign2") => void;
			onIsLost: (item?: any) => void;
			bigPackageList?: TPackage[];
			defaultIdBigPackageSelected?: number;
		}
> = ({
	data,
	name,
	control,
	bigPackageList,
	defaultIdBigPackageSelected,
	handleSubmit,
	onPress,
	onHide,
	handleAssign,
	onIsLost,
	type = "china",
	setValue,
}) => {
	// const {fields, update} = useFieldArray({
	// 	name,
	// 	control,
	// 	keyName: "Id",
	// });

	// console.log("bigPackageList: ", bigPackageList);
	// console.log("defaultIdBigPackageSelected: ", defaultIdBigPackageSelected);
	// console.log(bigPackageList.filter((x) => x?.Id === defaultIdBigPackageSelected));

	const componentRef = useRef<ReactToPrint>(null);
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});

	// function handleSetDefaultId(id: number) {
	// 	return bigPackageList.filter((item) => item.Id === id);
	// }

	// của trung quốc
	const columns: TColumnsType<TWarehouseCN> = [
		{
			dataIndex: "MainOrderId",
			title: "Order ID",
			render: (_, record) => {
				let url = "";
				if (record?.OrderType === 3) {
					url = "/404";
				} else {
					url =
						record?.OrderType === 1
							? `/manager/order/order-list/detail/?id=${record?.MainOrderId}`
							: `/manager/deposit/deposit-list/detail/?id=${record?.TransportationOrderId}`;
				}
				return (
					<Link href={url}>
						<a
							target={"_blank"}
							// onClick={() =>
							// 	router.push({
							// 		pathname:
							// 			record?.OrderType === 1 ? "/manager/order/order-list/detail" : "/manager/deposit/deposit-list/detail",
							// 		query: {id: record?.OrderType === 1 ? record?.MainOrderId : record?.TransportationOrderId},
							// 	})
							// }
						>
							{record?.MainOrderId ? record?.MainOrderId : record?.TransportationOrderId}
						</a>
					</Link>
				);
			},
			fixed: "left",
			width: 80,
		},
		{
			dataIndex: "OrderTypeName",
			title: "Loại ĐH",
			responsive: ["sm"],
			fixed: "left",
			width: 100,
		},
		{
			dataIndex: "IsPackged",
			title: "Đơn hàng",
			render: (_, record) => (
				<div className="flex justify-center flex-col items-center">
					<div className="flex justify-evenly w-full">
						<p className="font-medium">KĐ</p>
						{record.IsCheckProduct ? (
							<i className="fas fa-check-circle text-xl text-success"></i>
						) : (
							<i className="fas fa-times-circle text-xl text-warning"></i>
						)}
					</div>
					<div className="flex justify-evenly w-full">
						<p className="font-medium">ĐG</p>
						{record.IsPackged ? (
							<i className="fas fa-check-circle text-xl text-success"></i>
						) : (
							<i className="fas fa-times-circle text-xl text-warning"></i>
						)}
					</div>
					<div className="flex justify-evenly w-full">
						<p className="font-medium">BH</p>
						{record.IsInsurance ? (
							<i className="fas fa-check-circle text-xl text-success"></i>
						) : (
							<i className="fas fa-times-circle text-xl text-warning"></i>
						)}
					</div>
				</div>
			),
			responsive: ["sm"],
			fixed: "left",
			width: 100,
		},
		{
			dataIndex: "OrderTransactionCode",
			title: "Mã vận đơn",
			fixed: "left",
			width: 120,
		},
		{
			dataIndex: "TotalOrder",
			title: "Số loại",
			align: "right",
			width: 70,
			responsive: ["sm"],
		},
		{
			dataIndex: "TotalOrderQuantity",
			title: "Số lượng",
			align: "right",
			width: 70,
			responsive: ["md"],
		},
		{
			dataIndex: "Weight",
			title: "Cân nặng (kg)",
			align: "right",
			render: (_, __, index) => (
				<FormInputNumber
					control={control}
					name={`${name}.${index}.Weight` as any}
					placeholder=""
					inputClassName="max-w-[60px] h-[30px] text-center"
					onEnter={handleSubmit((data) => onPress([data[name][index]]))}
				/>
			),
			responsive: ["md"],
		},
		{
			dataIndex: "Width",
			title: "Kích thước",
			align: "right",
			render: (_, __, index) => (
				<React.Fragment>
					<div className="flex items-center">
						d:
						<FormInputNumber
							control={control}
							name={`${name}.${index}.Length` as any}
							placeholder=""
							inputClassName="max-w-[60px] h-[30px] text-center"
							onEnter={handleSubmit((data) => onPress([data[name][index]]))}
						/>
					</div>
					<div className="flex items-center my-2">
						r:
						<FormInputNumber
							control={control}
							name={`${name}.${index}.Width` as any}
							placeholder=""
							inputClassName="max-w-[60px] h-[30px] text-center"
							onEnter={handleSubmit((data) => onPress([data[name][index]]))}
						/>
					</div>
					<div className="flex items-center">
						c:
						<FormInputNumber
							control={control}
							name={`${name}.${index}.Height` as any}
							placeholder=""
							inputClassName="max-w-[60px] h-[30px] text-center"
							onEnter={handleSubmit((data) => onPress([data[name][index]]))}
						/>
					</div>
				</React.Fragment>
			),
			responsive: ["md"],
		},
		{
			dataIndex: "BigPackageId",
			title: () => <div className="text-center">Bao lớn</div>,
			width: 160,
			render: (_, record, index) => {
				return (
					<FormSelect
						control={control}
						name={`${name}.${index}.BigPackageId` as any}
						data={bigPackageList}
						defaultValue={bigPackageList.filter((x) => x?.Id === defaultIdBigPackageSelected)[0]}
						menuPlacement="bottom"
						placeholder=""
						select={{label: "Name", value: "Id"}}
						isClearable
						menuPortalTarget={document.querySelector("div.ant-table-wrapper")}
						styles={{
							control: (base) => ({
								...base,
								width: 135,
								height: 30,
								minHeight: 30,
								borderRadius: 0,
								fontSize: 14,
								"& > div:first-of-type": {
									padding: "0 8px",
								},
								"& > div:last-of-type > div": {
									padding: "0",
								},
							}),
							menuPortal: (base) => {
								return {
									...base,
									top: (base?.["top"] as number) - 150,
									left: (base?.["left"] as number) - 330,
									width: (base?.["width"] as number) + 60,
								};
							},
						}}
					/>
				);
			},
			responsive: ["lg"],
		},
		{
			dataIndex: "ProductType",
			title: "Loại sản phẩm",
			render: (_, __, index) => (
				<FormInput
					control={control}
					name={`${name}.${index}.ProductType` as any}
					placeholder=""
					inputClassName="max-w-[120px] h-[30px]"
					onEnter={handleSubmit((data) => onPress([data[name][index]]))}
				/>
			),
			responsive: ["lg"],
		},
		{
			dataIndex: "StaffNoteCheck",
			title: "NV Kho KD",
			render: (_, __, index) => (
				<FormInput
					control={control}
					name={`${name}.${index}.StaffNoteCheck` as any}
					placeholder=""
					inputClassName="max-w-[120px] h-[30px]"
					onEnter={handleSubmit((data) => onPress([data[name][index]]))}
				/>
			),
			responsive: ["lg"],
		},
		{
			dataIndex: "Description",
			title: "Ghi chú",
			width: 100,
			render: (_, __, index) => (
				<FormTextarea
					control={control}
					name={`${name}.${index}.Description` as any}
					placeholder=""
					rows={2}
					inputClassName="!w-[80px]"
					onEnter={handleSubmit((data) => onPress([data[name][index]]))}
				/>
			),
			responsive: ["lg"],
		},
		{
			dataIndex: "UserNote",
			title: "Khách ghi chú",
			width: 100,
			render: (_, __, index) => (
				<FormTextarea
					control={control}
					name={`${name}.${index}.UserNote` as any}
					placeholder=""
					rows={2}
					inputClassName="!w-[80px]"
					onEnter={handleSubmit((data) => onPress([data[name][index]]))}
				/>
			),
			responsive: ["xl"],
		},
		{
			dataIndex: "IMG",
			title: "Hình ảnh",
			align: "center",
			render: (_, __, index) => <FormUpload control={control} name={`${name}.${index}.IMG` as any} image />,
			responsive: ["xl"],
		},
		{
			dataIndex: "Status",
			title: "Trạng thái",
			width: 140,
			render: (Status, __, index) => (
				<FormSelect
					control={control}
					name={`${name}.${index}.Status` as any}
					data={
						Status <= ESmallPackageStatusData.ArrivedToChinaWarehouse
							? [smallPackageStatusData[1]]
							: [smallPackageStatusData.find((x) => x.id === Status)]
					}
					defaultValue={
						Status <= ESmallPackageStatusData.ArrivedToChinaWarehouse
							? smallPackageStatusData[1]
							: smallPackageStatusData.find((x) => x.id === Status)
					}
					placeholder=""
					styles={{
						control: (base) => ({
							...base,
							width: 115,
							height: 30,
							minHeight: 30,
							borderRadius: 0,
							fontSize: 14,
							"& > div:first-of-type": {
								padding: "0 8px",
							},
							"& > div:last-of-type > div": {
								padding: "0",
							},
						}),
					}}
				/>
			),
			responsive: ["xl"],
		},
		{
			dataIndex: "action",
			title: "Action",
			align: "right",
			width: 110,
			render: (_, record, index) => (
				<React.Fragment>
					{record.Status <= ESmallPackageStatusData.ArrivedToChinaWarehouse && (
						<ActionButton
							icon="fas fa-sync-alt"
							onClick={handleSubmit((data) => onPress([data[name][index]]))}
							title="Cập nhật"
						/>
					)}
					<ActionButton
						icon="fas fa-barcode-read"
						onClick={() => {
							JsBarcode("#barcode", record?.OrderTransactionCode, {
								displayValue: false,
								width: 3,
							});
							handlePrint();
						}}
						title="In barcode"
					/>
					<ActionButton icon="fas fa-eye-slash" onClick={() => onHide(name, record)} title="Ẩn đi" />
				</React.Fragment>
			),
			responsive: ["xl"],
			fixed: "right",
			className: "bg-[#fff] z-100",
		},
	];

	const expandableTQ = {
		expandedRowRender: (record, index) => (
			<ul className="px-2 text-xs">
				<li className="sm:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Loại ĐH:</span>
					{record.OrderTypeName}
				</li>
				<li className="sm:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Đơn hàng:</span>
					<div className="flex justify-center">
						<div className="mx-1">
							<p className="font-medium">KĐ</p>
							{record.IsCheckProduct ? (
								<i className="fas fa-check-circle text-xl text-success"></i>
							) : (
								<i className="fas fa-times-circle text-xl text-warning"></i>
							)}
						</div>
						<div className="mx-1">
							<p className="font-medium">ĐG</p>
							{record.IsPackged ? (
								<i className="fas fa-check-circle text-xl text-success"></i>
							) : (
								<i className="fas fa-times-circle text-xl text-warning"></i>
							)}
						</div>
						<div className="mx-1">
							<p className="font-medium">BH</p>
							{record.IsInsurance ? (
								<i className="fas fa-check-circle text-xl text-success"></i>
							) : (
								<i className="fas fa-times-circle text-xl text-warning"></i>
							)}
						</div>
					</div>
				</li>
				<li className="sm:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Số loại:</span>
					{record.TotalOrder}
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Số lượng:</span>
					{record.TotalOrderQuantity}
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Cân nặng (KG):</span>
					<div>
						<FormInputNumber
							control={control}
							name={`${name}.${index}.Weight` as any}
							placeholder=""
							inputClassName="max-w-[60px] h-[30px] text-center"
							onEnter={handleSubmit((data) => onPress([data[name][index]]))}
						/>
					</div>
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Kích thước:</span>
					<React.Fragment>
						<div className="flex items-center">
							d:
							<FormInputNumber
								control={control}
								name={`${name}.${index}.Length` as any}
								placeholder=""
								inputClassName="max-w-[60px] h-[30px] text-center"
								onEnter={handleSubmit((data) => onPress([data[name][index]]))}
							/>
						</div>
						<div className="flex items-center mx-[8px]">
							r:
							<FormInputNumber
								control={control}
								name={`${name}.${index}.Width` as any}
								placeholder=""
								inputClassName="max-w-[60px] h-[30px] text-center"
								onEnter={handleSubmit((data) => onPress([data[name][index]]))}
							/>
						</div>
						<div className="flex items-center">
							c:
							<FormInputNumber
								control={control}
								name={`${name}.${index}.Height` as any}
								placeholder=""
								inputClassName="max-w-[60px] h-[30px] text-center"
								onEnter={handleSubmit((data) => onPress([data[name][index]]))}
							/>
						</div>
					</React.Fragment>
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Bao lớn:</span>
					<div>
						<FormSelect
							control={control}
							name={`${name}.${index}.BigPackageId` as any}
							data={bigPackageList}
							defaultValue={bigPackageList?.find((x) => x.Id === defaultIdBigPackageSelected)}
							menuPlacement="top"
							placeholder="Chọn bao..."
							select={{label: "Name", value: "Id"}}
							isClearable
							menuPortalTarget={document.querySelector("div.ant-table-wrapper")}
							styles={{
								control: (base) => ({
									...base,
									width: 135,
									height: 30,
									minHeight: 30,
									borderRadius: 10,
									fontSize: 14,
									"& > div:first-of-type": {
										padding: "0 8px",
									},
									"& > div:last-of-type > div": {
										padding: "0",
									},
								}),
								menuPortal: (base) => {
									return {
										...base,
										top: (base?.["top"] as number) - 150,
										left: (base?.["left"] as number) - 40,
										width: (base?.["width"] as number) + 60,
									};
								},
							}}
						/>
					</div>
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Loại sản phẩm:</span>
					<div>
						<FormInput
							control={control}
							name={`${name}.${index}.ProductType` as any}
							placeholder=""
							inputClassName="max-w-[120px] h-[30px]"
							onEnter={handleSubmit((data) => onPress([data[name][index]]))}
						/>
					</div>
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">NV kho KD:</span>
					<div>
						<FormInput
							control={control}
							name={`${name}.${index}.StaffNoteCheck` as any}
							placeholder=""
							inputClassName="max-w-[120px] h-[30px]"
							onEnter={handleSubmit((data) => onPress([data[name][index]]))}
						/>
					</div>
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ghi chú:</span>
					<div>
						<FormTextarea
							control={control}
							name={`${name}.${index}.Description` as any}
							placeholder=""
							rows={2}
							inputClassName="!w-[150px]"
							onEnter={handleSubmit((data) => onPress([data[name][index]]))}
						/>
					</div>
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Khách ghi chú:</span>
					<div>
						<FormTextarea
							control={control}
							name={`${name}.${index}.UserNote` as any}
							placeholder=""
							rows={2}
							inputClassName="!w-[150px]"
							onEnter={handleSubmit((data) => onPress([data[name][index]]))}
						/>
					</div>
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Hình ảnh:</span>
					<FormUpload control={control} name={`${name}.${index}.IMG` as any} image />
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Trạng thái:</span>
					<div>
						<FormSelect
							control={control}
							name={`${name}.${index}.Status` as any}
							data={
								record.Status <= ESmallPackageStatusData.ArrivedToChinaWarehouse
									? [smallPackageStatusData[1]]
									: [smallPackageStatusData.find((x) => x.id === record.Status)]
							}
							defaultValue={
								record.Status <= ESmallPackageStatusData.ArrivedToChinaWarehouse
									? smallPackageStatusData[1]
									: smallPackageStatusData.find((x) => x.id === record.Status)
							}
							placeholder=""
							styles={{
								control: (base) => ({
									...base,
									width: 115,
									height: 30,
									minHeight: 30,
									borderRadius: 10,
									fontSize: 14,
									"& > div:first-of-type": {
										padding: "0 8px",
									},
									"& > div:last-of-type > div": {
										padding: "0",
									},
								}),
							}}
						/>
					</div>
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Action:</span>
					<div>
						{record.Status <= ESmallPackageStatusData.ArrivedToChinaWarehouse && (
							<ActionButton
								icon="fas fa-sync-alt"
								onClick={handleSubmit((data) => onPress([data[name][index]]))}
								title="Cập nhật"
							/>
						)}
						<ActionButton icon="fas fa-barcode-read" onClick={undefined} title="In barcode" />
						<ActionButton icon="fas fa-eye-slash" onClick={() => onHide(name, record)} title="Ẩn đi" />
					</div>
				</li>
			</ul>
		),
	};

	// của việt nam
	const columnsVN: TColumnsType<TWarehouseVN> = [
		{
			dataIndex: "MainOrderId",
			title: "Order ID",
			render: (_, record) => {
				let url = "";
				if (record?.OrderType === 3) {
					url = "/404";
				} else {
					url =
						record?.OrderType === 1
							? `/manager/order/order-list/detail/?id=${record?.MainOrderId}`
							: `/manager/deposit/deposit-list/detail/?id=${record?.TransportationOrderId}`;
				}
				return (
					<Link href={url}>
						<a target={"_blank"}>{record?.MainOrderId ? record?.MainOrderId : record?.TransportationOrderId}</a>
					</Link>
				);
			},
			fixed: "left",
			width: 80,
		},
		{
			dataIndex: "IsPackged",
			title: "Đơn hàng",
			render: (_, record) => (
				<div className="flex justify-center">
					<div className="mx-1">
						<p className="font-medium">KĐ</p>
						{record.IsCheckProduct ? (
							<i className="fas fa-check-circle text-xl text-success"></i>
						) : (
							<i className="fas fa-times-circle text-xl text-warning"></i>
						)}
					</div>
					<div className="mx-1">
						<p className="font-medium">ĐG</p>
						{record.IsPackged ? (
							<i className="fas fa-check-circle text-xl text-success"></i>
						) : (
							<i className="fas fa-times-circle text-xl text-warning"></i>
						)}
					</div>
					<div className="mx-1">
						<p className="font-medium">BH</p>
						{record.IsInsurance ? (
							<i className="fas fa-check-circle text-xl text-success"></i>
						) : (
							<i className="fas fa-times-circle text-xl text-warning"></i>
						)}
					</div>
				</div>
			),
			responsive: ["sm"],
			fixed: "left",
			width: 100,
		},
		{
			dataIndex: "OrderTransactionCode",
			title: "Mã vận đơn",
			className: "break-words words-break",
			fixed: "left",
			width: 100,
		},
		{
			dataIndex: "OrderTypeName",
			title: "Loại ĐH",
			responsive: ["sm"],
			width: 180,
		},
		{
			dataIndex: "TotalOrder",
			title: "Số loại",
			align: "right",
			responsive: ["md"],
			width: 70,
		},
		{
			dataIndex: "TotalOrderQuantity",
			title: "Số lượng",
			align: "right",
			responsive: ["md"],
			width: 70,
		},
		{
			dataIndex: "Weight",
			title: "Cân nặng (kg)",
			align: "right",
			render: (_, __, index) => (
				<FormInputNumber
					control={control}
					name={`${name}.${index}.Weight` as any}
					placeholder=""
					inputClassName="h-[30px] text-center"
					onEnter={handleSubmit((data) => onPress([data[name][index]]))}
				/>
			),
			width: 100,
			responsive: ["md"],
		},
		{
			dataIndex: "Width",
			title: "Kích thước",
			align: "right",
			width: 100,
			render: (_, __, index) => (
				<React.Fragment>
					<div className="flex items-center">
						d:
						<FormInputNumber
							control={control}
							name={`${name}.${index}.Length` as any}
							placeholder=""
							inputClassName="max-w-[60px] h-[30px] text-center"
							onEnter={handleSubmit((data) => onPress([data[name][index]]))}
						/>
					</div>
					<div className="flex items-center my-2">
						r:
						<FormInputNumber
							control={control}
							name={`${name}.${index}.Width` as any}
							placeholder=""
							inputClassName="max-w-[60px] h-[30px] text-center"
							onEnter={handleSubmit((data) => onPress([data[name][index]]))}
						/>
					</div>
					<div className="flex items-center">
						c:
						<FormInputNumber
							control={control}
							name={`${name}.${index}.Height` as any}
							placeholder=""
							inputClassName="max-w-[60px] h-[30px] text-center"
							onEnter={handleSubmit((data) => onPress([data[name][index]]))}
						/>
					</div>
				</React.Fragment>
			),
			responsive: ["lg"],
		},
		{
			dataIndex: "Description",
			title: "Ghi chú",
			width: 100,
			render: (_, __, index) => (
				<FormTextarea
					control={control}
					name={`${name}.${index}.UserNote` as any}
					placeholder=""
					rows={2}
					onEnter={handleSubmit((data) => onPress([data[name][index]]))}
				/>
			),
			responsive: ["lg"],
		},
		{
			dataIndex: "UserNote",
			title: "Khách ghi chú",
			width: 100,
			render: (_, __, index) => (
				<FormTextarea
					control={control}
					name={`${name}.${index}.UserNote` as any}
					placeholder=""
					rows={2}
					inputClassName="!w-[100px]"
					onEnter={handleSubmit((data) => onPress([data[name][index]]))}
				/>
			),
			responsive: ["xl"],
		},
		{
			dataIndex: "IMG",
			title: "Hình ảnh",
			align: "center",
			render: (_, __, index) => <FormUpload control={control} name={`${name}.${index}.IMG` as any} image />,
			responsive: ["xl"],
			width: 100,
		},
		{
			dataIndex: "Status",
			title: "Trạng thái",
			width: 140,
			render: (Status, __, index) => (
				<FormSelect
					control={control}
					name={`${name}.${index}.Status` as any}
					data={
						Status <= ESmallPackageStatusData.ArrivedToVietNamWarehouse
							? [smallPackageStatusData[2]]
							: [smallPackageStatusData.find((x) => x.id === Status)]
					}
					defaultValue={
						Status <= ESmallPackageStatusData.ArrivedToVietNamWarehouse
							? smallPackageStatusData[2]
							: smallPackageStatusData.find((x) => x.id === Status)
					}
					placeholder=""
					styles={{
						control: (base) => ({
							...base,
							height: 32,
							minHeight: 32,
							borderRadius: 0,
							fontSize: 14,
							"& > div:first-of-type": {
								padding: "0 8px",
							},
							"& > div:last-of-type > div": {
								padding: "0",
							},
						}),
					}}
				/>
			),
			responsive: ["xl"],
		},
		{
			dataIndex: "action",
			title: "Thao tác",
			align: "right",
			width: 120,
			render: (_, record, index) => (
				<React.Fragment>
					{record.Status <= ESmallPackageStatusData.ArrivedToVietNamWarehouse && (
						<ActionButton
							icon="fas fa-sync-alt"
							onClick={handleSubmit((data) => onPress([data[name][index]]))}
							title="Cập nhật"
						/>
					)}
					{/* <ActionButton
						icon="fas fa-map-marker-alt-slash"
						onClick={handleSubmit((data) => onIsLost(data[name]))}
						title="Thất lạc"
					/> */}
					{(record.OrderType === EOrderTypeStatusData.Buy || record.OrderType === EOrderTypeStatusData.Unknown) && (
						<ActionButton
							icon="fas fa-plus"
							onClick={handleSubmit((data) => {
								handleAssign(data[name][index], "assign1");
							})}
							title="Gán đơn cho khách mua hộ"
						/>
					)}
					<ActionButton
						icon="fas fa-plus"
						onClick={handleSubmit((data) => handleAssign(data[name][index], "assign2"))}
						title="Gán đơn cho khách ký gửi"
					/>
					<ActionButton
						icon="fas fa-barcode-read"
						onClick={() => {
							JsBarcode("#barcode", record?.OrderTransactionCode, {
								displayValue: false,
								width: 3,
							});
							handlePrint();
						}}
						title="In barcode"
					/>
					<ActionButton icon="fas fa-eye-slash" onClick={() => onHide(name, record)} title="Ẩn đi" />
				</React.Fragment>
			),
			responsive: ["xl"],
			fixed: "right",
		},
	];

	const expandableVN = {
		expandedRowRender: (record, index) => (
			<ul className="px-2 text-xs">
				<li className="sm:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Order ID:</span>
					{record.MainOrderId}
				</li>
				<li className="sm:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Loại ĐH:</span>
					{record.OrderTypeName}
				</li>
				<li className="sm:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Đơn hàng:</span>
					<div className="flex justify-center">
						<div className="mx-1">
							<p className="font-medium">KĐ</p>
							{record.IsCheckProduct ? (
								<i className="fas fa-check-circle text-xl text-success"></i>
							) : (
								<i className="fas fa-times-circle text-xl text-warning"></i>
							)}
						</div>
						<div className="mx-1">
							<p className="font-medium">ĐG</p>
							{record.IsPackged ? (
								<i className="fas fa-check-circle text-xl text-success"></i>
							) : (
								<i className="fas fa-times-circle text-xl text-warning"></i>
							)}
						</div>
						<div className="mx-1">
							<p className="font-medium">BH</p>
							{record.IsInsurance ? (
								<i className="fas fa-check-circle text-xl text-success"></i>
							) : (
								<i className="fas fa-times-circle text-xl text-warning"></i>
							)}
						</div>
					</div>
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Số loại:</span>
					{record.TotalOrder}
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Số lượng:</span>
					{record.TotalOrderQuantity}
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4"> Cân nặng:</span>
					<div>
						<FormInputNumber
							control={control}
							name={`${name}.${index}.Weight` as any}
							placeholder=""
							inputClassName="max-w-[60px] h-[30px] text-center"
							onEnter={handleSubmit((data) => onPress([data[name][index]]))}
						/>
					</div>
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Kích thước:</span>
					<div className="flex">
						<div className="flex items-center">
							d:
							<FormInputNumber
								control={control}
								name={`${name}.${index}.Length` as any}
								placeholder=""
								inputClassName="max-w-[60px] h-[30px] text-center"
								onEnter={handleSubmit((data) => onPress([data[name][index]]))}
							/>
						</div>
						<div className="flex items-center mx-[8px]">
							r:
							<FormInputNumber
								control={control}
								name={`${name}.${index}.Width` as any}
								placeholder=""
								inputClassName="max-w-[60px] h-[30px] text-center"
								onEnter={handleSubmit((data) => onPress([data[name][index]]))}
							/>
						</div>
						<div className="flex items-center">
							c:
							<FormInputNumber
								control={control}
								name={`${name}.${index}.Height` as any}
								placeholder=""
								inputClassName="max-w-[60px] h-[30px] text-center"
								onEnter={handleSubmit((data) => onPress([data[name][index]]))}
							/>
						</div>
					</div>
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Loại sản phẩm/Cước vật tư:</span>
					<div>
						{record.OrderType === EOrderTypeStatusData.Buy ? (
							<FormInput
								control={control}
								name={`${name}.${index}.ProductType` as any}
								placeholder=""
								inputClassName="max-w-[120px] h-[30px]"
								onEnter={handleSubmit((data) => onPress([data[name][index]]))}
							/>
						) : (
							<>
								<FormInputNumber
									control={control}
									name={`${name}.${index}.SensorFeeCNY` as any}
									label="CNY:"
									required={false}
									placeholder=""
									inputClassName="max-w-[120px] h-[30px] text-center"
									callback={(val) => setValue(`${name}.${index}.SensorFeeVND`, Math.ceil(val * data[index].Currency))}
									onEnter={handleSubmit((data) => onPress([data[name][index]]))}
								/>
								<FormInputNumber
									control={control}
									name={`${name}.${index}.SensorFeeVND` as any}
									label="VND:"
									required={false}
									placeholder=""
									inputClassName="max-w-[120px] h-[30px] text-center"
									inputContainerClassName="mt-2"
									callback={(val) => setValue(`${name}.${index}.SensorFeeCNY`, val / data[index].Currency)}
									onEnter={handleSubmit((data) => onPress([data[name][index]]))}
								/>
							</>
						)}
					</div>
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">NV Kho KD/ Phụ phí ĐB:</span>
					<div>
						{record.OrderType === EOrderTypeStatusData.Buy ? (
							<FormInput
								control={control}
								name={`${name}.${index}.StaffNoteCheck` as any}
								placeholder=""
								inputClassName="max-w-[120px] h-[30px]"
								onEnter={handleSubmit((data) => onPress([data[name][index]]))}
							/>
						) : (
							<>
								<FormInputNumber
									control={control}
									name={`${name}.${index}.AdditionFeeCNY` as any}
									label="CNY:"
									required={false}
									placeholder=""
									inputClassName="h-[30px] text-center"
									callback={(val) => setValue(`${name}.${index}.AdditionFeeVND`, Math.ceil(val * data[index].Currency))}
									onEnter={handleSubmit((data) => onPress([data[name][index]]))}
								/>
								<FormInputNumber
									control={control}
									name={`${name}.${index}.AdditionFeeVND` as any}
									label="VND:"
									required={false}
									placeholder=""
									inputClassName="h-[30px] text-center"
									inputContainerClassName="mt-2"
									callback={(val) => setValue(`${name}.${index}.AdditionFeeCNY`, val / data[index].Currency)}
									onEnter={handleSubmit((data) => onPress([data[name][index]]))}
								/>
							</>
						)}
					</div>
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Ghi chú:</span>
					<div>
						<FormTextarea
							control={control}
							name={`${name}.${index}.Description` as any}
							placeholder=""
							rows={2}
							inputClassName="!w-[150px]"
							onEnter={handleSubmit((data) => onPress([data[name][index]]))}
						/>
					</div>
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Khách Ghi chú:</span>
					<div>
						<FormTextarea
							control={control}
							name={`${name}.${index}.UserNote` as any}
							placeholder=""
							rows={2}
							inputClassName="!w-[150px]"
							onEnter={handleSubmit((data) => onPress([data[name][index]]))}
						/>
					</div>
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Hình ảnh:</span>
					<FormUpload control={control} name={`${name}.${index}.IMG` as any} image />
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Trạng thái:</span>
					<FormSelect
						control={control}
						name={`${name}.${index}.Status` as any}
						data={
							record.Status <= ESmallPackageStatusData.ArrivedToVietNamWarehouse
								? [smallPackageStatusData[2]]
								: [smallPackageStatusData.find((x) => x.id === record.Status)]
						}
						defaultValue={
							record.Status <= ESmallPackageStatusData.ArrivedToVietNamWarehouse
								? smallPackageStatusData[2]
								: smallPackageStatusData.find((x) => x.id === record.Status)
						}
						placeholder=""
						styles={{
							control: (base) => ({
								...base,
								height: 32,
								minHeight: 32,
								borderRadius: 10,
								fontSize: 14,
								"& > div:first-of-type": {
									padding: "0 8px",
								},
								"& > div:last-of-type > div": {
									padding: "0",
								},
							}),
						}}
					/>
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Thao tác:</span>
					<div>
						<div>
							{record.Status <= ESmallPackageStatusData.ArrivedToVietNamWarehouse && (
								<ActionButton
									icon="fas fa-sync-alt"
									onClick={handleSubmit((data) => onPress([data[name][index]]))}
									title="Cập nhật"
								/>
							)}
							<ActionButton
								icon="fas fa-map-marker-alt-slash"
								onClick={handleSubmit((data) => onIsLost(data[name]))}
								title="Thất lạc"
							/>
							{(record.OrderType === EOrderTypeStatusData.Buy || record.OrderType === EOrderTypeStatusData.Unknown) && (
								<ActionButton
									icon="fas fa-plus"
									onClick={handleSubmit((data) => handleAssign(data[name][index], "assign1"))}
									title="Gán đơn cho khách mua hộ"
								/>
							)}
						</div>
						<div>
							<ActionButton
								icon="fas fa-plus"
								onClick={handleSubmit((data) => handleAssign(data[name][index], "assign2"))}
								title="Gán đơn cho khách ký gửi"
							/>
							<ActionButton icon="fas fa-barcode-read" onClick={undefined} title="In barcode" />
							<ActionButton icon="fas fa-eye-slash" onClick={() => onHide(name, record)} title="Ẩn đi" />
						</div>
					</div>
				</li>
			</ul>
		),
	};

	const ComponentToPrint = React.forwardRef<{}, {}>((props, ref: any) => {
		return (
			<div ref={ref} className="w-full">
				<svg className="w-full m-auto" id="barcode"></svg>
			</div>
		);
	});

	return (
		<div className="mt-4 ">
			<div className="hidden">
				<ComponentToPrint ref={componentRef} />
			</div>
			<div className="lg:flex  pt-4 items-center border-t-[1px] border-t-[#facebc] justify-between mb-2 mx-4">
				<div className="lg:flex mb-4 lg:mb-0 order-last ">
					<IconButton
						onClick={() => onHide(name, [])}
						btnClass="mr-4 mb-4 lg:mb-0"
						title="Ẩn tất cả"
						icon="fas fa-eye-slash"
						toolip=""
					/>
					<Popconfirm
						placement="topLeft"
						title="Bạn có muốn cập nhật tất cả kiện này?"
						onConfirm={handleSubmit((dataSubmit) => {
							onPress(dataSubmit[name]);
						})}
						okText="Yes"
						cancelText="No"
					>
						<IconButton icon="fas fa-pencil" title="Cập nhật tất cả" toolip="" />
					</Popconfirm>
				</div>
				<div className="flex justify-center min-w-[250px] mb-4 lg:mb-0 bg-[#f14f042b] text-[#f14f04] text-center px-[20px] py-[10px] text-sm font-bold uppercase">
					<div className="mr-2">
						{data?.[0]?.UserName || ""} | {data?.[0]?.Phone || ""}
					</div>
					<span className="">{`(${data.length})`}</span>
				</div>
			</div>
			<DataTable
				{...{
					data,
					columns: type === "china" ? columns : columnsVN,
					expandable: type === "china" ? expandableTQ : expandableVN,
					scroll: {x: 1700},
				}}
			/>
		</div>
	);
};
