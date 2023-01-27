import { Tag } from "antd";
import router from "next/router";
import { ActionButton, DataTable } from "~/components";
import { orderStatus2Data, transportStatus } from "~/configs";
import { TColumnsType } from "~/types/table";
import { _format } from "~/utils";

export const UserTransfer = ({ data, isLoading, isFetching, pagination }) => {
  const columns: TColumnsType<TNewDeliveryOrders> = [
    {
      title: "ID",
      dataIndex: "Id",
    },
    {
      title: "Ngày đặt",
      dataIndex: "Created",
      render: (date) => <span>{_format.getVNDate(date)}</span>,
      responsive: ["lg"],
    },
    {
      title: "Mã vận đơn",
      dataIndex: "OrderTransactionCode",
    },
    {
      dataIndex: "PayableWeight",
      title: "Cân nặng (kg)",
      align: "right",
    },
    {
      dataIndex: "TotalPriceVND",
      title: "Tổng tiền (VNĐ)",
      align: "right",
      render: (_) => _format.getVND(_, ""),
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      render: (status, record) => {
        const color = transportStatus.find((x) => x.id === status);
        return <Tag color={color?.color}>{record?.StatusName}</Tag>;
      },
      responsive: ["md"],
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      align: "right",
      render: (_, record) => (
        <ActionButton
          onClick={() => router.push({ pathname: "/user/deposit-list" })}
          icon="fas fa-list"
          title="Xem danh sách đơn hàng"
        />
      ),
      responsive: ["xl"],
    },
  ];

  // const expandable = {
  // 	expandedRowRender: (data) => (
  // 		<ul className="px-2 text-xs">
  // 			{/* <li className="md:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Tỷ giá:</span>
  // 				{data?.Currency}
  // 			</li> */}
  // 			<li className="md:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Trạng thái:</span>
  // 				<Tag color={orderStatus2Data.find((x) => x.id === data?.Status).color}>{data?.StatusName}</Tag>
  // 			</li>
  // 			<li className="lg:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Ngày đặt:</span>
  // 				{_format.getShortVNDate(data?.Created)}
  // 			</li>
  // 			<li className="xl:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Thao tác:</span>
  // 				<ActionButton
  // 					onClick={() => router.push({pathname: "/user/deposit-list"})}
  // 					icon="fas fa-list"
  // 					title="Xem danh sách đơn hàng"
  // 				/>
  // 			</li>
  // 		</ul>
  // 	),
  // };
  return (
    <div className="tableBox overflow-hidden">
      <DataTable
        {...{
          columns,
          data: data?.Items,
          loading: isFetching,
          bordered: true,
          title: "Đơn hàng vận chuyển hộ",
          // expandable: expandable,
          pagination,
        }}
      />
    </div>
  );
};
