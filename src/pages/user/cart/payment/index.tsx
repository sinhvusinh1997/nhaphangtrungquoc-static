import { Empty } from "antd";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueries, useQueryClient } from "react-query";
import { orderShopTemp } from "~/api";
import {
  CartSteps,
  ConfirmCompleteForm,
  PaymentOrderInfo,
  ReceiveInfoForm,
  StaticUserForm,
  toast,
  UserLayout,
  WareHouseInfo,
} from "~/components";
import { SEOHomeConfigs } from "~/configs/SEOConfigs";
import { useDeepEffect } from "~/hooks";
import {
  deleteOrderShopTempById,
  useAppDispatch,
  useAppSelector,
} from "~/store";
import { TNextPageWithLayout } from "~/types/layout";

const Index: TNextPageWithLayout & React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const ids = useAppSelector((state) => state.cart.selectedShopIds);
  const queryClient = useQueryClient();
  const [loadingPayment, setLoadingPayment] = useState(false);

  const orderShopTempsData = useQueries(
    ids.map((id) => ({
      queryKey: ["orderShopTempData", id],
      queryFn: () => orderShopTemp.getByID(id).then((res) => res.Data),
    }))
  ).map((res) => res.data);

  const { control, handleSubmit, reset, getValues, setValue } =
    useForm<TUserPayment>({
      mode: "onBlur",
      defaultValues: {
        ShopPayments: [],
      },
    });

  const {
    control: addressControl,
    getValues: getValuesAddress,
    watch: addressWatch,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      city: null,
      districts: null,
      address: null,
    },
  });

  // const {warehouseTQ, warehouseVN, shippingTypeToWarehouse} = useCatalogue({
  // 	warehouseTQEnabled: !!ids,
  // 	warehouseVNEnabled: !!ids,
  // 	shippingTypeToWarehouseEnabled: !!ids,
  // });

  useDeepEffect(() => {
    if (
      // !!warehouseTQ?.length &&
      // !!warehouseVN?.length &&
      // !!shippingTypeToWarehouse?.length &&
      !!orderShopTempsData.length &&
      !!orderShopTempsData?.[0]
    ) {
      const { FullName, Address, Email, Phone } = orderShopTempsData?.[0];
      reset({
        ReceiverFullName: FullName,
        ReceiverAddress: Address,
        ReceiverEmail: Email,
        ReceiverPhone: Phone,
        FullName: FullName,
        Address: Address,
        Email: Email,
        Phone: Phone,
        ShopPayments: orderShopTempsData.map((data) => ({
          ShopId: data?.Id,
          ShippingType: null,
          WarehouseTQ: null,
          WarehouseVN: null,
        })),
      });
    }
    // }, [warehouseTQ, warehouseVN, shippingTypeToWarehouse, orderShopTempsData]);
  }, [orderShopTempsData]);

  const mutationPayment = useMutation(orderShopTemp.payment);

  const onPress = async (data: TUserPayment) => {
    setValue(
      "Address",
      `${getValuesAddress("address")}, ${getValuesAddress(
        "city"
      )}, ${getValuesAddress("districts")}`
    );
    if (!data?.IsAgreement) {
      toast.warning("Vui lòng xác nhận trước khi thanh toán");
      return;
    }
    setLoadingPayment(true);
    mutationPayment
      .mutateAsync({ ...data, Address: getValues("Address") })
      .then(() => {
        toast.success("Đặt hàng thành công!");
        queryClient.invalidateQueries({ queryKey: "menuData" });
        router.push("/user/order-list");
        ids.map((id) => dispatch(deleteOrderShopTempById(id)));
        setLoadingPayment(false);
      })
      .catch((error) => {
        toast.error("Vui lòng thử lại!");
        setLoadingPayment(false);
      });
  };

  const listTotalPrice = orderShopTempsData.map((item) => item?.TotalPriceVND);
  let totalPrice = 0;
  listTotalPrice.forEach((item) => {
    totalPrice += item;
  });

  return (
    <div className="">
      <div className="">
        <div className="titlePageUser">Thanh toán</div>
        <CartSteps current={2} />
        {!ids.length ||
          (!orderShopTempsData?.[0] && (
            <Empty description="Không tìm thấy dữ liệu nào trong thanh toán" />
          ))}
      </div>
      {!!ids.length && !!orderShopTempsData?.[0] && (
        <React.Fragment>
          <div className="grid grid-cols-10 gap-4">
            <div className="sm:col-span-7 col-span-10 flex flex-col gap-4 sm:order-1 order-1">
              {orderShopTempsData.map((orderShopTempData, index) => (
                <Fragment key={`${index}-${orderShopTempData?.Id}`}>
                  <PaymentOrderInfo
                    {...{
                      index,
                      orderShopTempData,
                      // warehouseTQ,
                      // warehouseVN,
                      // shippingTypeToWarehouse,
                      control,
                    }}
                  />
                </Fragment>
              ))}
            </div>
            <div className="sm:col-span-3 col-span-10 flex flex-col sm:order-2 order-2">
              <WareHouseInfo />
              <div className="sticky top-4">
                <StaticUserForm control={control} />
                <ReceiveInfoForm
                  control={control}
                  addressControl={addressControl}
                  getValuesAddress={getValuesAddress}
                  addressWatch={addressWatch}
                />
                <ConfirmCompleteForm
                  totalPrice={totalPrice}
                  control={control}
                  loadingPayment={loadingPayment}
                  onPress={handleSubmit(onPress)}
                />
              </div>
            </div>
          </div>
          <div className="mb-4" />
        </React.Fragment>
      )}
    </div>
  );
};

Index.displayName = SEOHomeConfigs.shopping.payment;
Index.Layout = UserLayout;

export default Index;