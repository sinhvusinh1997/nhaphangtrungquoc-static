import {Tag} from "antd";
import React, {useRef, useState} from "react";
import {ActionButton, DataTable} from "~/components";
import {TColumnsType, TTable} from "~/types/table";
import {_format} from "~/utils";
import {RegisterStepsForm} from "./RegisterStepsForm";

export const RegisterStepsList: React.FC<TTable<TStep> & {refetchRegisterSteps}> = ({data, refetchRegisterSteps}) => {
	const columns: TColumnsType<TStep> = [
		{
			dataIndex: "Id",
			title: "Index",
			render: (_, __, index) => ++index,
			responsive: ["md"],
		},
		{
			dataIndex: "IMG",
			title: "Ảnh",
			align: "center",
			render: (_, record) => (
				<div
					style={{
						backgroundImage: `url(${record?.IMG ? record?.IMG : "/pro-empty.jpg"})`,
						width: "auto",
						height: "40px",
						backgroundPosition: "center",
						backgroundSize: "contain",
						backgroundRepeat: "no-repeat",
					}}
				></div>
			),
			responsive: ["md"],
		},
		{
			dataIndex: "Name",
			title: "Tên bước",
		},
		{
			dataIndex: "Active",
			title: "Trạng thái",
			render: (_, record) => <Tag color={record?.Active ? "green" : "red"}>{record?.Active ? "Hiện" : "Ẩn"}</Tag>,
			responsive: ["lg"],
		},
		{
			dataIndex: "Created",
			title: "Ngày tạo",
			render: (date) => _format.getVNDate(date),
			responsive: ["xl"],
		},
		{
			dataIndex: "action",
			align: "right",
			title: "Thao tác",
			render: (_, record) => <ActionButton icon="fas fa-edit" onClick={() => handleModal(record)} title="Cập nhật" />,
			responsive: ["xl"],
		},
	];

	const item = useRef<TStep>();
	const [modal, setModal] = useState(false);
	const handleModal = (itemSelected: TStep) => {
		item.current = itemSelected;
		setModal(true);
	};

	const expandable = {
		expandedRowRender: (index, record) => (
			<ul className="px-2 text-xs">
				<li className="sm:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Link:</span>
					{record.Link}
				</li>
				<li className="md:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Index:</span>
				</li>
				<li className="lg:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Trạng thái:</span>
					<Tag color={record?.Active ? "green" : "red"}>{record?.Active ? "Hiện" : "Ẩn"}</Tag>
				</li>
				<li className="xl:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Ngày tạo:</span>
					{_format.getVNDate(record.Created)}
				</li>
				<li className="xl:hidden flex justify-between py-2">
					<span className="font-medium mr-4">Thao tác:</span>
					<ActionButton icon="fas fa-edit" onClick={() => handleModal(record)} title="Cập nhật" />
				</li>
			</ul>
		),
	};

	return (
		<React.Fragment>
			<DataTable
				{...{
					columns,
					data,
					title: "DANH SÁCH CÁC BƯỚC ĐĂNG KÝ",
					expandable: expandable,
				}}
			/>
			<RegisterStepsForm
				{...{
					onCancel: () => setModal(false),
					visible: modal,
					defaultValues: item.current,
					refetchRegisterSteps: refetchRegisterSteps,
				}}
			/>
		</React.Fragment>
	);
};
