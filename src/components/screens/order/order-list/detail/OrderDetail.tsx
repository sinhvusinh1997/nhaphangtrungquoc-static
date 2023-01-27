import {Affix} from "antd";
import clsx from "clsx";
import router from "next/router";
import {Link} from "rc-scroll-anim";
import React, {FC} from "react";
import {useFormContext} from "react-hook-form";
import {useMediaQuery} from "react-responsive";
import {toast} from "react-toastify";
import {mainOrder} from "~/api";
import {FormSelect} from "~/components";
import {IconButton} from "~/components/globals/button/IconButton";
import {statusData} from "~/configs/appConfigs";
import {useCatalogue} from "~/hooks/useCatalogue";
import {_format} from "~/utils";

type TProps = {
	active: number;
	handleActive: (active: number) => void;
	handleUpdate: (data: TOrder) => Promise<void>;
	data: TOrder;
	loading: boolean;
	disabledPayment?: boolean;
	refetch?: any;
	RoleID: number;
};

const nameContent = "w-2/4 py-1 text-sm font-bold text-[#3E3C6A] tracking-normal";
const contentItem = "flex items-center border-b border-[#EDF1F7] py-[4px]";
const contentValue = "w-2/4 py-1 text-sm font-medium text-black";
const linkMenu = "cursor-pointer py-[2px] text-[#0000005a] text-sm block";
const linkMenuActive = "border-l-2 border-orange !text-black font-medium";

const IsShouldAffix: React.FC<{}> = ({children}) => {
	const isBigScreen = useMediaQuery({query: "(min-width: 1280px)"});
	return isBigScreen ? <Affix offsetTop={20}>{children}</Affix> : <>{children}</>;
};

