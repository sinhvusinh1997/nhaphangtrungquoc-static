import { Pagination, Tag } from "antd";
import React from "react";
import { DataTable } from "~/components";
import { packageStatus, smallPackageStatusData } from "~/configs/appConfigs";
import { TColumnsType, TTable } from "~/types/table";
import { _format } from "~/utils";
type TProps = {
  filter;
  handleFilter: (newFilter) => void;
};
export const TransactionCodeManagementTable: React.FC<
  TTable<TSmallPackage> & TProps
> = ({ data, loading, filter, handleFilter }) => {
  const columns: TColumnsType<TSmallPackage> = [
    {
      dataIndex: "Id",
      title: "ID",
      fixed: "left",
    },
    {
      dataIndex: "UserName",
      title: "Username",
      fixed: "left",
    },
    {
      dataIndex: "Code",
      title: "Bao hàng",
      responsive: ["xl"],
    },
    {
      dataIndex: "OrderTransactionCode",
      title: "Mã vận đơn",
    },
    {
      dataIndex: "MainOrderCode",
      title: "Mã đơn hàng",
    },
    {
      dataIndex: "ProductType",
      title: "Loại hàng",
      responsive: ["xl"],
    },
    {
      dataIndex: "Weight",
      title: "Cân nặng (KG)",
      align: "right",
    },
    {
      dataIndex: "Width",
      title: "D x R x C",
      align: "right",
      render: (_, record) => (
        <>{`${record.Length} x ${record.Width} x ${record.Height}`}</>
      ),
    },
    {
      dataIndex: "Volume",
      title: "Cân quy đổi (KG)",
      align: "right",
      responsive: ["xl"],
    },
    {
      dataIndex: "Description",
      title: "Ghi chú",
      responsive: ["xl"],
    },
    {
      dataIndex: "Created",
      title: "Ngày tạo",
      render: (date) => {
        return (
          <>
            <div>{_format.getVNDate(date)}</div>
          </>
        );
      },
      responsive: ["xl"],
    },
    {
      dataIndex: "Status",
      title: "Trạng thái",
      fixed: "right",
      render: (status, record) => {
        const color = packageStatus.find((x) => x.id === status);
        return <Tag color={color?.color}>{record?.StatusName}</Tag>;
      },
      width: 160,
    },
  ];

  const expandable = {
    expandedRowRender: (record) => (
      <ul className="px-2 text-xs">
        <li className="justify-between flex py-2">
          <span className="font-medium mr-4">Bao hàng:</span>
          {record?.Code || "---"}
        </li>
        <li className="justify-between flex py-2">
          <span className="font-medium mr-4">Loại hàng:</span>
          {record.ProductType || "---"}
        </li>
        <li className="justify-between flex py-2">
          <span className="font-medium mr-4">Cân nặng (KG):</span>
          {record.Weight}
        </li>
        <li className="justify-between flex py-2">
          <span className="font-medium mr-4">Ghi chú:</span>
          {record.Description || "---"}
        </li>
        <li className="justify-between flex py-2">
          <span className="font-medium mr-4">Ngày tạo:</span>
          {_format.getVNDate(record.Created)}
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
          bordered: true,
          expandable: expandable,
          loading: loading,
          scroll: { y: 700 },
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
