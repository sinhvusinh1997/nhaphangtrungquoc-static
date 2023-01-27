import {Pagination, Space, Tag} from "antd";
import router from "next/router";
import {FC} from "react";
import {ActionButton, DataTable} from "~/components";
import {activeData, getLevelId} from "~/configs/appConfigs";
import {TColumnsType, TTable} from "~/types/table";
import {_format} from "~/utils";
type TProps = {
	filter: {
		TotalItems: number;
		PageIndex: number;
		PageSize: number;
	};
	handleFilter: (newFilter) => void;
	userGroupCatalogue;
	refetch: () => void;
	UserGroupId: number;
};

export const EmployeeManagementTable: FC<TTable<TEmployee> & TProps> = ({
	data,
	loading,
	filter,
	handleFilter,
	UserGroupId,
}) => {
	const columns: TColumnsType<TEmployee> = [
		{
			dataIndex: "Id",
			title: "ID",
		},
		{
			dataIndex: "UserName",
			title: "Username",
		},
		{
			dataIndex: "FullName",
			title: "Họ và tên",
			responsive: ["sm"],
		},
		{
			dataIndex: "Phone",
			title: "Số điện thoại",
			align: "right",
			responsive: ["md"],
		},
		{
			dataIndex: "Wallet",
			title: "Số dư (VNĐ)",
			align: "right",
			render: (money: number) => _format.getVND(money, " "),
			responsive: ["lg"],
		},
		{
			dataIndex: "Status",
			title: "Trạng thái",
			render: (status: number) => <Tag color={activeData[status]?.color}>{activeData[status]?.name}</Tag>,
			responsive: ["lg"],
		},
		{
			dataIndex: "LevelId",
			title: "VIP",
			responsive: ["md"],
			render: (_, record) => {
				return (
					<span className={`${record?.LevelId > 3 ? "text-[#8a64e3]" : "text-orange"} font-semibold text-xs`}>
						{getLevelId[record?.LevelId]?.Name}
					</span>
				);
			},
		},
		{
			dataIndex: "UserGroupName",
			title: "Quyền hạn",
			key: "UserGroupName",
			responsive: ["lg"],
		},
		{
			dataIndex: "Created",
			title: "Ngày tạo",
			render: (_, record) => {
				return (
					<>
						<div>{_format.getVNDate(record.Created)}</div>
						<div>{record.CreatedBy}</div>
					</>
				);
			},
			responsive: ["xl"],
		},
		{
			dataIndex: "Updated",
			title: "Ngày cập nhật",
			render: (_, record) => {
				return (
					<>
						<div>{_format.getVNDate(record?.Updated)}</div>
						<div>{record?.UpdatedBy}</div>
					</>
				);
			},
		},
		{
			dataIndex: "action",
			title: "Thao tác",
			align: "right",
			render: (_, record) => (
				<Space>
					{UserGroupId === 1 && (
						<ActionButton
							onClick={() =>
								router.push({
									pathname: "/manager/employee/employee-management/detail",
									query: {id: record?.Id},
								})
							}
							icon="fas fa-edit"
							title="Cập nhật"
						/>
					)}

					<ActionButton
						onClick={() =>
							router.push({
								pathname: "/manager/money/vietnam-recharge",
								query: {id: record?.Id},
							})
						}
						icon="fas fa-badge-dollar"
						title="Nạp tiền"
						iconContainerClassName="iconBlue"
						btnBlue
					/>
				</Space>
			),
			responsive: ["xl"],
		},
	];

	const expandable = {
		expandedRowRender: (record) => (
			<ul className="px-2 text-xs">
				<li className="sm:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Họ và tên:</span>
					{record.FullName}
				</li>
				<li className="md:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Số điện thoại:</span>
					{record.Phone}
				</li>
				<li className="lg:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Số dư:</span>
					{record.Deposit}
				</li>
				<li className="lg:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Trạng thái:</span>
					<div>
						<Tag color={activeData[record.Status]?.color}>{activeData[record.Status]?.name}</Tag>
					</div>
				</li>
				<li className="lg:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Quyền hạn:</span>
					{record.UserGroupName}
				</li>
				<li className="xl:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Ngày tạo:</span>
					{_format.getVNDate(record.Created)}
				</li>
				<li className="xl:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Thao tác:</span>
					<ActionButton
						onClick={() =>
							router.push({
								pathname: "/manager/employee/employee-management/detail",
								query: {id: record?.Id},
							})
						}
						icon="fas fa-edit"
						title="Cập nhật"
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
					bordered: true,
					expandable: expandable,
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
