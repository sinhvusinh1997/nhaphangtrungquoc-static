import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, Spin } from "antd";
import clsx from "clsx";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { mainOrder } from "~/api";
import {
  Empty,
  Layout,
  MessageControlManager,
  OrderCode,
  OrderCost,
  OrderDetail,
  OrderHandlingStaff,
  OrderHistory,
  OrderInfo,
  OrderProductList,
  OrderSurChargeList,
  OrderTransferCodeList,
  showToast,
  toast,
} from "~/components";
import { breadcrumb } from "~/configs";
import { SEOConfigs } from "~/configs/SEOConfigs";
import { useCatalogue } from "~/hooks";
import { selectConnection, useAppSelector } from "~/store";
import { TNextPageWithLayout } from "~/types/layout";

const className = "TabPanel py-4";
const { Panel } = Collapse;

const Index: TNextPageWithLayout = () => {
  const { current: newUser } = useAppSelector((state) => state.user);
  if (!newUser) return null;

  const { query } = useRouter();
  const router = useRouter();
  const orderId = Number(router.query.id);
  const [active, setActive] = React.useState(0);
  const connection = useAppSelector(selectConnection);
  const connectionId = connection?.connectionId;

  const { userSale, userOrder } = useCatalogue({
    userSaleEnabled: !!newUser,
    userOrderEnabled: !!newUser,
  });

  const form = useForm<TOrder>({
    mode: "onBlur",
  });

  useEffect(() => {
    if (!connectionId) return;
    let timeout = null;
    connection.on("change", (mainOrders: TOrder[]) => {
      if (!!mainOrders?.length) {
        const item = mainOrders.some((order) => {
          return order.Id === +query?.id;
        });
        if (item) {
          form.reset(mainOrder[0]);
        }
      }
    });
    return () => clearTimeout(timeout);
  }, [connectionId]);

  const { data, isError, isLoading, isFetching, refetch } = useQuery(
    ["order-list", orderId],
    () => mainOrder.getByID(+query?.id),
    {
      onSuccess: (data) => {
        if (!data?.Data?.IsCheckNotiPrice && data?.Data?.OrderType === 3)
          toast.warning("????n h??ng ch??a c???p nh???t b??o gi?? cho kh??ch!");
        form.reset(data?.Data);
      },
      onError: toast.error,
      retry: false,
      enabled: !!+query?.id,
      // enabled: false,
      // refetchOnMount: "always",
    }
  );

  const mutationUpdate = useMutation(mainOrder.update, {
    onSuccess: () => {
      toast.success("C???p nh???t ????n h??ng th??nh c??ng");
      refetch();
    },
    onError: (error) => {
      showToast({
        title: "???? x???y ra l???i",
        message: (error as any)?.response?.data?.ResultMessage,
        type: "error",
      });
    },
  });

  const _onUpdate = async (data: TOrder) => {
    const { HistoryOrderChanges, PayOrderHistories, Complains, ...newData } =
      data;
    await mutationUpdate.mutateAsync(newData);
  };

  if (isError) {
    return <Empty description={`Kh??ng t??m th???y ????n h??ng #${query?.id}`} />;
  }

  return (
    <Spin spinning={isFetching}>
      <FormProvider {...form}>
        <div className="xl:grid xl:grid-cols-10 gap-4 h-full w-full">
          <div className="xl:col-span-2">
            <div
              style={{
                position: "sticky",
                top: "80px",
              }}
            >
              <OrderDetail
                active={active}
                handleActive={(val) => setActive(val)}
                handleUpdate={_onUpdate}
                data={data?.Data}
                loading={isFetching}
                refetch={refetch}
                RoleID={newUser?.UserGroupId}
              />
            </div>
          </div>
          <div className="col-span-8 tableBoxPag !h-fit !pb-0 xl:ml-6">
            <Collapse
              expandIconPosition="right"
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              defaultActiveKey={["1", "2", "3", "4", "5", "6", "7"]}
            >
              <Panel
                header={`M?? ????n h??ng (${
                  data?.Data?.MainOrderCodes?.length || 0
                })`}
                key="1"
              >
                <div
                  id="order-code"
                  className={clsx(className, active === 0 && "", "px-4")}
                >
                  <OrderCode
                    data={data?.Data}
                    loading={isFetching}
                    refetch={refetch}
                    RoleID={newUser?.UserGroupId}
                  />
                </div>
              </Panel>
              <Panel
                header={`M?? v???n ????n (${data?.Data?.SmallPackages.length || 0})`}
                key="2"
              >
                <div
                  id="transfer-code-list"
                  className={clsx(className, "!p-2 !py-0", active === 1 && "")}
                >
                  <OrderTransferCodeList
                    data={data?.Data}
                    loading={isFetching}
                    handleUpdate={_onUpdate}
                    RoleID={newUser?.UserGroupId}
                  />
                </div>
              </Panel>
              <Panel
                header={`Danh s??ch s???n ph???m (${
                  data?.Data?.Orders?.length || 0
                })`}
                key="3"
              >
                <div
                  id="product-list"
                  className={clsx(className, active === 2 && "", "!px-2 !py-0")}
                >
                  <OrderProductList
                    data={data?.Data}
                    loading={isFetching}
                    refetch={refetch}
                    RoleID={newUser?.UserGroupId}
                  />
                </div>
              </Panel>
              <Panel header="Chi ph?? ????n h??ng" key="4">
                <div
                  id="surcharge-list"
                  className={clsx(className, "p-2 !pt-0", active === 3 && "")}
                >
                  <OrderSurChargeList
                    data={data?.Data}
                    loading={isFetching}
                    handleUpdate={_onUpdate}
                    RoleID={newUser?.UserGroupId}
                  />
                  <OrderCost
                    loading={isFetching}
                    data={data?.Data}
                    RoleID={newUser?.UserGroupId}
                  />
                </div>
              </Panel>
              <Panel header="Nh??n vi??n x??? l??" key="5">
                <div
                  id="handling-staff"
                  className={clsx(className, active === 5 && "", "px-4 !pt-0")}
                >
                  <OrderHandlingStaff
                    data={data?.Data}
                    userSaleCatalogue={userSale}
                    userOrderCatalogue={userOrder}
                    loading={isFetching}
                    RoleID={newUser?.UserGroupId}
                  />
                </div>
              </Panel>
              <Panel header="Th??ng tin ?????t h??ng" key="6">
                <div
                  id="order-info"
                  className={clsx(className, active === 6 && "")}
                >
                  <OrderInfo data={data?.Data} loading={isLoading} />
                </div>
              </Panel>
              <Panel header="L???ch s???" key="7">
                <div
                  id="history"
                  className={clsx(className, active === 7 && "")}
                >
                  <OrderHistory data={data?.Data} loading={isFetching} />
                </div>
              </Panel>
            </Collapse>
          </div>
        </div>
      </FormProvider>
      {data && (
        <MessageControlManager
          clientId={data.Data.UID}
          mainOrderId={+query?.id}
        />
      )}
    </Spin>
  );
};

Index.displayName = SEOConfigs.oder.detail;
Index.breadcrumb = breadcrumb.order.orderList.detail;
Index.Layout = Layout;

export default Index;
