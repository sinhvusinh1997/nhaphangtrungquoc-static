import { Pagination, Space, Tag } from "antd";
import router from "next/router";
import React from "react";
import { ActionButton, DataTable } from "~/components";
import { reportStatus, reportStatusData } from "~/configs/appConfigs";
import { TColumnsType, TTable } from "~/types/table";
import { _format } from "~/utils";

type TProps = {
  filter;
  handleFilter: (newFilter) => void;
};

export const ComplainListTable: React.FC<TTable<TReport> & TProps> = ({
  data,
  loading,
  filter,
  handleFilter,
  handleModal,
}) => {
  const columns: TColumnsType<TReport> = [
    {
      dataIndex: "Id",
      title: "ID",
    },
    {
      dataIndex: "UserName",
      title: "Username",
    },
    {
      dataIndex: "MainOrderId",
      title: "Mã đơn hàng",
      responsive: ["sm"],
    },
    {
      dataIndex: "Amount",
      title: "Số tiền",
      align: "right",
      render: (money) => _format.getVND(money, " "),
      responsive: ["md"],
    },
    {
      dataIndex: "ComplainText",
      title: "Nội dung",
      responsive: ["md"],
    },
    {
      dataIndex: "Status",
      title: "Trạng thái",
      render: (status, record) => {
        const color = reportStatus.find((x) => x.id === status);
        return <Tag color={color?.color}>{record?.StatusName}</Tag>;
      },
      responsive: ["lg"],
    },
    {
      dataIndex: "Created",
      title: "Ngày tạo",
      render: (_, record) => {
        return (
          <>
            <div className="text-left">{_format.getVNDate(record.Created)}</div>
            <div className="text-left">{record?.CreatedBy}</div>
          </>
        );
      },
      responsive: ["lg"],
    },
    {
      dataIndex: "Updated",
      title: "Ngày duyệt",
      align: "center",
      render: (_, record) => {
        return (
          <>
            <div className="text-left">{_format.getVNDate(record.Updated)}</div>
            <div className="text-left">{record?.UpdatedBy}</div>
          </>
        );
      },
      responsive: ["xl"],
    },
    {
      dataIndex: "action",
      key: "action",
      title: "Thao tác",
      align: "center",
      render: (_, record) => (
        <Space className="flex">
          <ActionButton
            onClick={() => handleModal(record)}
            icon="fas fa-edit"
            title="Cập nhật"
          />

          <ActionButton
            onClick={() =>
              router.push({
                pathname: "/manager/order/order-list/detail",
                query: { id: record?.MainOrderId },
              })
            }
            icon="fas fa-info"
            title="Chi tiết đơn"
          />
        </Space>
      ),
      responsive: ["xl"],
    },
  ];

  const expandable = {
    expandedRowRender: (record) => (
      <ul className="px-2 text-xs">
        <li className="sm:hidden justify-between flex py-2">
          <span className="font-medium mr-4">Mã đơn hàng:</span>
          {record.MainOrderId}
        </li>
        <li className="md:hidden justify-between flex py-2">
          <span className="font-medium mr-4">Số tiền:</span>
          {_format.getVND(record.Amount)}
        </li>
        <li className="md:hidden justify-between flex py-2">
          <span className="font-medium mr-4">Nội dung:</span>
          {record.ComplainText}
        </li>
        <li className="lg:hidden justify-between flex py-2">
          <span className="font-medium mr-4">Trạng thái:</span>
          <Tag color={reportStatusData?.[record.Status + 1]?.color}>
            {reportStatusData?.[record.Status + 1]?.name}
          </Tag>
        </li>
        <li className="lg:hidden justify-between flex py-2">
          <span className="font-medium mr-4">Ngày tạo:</span>
          {_format.getVNDate(record.Created)}
        </li>
        <li className="xl:hidden justify-between flex py-2">
          <span className="font-medium mr-4">Người duyệt:</span>
          {record.UpdatedBy}
        </li>
        <li className="xl:hidden justify-between flex py-2">
          <span className="font-medium mr-4">Ngày duyệt:</span>
          {record.Updated}
        </li>
        <li className="xl:hidden justify-between flex py-2">
          <span className="font-medium mr-4">Thao tác:</span>
          <div>
            <Space className="flex">
              <ActionButton
                onClick={() => handleModal(record)}
                icon="far fa-info-square"
                title="Xem"
              />
              <ActionButton
                onClick={() =>
                  router.push({
                    pathname: "/manager/order/order-list/detail",
                    query: { id: record?.MainOrderId },
                  })
                }
                icon="fas fa-info"
                title="Chi tiết đơn"
              />
            </Space>
          </div>
        </li>
      </ul>
    ),
  };

  return (
    <>
      <DataTable
        {...{
          columns,
          data,
          loading,
          bordered: true,
          expandable: expandable,
        }}
      />
      <div className="mt-4 text-right">
        <Pagination
          total={filter?.TotalItems}
          current={filter?.PageIndex}
          pageSize={filter?.PageSize}
          onChange={(page, pageSize) =>
            handleFilter({ ...filter, PageIndex: page, PageSize: pageSize })
          }
        />
      </div>
    </>
  );
};
