import {FC, useRef} from "react";
import {FilterInput, FilterSelect, IconButton} from "~/components";

type TProps = {
	handleFilter: (newFilter) => void;
	dathangList?: any;
	saleList?: any;
	isShow?: boolean;
};

export const ClientListFilter: FC<TProps> = ({handleFilter, dathangList, saleList, isShow = true}) => {
	const SearchContent = useRef(null);
	const Phone = useRef(null);
	const UserName = useRef(null);
	const SalerID = useRef(null);
	const OrdererID = useRef(null);

	return (
		<div className="grid grid-cols-6 gap-4 flex items-end flex-1">
			<div className="col-span-1">
				<FilterInput
					placeholder="Nhập Username"
					id="UserName"
					name="UserName"
					label="Username"
					handleSearch={(val) => (UserName.current = val.trim())}
				/>
			</div>
			<div className="col-span-1">
				<FilterInput
					placeholder="Nhập số điện"
					id="phone"
					name="phone"
					label="phone"
					handleSearch={(val) => (Phone.current = val.trim())}
				/>
			</div>
			<div className="col-span-1">
				<FilterInput
					placeholder="Nhập email"
					id="mail"
					name="mail"
					label="mail"
					handleSearch={(val) => (SearchContent.current = val.trim())}
				/>
			</div>
			{isShow && (
				<>
					<div className="col-span-1">
						<FilterSelect
							placeholder="Chọn nhân viên"
							label="Nhân viên kinh doanh"
							data={saleList?.Data?.Items}
							select={{label: "UserName", value: "Id"}}
							handleSearch={(val) => (SalerID.current = val)}
							isClearable={true}
						/>
					</div>
					<div className="col-span-1">
						<FilterSelect
							placeholder="Chọn nhân viên"
							label="Nhân viên đặt hàng"
							data={dathangList?.Data?.Items}
							select={{label: "UserName", value: "Id"}}
							handleSearch={(val) => (OrdererID.current = val)}
							isClearable={true}
						/>
					</div>
				</>
			)}
			<div className="col-span-1">
				<IconButton
					onClick={() => {
						handleFilter({
							SearchContent: SearchContent.current,
							Phone: Phone.current,
							UserName: UserName.current,
							SalerID: SalerID.current,
							OrdererID: OrdererID.current,
							PageIndex: 1,
						});
					}}
					icon="fas fa-filter"
					title="Lọc"
					btnClass=""
					showLoading
					toolip="Lọc"
				/>
			</div>
		</div>
	);
};
