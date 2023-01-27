import React, {FC} from "react";
import {Control} from "react-hook-form";
import {FormInputNumber} from "~/components";

type TProps<T extends object = object> = {
	control: Control<T, object>;
	data: T;
};

export const ConfigurationRateAndRose: FC<TProps<TConfig3>> = ({control, data}) => {
	return (
		<React.Fragment>
			<div className="px-6 mt-4">
				<p className="text-xs" style={{color: "red"}}>
					* KHÔNG ĐƯỢC ĐỂ TRỐNG!
				</p>

				<div className="grid grid-cols-4 gap-4 my-5">
					<div className="col-span-1">
						<FormInputNumber
							control={control}
							name="Currency"
							label="Tỉ giá mua hộ"
							placeholder=""
							// required={false}
							rules={{required: "Không bỏ trống tỷ giá TQ-VN"}}
						/>
					</div>
					<div className="col-span-1">
						<FormInputNumber
							control={control}
							name="AgentCurrency"
							label="Tỉ giá ký gửi"
							// required={false}
							placeholder=""
							rules={{required: "Không bỏ trống tỷ giá đại lý"}}
						/>
					</div>
					<div className="col-span-1">
						<FormInputNumber
							control={control}
							name="PricePayHelpDefault"
							label="Tỉ giá thanh toán hộ"
							// required={false}
							placeholder=""
							rules={{
								required: "Không bỏ trống giá tiền mặc định thanh toán hộ",
							}}
						/>
					</div>
					<div className="col-span-1">
						<FormInputNumber
							control={control}
							name="NumberLinkOfOrder"
							label="Số lượng link trong 1 đơn"
							// required={false}
							placeholder=""
							rules={{required: "Không bỏ trống số lượng link trong 1 đơn"}}
						/>
					</div>
					<div className="col-span-1">
						<FormInputNumber
							control={control}
							name="SalePercent"
							label="% nhân viên sale trong 3 tháng đầu"
							// required={false}
							placeholder=""
							rules={{required: "Không bỏ trống nội dung phần trăm nhân viên"}}
						/>
					</div>
					<div className="col-span-1">
						<FormInputNumber
							control={control}
							name="SalePercentAfter3Month"
							label="% nhân viên sale sau 3 tháng"
							placeholder=""
							// required={false}
							rules={{required: "Không bỏ trống nội dung phần trăm nhân viên"}}
						/>
					</div>
					<div className="col-span-1">
						<FormInputNumber
							control={control}
							name="DatHangPercent"
							label="% nhân viên đặt hàng"
							placeholder=""
							// required={false}
							rules={{required: "Không bỏ trống nội dung phần trăm nhân viên"}}
						/>
					</div>
					<div className="col-span-1">
						<FormInputNumber
							control={control}
							name="InsurancePercent"
							label="% tiền bảo hiểm đơn hàng"
							// required={false}
							placeholder=""
							rules={{
								required: "TKhông bỏ trống nội dung phần trăm tiền bảo hiểm",
							}}
						/>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};