const ComponentAffix: React.FC<TProps> = ({
	data,
	loading,
	active,
	handleActive,
	handleUpdate,
	disabledPayment,
	refetch,
	RoleID,
}) => {
	const {warehouseTQ, warehouseVN, shippingTypeToWarehouse} = useCatalogue({
		warehouseTQEnabled: !!RoleID,
		warehouseVNEnabled: !!RoleID,
		shippingTypeToWarehouseEnabled: !!RoleID,
	});

	const {handleSubmit, control} = useFormContext<TOrder>();

	return (
		<>
			<div className="tableBox p-4">
				<div className="">
					{!data?.IsCheckNotiPrice && data?.OrderType === 3 && (
						<div className={clsx(contentItem)}>
							<div className={clsx(nameContent)}>Báo giá: </div>
							<div className={clsx(contentValue)}>
								<IconButton
									onClick={async () => {
										await mainOrder.updateNotiPrice({...data, IsCheckNotiPrice: true}).then(() => {
											toast.success("Đã báo giá cho khách!");
											refetch();
										});
									}}
									title="Báo giá"
									icon="far fa-credit-card"
									btnClass="mr-4 mb-4 lg:mb-0"
									btnIconClass="mr-4"
									showLoading
									toolip="Click để báo giá cho khách"
									yellow
									disabled={data?.IsCheckNotiPrice || !(RoleID === 1 || RoleID === 3 || RoleID === 4)}
								/>
							</div>
						</div>
					)}
					<div className={clsx(contentItem)}>
						<div className={clsx(nameContent)}>Order ID</div>
						<div className={clsx(contentValue)}>{data?.Id}</div>
					</div>
					<div className={clsx(contentItem)}>
						<div className={clsx(nameContent)}>Loại đơn hàng</div>
						<div className={clsx(contentValue)}>{data?.OrderTypeName}</div>
					</div>
					<div className={clsx(contentItem)}>
						<div className={clsx(nameContent)}>Tổng tiền</div>
						<div className={clsx(contentValue)}>{_format.getVND(data?.TotalOrderAmount)}</div>
					</div>
					<div className={clsx(contentItem)}>
						<div className={clsx(nameContent)}>Đã trả</div>
						<div className={clsx(contentValue)}>{_format.getVND(data?.Deposit)}</div>
					</div>
					<div className={clsx(contentItem)}>
						<div className={clsx(nameContent)}>Còn lại</div>
						<div className={clsx(contentValue, "!text-warning")}>{_format.getVND(data?.RemainingAmount)}</div>
					</div>
					<div className={clsx(contentItem, "mt-4 border-none")}>
						<FormSelect
							control={control}
							name="Status"
							label="Trang thái"
							placeholder=""
							data={statusData}
							defaultValue={statusData.find((x) => x.id === data?.Status)}
						/>
					</div>
					<div className={clsx(contentItem, "border-none")}>
						<FormSelect
							control={control}
							name="FromPlace"
							label="Kho TQ"
							placeholder=""
							data={warehouseTQ}
							select={{label: "Name", value: "Id"}}
							defaultValue={{
								Id: data?.FromPlace,
								Name: data?.FromPlaceName,
							}}
						/>
					</div>
					<div className={clsx(contentItem, "border-none")}>
						<FormSelect
							control={control}
							name="ReceivePlace"
							label="Nhận hàng tại"
							placeholder=""
							data={warehouseVN}
							select={{label: "Name", value: "Id"}}
							defaultValue={{
								Id: data?.ReceivePlace,
								Name: data?.ReceivePlaceName,
							}}
						/>
					</div>
					<div className={clsx(contentItem, "border-none")}>
						<FormSelect
							control={control}
							name="ShippingType"
							label="Phương thức vận chuyển"
							placeholder=""
							data={shippingTypeToWarehouse}
							select={{label: "Name", value: "Id"}}
							defaultValue={{
								Id: data?.ShippingType,
								Name: data?.ShippingTypeName,
							}}
						/>
					</div>
				</div>
				{(RoleID === 1 || RoleID === 3 || RoleID === 4) && (
					<div className="flex items-center justify-center jus mt-3 pt-3 m-auto border-t border-[#edf1f7]">
						<IconButton
							onClick={handleSubmit(handleUpdate)}
							icon="fas fa-pencil"
							title="Cập nhật"
							btnClass="mr-2 !bg-orange !text-white"
							showLoading
							toolip=""
						/>
						{!disabledPayment && (RoleID === 1 || RoleID === 3) && data?.TotalOrderAmount !== data?.Deposit && (
							<a
								style={{
									pointerEvents: data?.TotalOrderAmount === data?.Deposit ? "none" : "all",
								}}
							>
								<IconButton
									onClick={() =>
										router.push({
											pathname: "/manager/order/payment",
											query: {id: data?.Id},
										})
									}
									icon="fas fa-credit-card"
									title="Thanh toán"
									showLoading
									toolip=""
									blue
								/>
							</a>
						)}
					</div>
				)}
			</div>
			<div className="tableBox xl:block hidden my-4 py-3">
				<ul className="mb-0">
					<li>
						<Link
							onFocus={() => handleActive(0)}
							offsetTop={120}
							to="order-code"
							className={clsx(linkMenu, active === 0 && linkMenuActive)}
						>
							<a className="pl-2">Mã đơn hàng</a>
						</Link>
					</li>
					<li>
						<Link
							onFocus={() => handleActive(1)}
							offsetTop={120}
							to="transfer-code-list"
							className={clsx(linkMenu, active === 1 && linkMenuActive)}
						>
							<a className="pl-2">Mã vận đơn</a>
						</Link>
					</li>
					<li>
						<Link
							onFocus={() => handleActive(2)}
							offsetTop={120}
							to="product-list"
							className={clsx(linkMenu, active === 2 && linkMenuActive)}
						>
							<a className="pl-2">Danh sách sản phẩm</a>
						</Link>
					</li>
					<li>
						<Link
							onFocus={() => handleActive(4)}
							offsetTop={120}
							to="surcharge-list"
							className={clsx(linkMenu, active === 4 && linkMenuActive)}
						>
							<a className="pl-2">Chi phí đơn hàng</a>
						</Link>
					</li>
					<li>
						<Link
							onFocus={() => handleActive(6)}
							offsetTop={120}
							to="order-info"
							className={clsx(linkMenu, active === 6 && linkMenuActive)}
						>
							<a className="pl-2">Thông tin người đặt - nhận hàng</a>
						</Link>
					</li>
					<li>
						<Link
							onFocus={() => handleActive(7)}
							offsetTop={120}
							to="history"
							className={clsx(linkMenu, active === 7 && linkMenuActive)}
						>
							<a className="pl-2">Lịch sử thanh toán - thay đổi</a>
						</Link>
					</li>
				</ul>
			</div>
			<IconButton
				// onClick={() => router.push(`/manager/order/order-list${data?.OrderType === 3 ? "?q=3" : ""}`)}
				onClick={() => router.back()}
				icon="fas fa-undo-alt"
				title="Về danh sách"
				btnClass="mr-2 !bg-orange !text-white"
				showLoading
				toolip=""
			/>
		</>
	);
};

export const OrderDetail: FC<TProps> = (props) => {
	return (
		<IsShouldAffix>
			<ComponentAffix {...props} />
		</IsShouldAffix>
	);
};
