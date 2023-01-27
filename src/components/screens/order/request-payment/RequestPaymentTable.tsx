import { Pagination, Tag } from "antd";
import router from "next/router";
import React from "react";
import { ActionButton, DataTable } from "~/components";
import { paymentData, paymentStatus } from "~/configs/appConfigs";
import { TColumnsType, TTable } from "~/types/table";
import { _format } from "~/utils";

type TProps = {
  filter;
  handleFilter: (newFilter) => void;
};

export const RequestPaymentTable: React.FC<
  TTable<TRequestPaymentOrder> & TProps
> = ({ data, filter, handleFilter, loading }) => {
  const columns: TColumnsType<TRequestPaymentOrder> = [
    {
      dataIndex: "Id",
      title: "ID",
    },
    {
      dataIndex: "UserName",
      title: "Username",
    },
    {
      dataIndex: "Note",
      title: "Ghi chú khách hàng",
    },
    {
      dataIndex: "TotalPrice",
      title: "Tổng tiền (¥)",
      align: "right",
      render: (money) => _format.getVND(money, " "),
    },
    {
      dataIndex: "TotalPriceVND",
      title: "Tổng tiền (VNĐ)",
      align: "right",
      render: (money) => _format.getVND(money, " "),
    },
    {
      dataIndex: "Currency",
      title: "Tỷ giá",
      align: "right",
      render: (currency) => _format.getVND(currency, " "),
    },
    {
      dataIndex: "Status",
      title: "Trạng thái",
      render: (status, record) => {
        const color = paymentStatus.find((x) => x.id === status);
        return <Tag color={color?.color}>{record?.StatusName}</Tag>;
      },
      sorter: (a, b) => a.Status - b.Status,
    },
    {
      dataIndex: "Created",
      title: "Ngày tạo",
      render: (date) => _format.getVNDate(date),
      // responsive: ["xl"],
    },
    {
      dataIndex: "action",
      key: "action",
      title: "Thao tác",
      align: "right",
      render: (_, record) => (
        <ActionButton
          onClick={() =>
            router.push({
              pathname: "/manager/order/request-payment/detail",
              query: { id: record?.Id },
            })
          }
          icon="fas fa-edit"
          title="Cập nhật"
        />
      ),
      // responsive: ["xl"],
    },
  ];

  // const expandable = {
  //   expandedRowRender: (record) => (
  //     <ul className="px-2 text-xs">
  //       <li className="sm:hidden justify-between flex py-2">
  //         <span className="font-medium mr-4">Tổng tiền (tệ):</span>
  //         {_format.getVND(record.TotalPrice)}
  //       </li>
  //       <li className="md:hidden justify-between flex py-2">
  //         <span className="font-medium mr-4">Tổng tiền (vnđ):</span>
  //         {_format.getVND(record.TotalPriceVND)}
  //       </li>
  //       <li className="md:hidden justify-between flex py-2">
  //         <span className="font-medium mr-4">Tỷ giá:</span>
  //         {record.Currency}
  //       </li>
  //       <li className="lg:hidden justify-between flex py-2">
  //         <span className="font-medium mr-4">Chưa hoàn thiện:</span>
  //         {record.isComplete ? (
  //           <i className="fad fa-check text-2xl text-green"></i>
  //         ) : (
  //           <i className="far fa-times text-2xl text-red"></i>
  //         )}
  //       </li>
  //       <li className="xl:hidden justify-between flex py-2">
  //         <span className="font-medium mr-4">Ngày tạo:</span>
  //         {_format.getVNDate(record.Created)}
  //       </li>
  //       <li className="xl:hidden justify-between flex py-2">
  //         <span className="font-medium mr-4">Trạng thái:</span>
  //         <Tag color={paymentData[record.Status].color}>
  //           {paymentData[record.Status].name}
  //         </Tag>
  //       </li>
  //       <li className="xl:hidden justify-between flex py-2">
  //         <span className="font-medium mr-4">Thao tác:</span>
  //         <ActionButton
  //           onClick={() =>
  //             router.push({
  //               pathname: "/manager/order/request-payment/detail",
  //               query: { id: record?.Id },
  //             })
  //           }
  //           icon="fas fa-edit"
  //           title="Cập nhật"
  //         />
  //       </li>
  //     </ul>
  //   ),
  // };

  return (
    <>
      <DataTable
        {...{
          loading,
          columns,
          data,
          bordered: true,
          // expandable: expandable,
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
