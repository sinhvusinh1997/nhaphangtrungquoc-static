import {FC} from "react";
import {DataTable} from "~/components";
import {transactionData} from "~/configs";
import {TColumnsType, TTable} from "~/types/table";
import {_format} from "~/utils";

const TransactionTable: FC<TTable<TStatisticalTransaction>> = ({data, pagination, handlePagination, loading}) => {
	const columns: TColumnsType<TStatisticalTransaction> = [
		{
			dataIndex: "Id",
			title: "STT",
			render: (_, __, index) => <>{++index}</>,
			width: 60,
		},
		{
			dataIndex: "Created",
			key: "Created",
			title: "Ngày giờ",
			render: (date) => _format.getVNDate(date),
			width: 120,
		},
		{
			dataIndex: "Content",
			key: "Content",
			title: "Nội dung",
			responsive: ["sm"],
			width: 220,
		},
		{
			dataIndex: "TradeTypeName",
			key: "TradeTypeName",
			title: "Loại giao dịch",
			responsive: ["lg"],
			render: (record) => <>{record}</>,
			width: 100,
		},
		{
			dataIndex: "Amount",
			key: "Amount",
			title: "Số tiền (VNĐ)",
			align: "right",
			render: (money) => _format.getVND(money, " "),
			responsive: ["md"],
			width: 160,
		},
		{
			dataIndex: "MoneyLeft",
			key: "MoneyLeft",
			title: "Số dư (VNĐ)",
			align: "right",
			render: (money) => _format.getVND(money, " "),
			responsive: ["xl"],
			width: 160,
		},
	];

	const expandable = {
		expandedRowRender: (record) => (
			<ul className="px-2 text-xs">
				<li className="sm:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Nội dung:</span>
					{record.description}
				</li>
				<li className="md:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Số tiền:</span>
					{_format.getVND(record.cash)}
				</li>
				<li className="lg:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Loại giao dịch:</span>
					{record.type}
				</li>
				<li className="xl:hidden justify-between flex py-2">
					<span className="font-medium mr-4">Số dư:</span>
					{_format.getVND(record.surplus)}
				</li>
			</ul>
		),
	};

	return (
		<DataTable
			{...{
				columns,
				data,
				bordered: true,
				pagination,
				onChange: handlePagination,
				expandable: expandable,
				loading,
				scroll: {y: 700},
			}}
		/>
	);
};

export {TransactionTable};
