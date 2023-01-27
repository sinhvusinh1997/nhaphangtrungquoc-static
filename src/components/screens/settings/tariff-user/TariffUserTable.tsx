import {FC} from "react";
import {ActionButton, DataTable} from "~/components";
import {TColumnsType, TTable} from "~/types/table";

export const TariffUserTable: FC<TTable<TTariffUser>> = ({
	handleModal,
	data,
	loading,
}) => {
	const columns: TColumnsType<TTariffUser> = [
		{
			dataIndex: "Id",
			title: "ID",
		},
		{
			dataIndex: "Name",
			title: "Cấp người dùng",
		},
		{
			dataIndex: "FeeBuyPro",
			title: "Chiết khấu phí mua hàng %",
			align: "right",
			responsive: ["sm"],
			render: (_, record) => {
				return (
					<span>
						{record?.FeeBuyPro}
					</span>
				);
			},
		},
		{
			dataIndex: "FeeWeight",
			title: "Chiết khấu phí vận chuyển TQ- VN %",
			align: "right",
			responsive: ["xl"],
			render: (_, record) => {
				return (
					<span>
						{record?.FeeWeight}
					</span>
				);
			},
		},
		{
			dataIndex: "LessDeposit",
			title: "Đặt cọc tối thiểu %",
			align: "right",
			responsive: ["xl"],
		},
		{
			dataIndex: "action",
			key: "action",
			title: "Thao tác",
			align: "right",
			render: (_, record) => (
				<ActionButton
					onClick={() => handleModal(record)}
					icon="fas fa-edit"
					title="Cập nhật"
				/>
			),
			responsive: ["xl"],
		},
	];

	const expandable = {
		expandedRowRender: (record) => (
			<ul className="px-2 text-xs">
				<li className="sm:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Chiết khấu phí mua hàng:</span>
					{record.FeeBuyPro}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">
						Chiết khấu phí vận chuyển TQ-VN:
					</span>
					{record.FeeWeight}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Đặt cọc tối thiểu:</span>
					{record.LessDeposit}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Thao tác:</span>
					<ActionButton
						onClick={() => handleModal(record)}
						icon="fas fa-edit"
						title="Cập nhật"
					/>
				</li>
			</ul>
		),
	};

	return (
		<DataTable
			{...{
				columns,
				loading,
				data,
				bordered: true,
				expandable: expandable,
			}}
		/>
	);
};
