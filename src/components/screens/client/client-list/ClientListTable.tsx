import {Dropdown, Pagination, Space, Tag} from "antd";
import Link from "next/link";
import router from "next/router";
import React from "react";
import {ActionButton, DataTable, Menu} from "~/components";
import {activeData, getLevelId} from "~/configs/appConfigs";
import {TColumnsType, TTable} from "~/types/table";
import {_format} from "~/utils";

type TProps = {
	refetch: () => void;
	RoleID: number;
	dathangList?: any;
	saleList?: any;
	filter;
	handleFilter: (newFilter) => void;
};

export const ClientListTable: React.FC<TTable<TClient> & TProps> = ({
	data,
	filter,
	handleFilter,
	loading,
	refetch,
	RoleID,
	dathangList,
	saleList,
}) => {
	const columns: TColumnsType<TClient> = [
		{
			dataIndex: "Id",
			title: "ID",
			responsive: ["sm"],
		},
		{
			dataIndex: "UserName",
			title: "Username",
			responsive: ["sm"],
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
			dataIndex: "FullName",
			title: "Họ và tên",
		},
		{
			dataIndex: "Email",
			title: "Email",
			responsive: ["lg"],
		},
		{
			dataIndex: "DatHangId",
			title: "Nhân viên đặt hàng",
			render: (_, record) => {
				const getName = dathangList?.Data?.Items.filter((item) => item.Id === record?.DatHangId)[0];
				return <>{getName?.UserName ?? "--"}</>;
			},
		},
		{
			dataIndex: "SaleId",
			title: "Nhân viên kinh doanh",
			className: `${RoleID === 7 ? "hidden" : ""}`,
			render: (_, record) => {
				const getName = saleList?.Data?.Items.filter((item) => item.Id === record?.SaleId)[0];
				return <>{getName?.UserName ?? "--"}</>;
			},
		},
		{
			dataIndex: "Phone",
			title: "Số điện thoại",
			align: "right",
			responsive: ["sm"],
		},
		{
			dataIndex: "Wallet",
			title: "Số dư VNĐ",
			align: "right",
			responsive: ["md"],
			render: (_, record) => _format.getVND(record?.Wallet, " "),
		},
		{
			dataIndex: "Status",
			title: "Trạng thái",
			render: (status: number) => <Tag color={activeData[status].color}>{activeData[status].name}</Tag>,
			responsive: ["lg"],
		},
		{
			dataIndex: "Created",
			title: "Ngày tạo",
			render: (_, record) => {
				return (
					<>
						<div className="text-left">{_format.getVNDate(record.Created)}</div>
						<div className="text-left">{record.CreatedBy}</div>
					</>
				);
			},
			responsive: ["lg"],
		},
		{
			dataIndex: "action",
			title: "Thao tác",
			align: "right",
			className: `${RoleID === 1 || RoleID === 3 ? "" : "hidden"}`,
			render: (_, record) => (
				<Space>
					<Dropdown
						placement="bottomRight"
						overlay={
							<Menu
								data={[
									{
										title: "Cập nhật",
										onClick: () => {
											router.push({
												pathname: "/manager/client/client-list/detail",
												query: {id: record?.Id},
											});
										},
										isHidden: RoleID !== 1 ? false : true,
									},
									{
										title: "Nạp tiền",
										isHidden: true,
										onClick: () => {
											router.push({
												pathname: "/manager/money/vietnam-recharge",
												query: {id: record?.Id},
											});
										},
									},
									{
										title: "Rút tiền",
										isHidden: true,
										onClick: () => {
											router.push({
												pathname: "/manager/money/vietnam-withdrawal",
												query: {id: record?.Id},
											});
										},
									},
									{
										title: "Danh sách đơn hàng",
										isHidden: true,
										onClick: () => {
											router.push({
												pathname: "/manager/client/order-list/detail",
												query: {id: record?.Id},
											});
										},
									},
									{
										title: "Tạo đơn hàng khác",
										isHidden: true,
										onClick: () => {
											router.push({
												pathname: "/manager/client/create-order",
												query: {id: record?.Id},
											});
										},
									},
									{
										title: "Lịch sử giao dịch",
										isHidden: true,
										onClick: () => {
											router.push({
												pathname: "/manager/client/transaction-history",
												query: {id: record?.Id},
											});
										},
									},
								]}
							/>
						}
					>
						<ActionButton onClick={undefined} icon="fas fa-info-square" title="Thao tác" />
					</Dropdown>
				</Space>
			),
			responsive: ["lg"],
		},
	];

	const expandable = {
		expandedRowRender: (record) => (
			<ul className="px-2 text-xs">
				<li className="sm:hidden flex justify-between py-2">
					<span className="font-medium mr-4">ID:</span>
					{record.Id}
				</li>
				<li className="sm:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Username:</span>
					{record.Username}
				</li>
				<li className="sm:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Số điện thoại:</span>
					{record.Phone}
				</li>
				<li className="md:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Số dư VNĐ:</span>
					{record.Wallet}
				</li>
				<li className="md:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Số dư Tệ:</span>
					{record.WalletCNY}
				</li>
				<li className="lg:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Trạng thái:</span>
					<Tag color={activeData[record?.Status].color}>{activeData[record.Status].name}</Tag>
				</li>
				<li className="lg:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Ngày tạo:</span>
					{_format.getShortVNDate(record.Created)}
				</li>
				<li className={`${RoleID === 1 || RoleID === 3 ? "" : "hidden"} xl:hidden flex justify-between py-2`}>
					<span className="font-medium mr-4">Thao tác:</span>
					<Space>
						<div>
							<div>
								<Link href={`/client/client-list/${record.Id}`}>
									<a>
										<ActionButton onClick={undefined} icon="fas fa-edit" title="Cập nhật" />
									</a>
								</Link>
								<Dropdown
									placement="bottomRight"
									overlay={
										<Menu
											data={[
												{
													title: "Nạp VNĐ",
													onClick: () =>
														router.push({
															pathname: "/manager/client/vietnam-recharge",
															query: {id: record?.Id},
														}),
												},
											]}
										/>
									}
								>
									<ActionButton onClick={undefined} icon="fas fa-badge-dollar" title="Nạp tiền" />
								</Dropdown>
								<Dropdown
									placement="bottomRight"
									overlay={
										<Menu
											data={[
												{
													title: "Rút VNĐ",
													onClick: () =>
														router.push({
															pathname: "/manager/client/vietnam-withdrawal",
															query: {id: record?.Id},
														}),
												},
											]}
										/>
									}
								>
									<ActionButton onClick={undefined} icon="fas fa-wallet" title="Rút tiền" />
								</Dropdown>
							</div>
							<div>
								<ActionButton
									onClick={() =>
										router.push({
											pathname: "/manager/client/order-list",
											query: {id: record?.Id},
										})
									}
									icon="fas fa-clipboard-list"
									title="Danh sách đơn hàng"
								/>

								<ActionButton
									onClick={() =>
										router.push({
											pathname: "/manager/client/create-order",
											query: {id: record?.Id},
										})
									}
									icon="fas fa-file-plus"
									title="Tạo đơn hàng khác"
								/>

								<ActionButton
									onClick={() =>
										router.push({
											pathname: "/manager/client/transaction-history",
											query: {id: record?.Id},
										})
									}
									icon="fas fa-dolly-flatbed"
									title="Lịch sử giao dịch"
								/>
							</div>
						</div>
					</Space>
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
					onChange={(val) => handleFilter({...filter, PageIndex: val})}
				/>
			</div>
		</>
	);
};
