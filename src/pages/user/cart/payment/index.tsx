import { Empty } from "antd";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueries, useQuery, useQueryClient } from "react-query";
import {
  orderShopTemp,
  shipping,
  user,
  warehouseFrom,
  warehouseTo,
} from "~/api";
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
import { useCatalogue, useDeepEffect } from "~/hooks";
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

  const { data: userPayment } = useQuery(
    "userPayment",
    () => user.getByID(orderShopTempsData[0]?.UID),
    {
      refetchOnWindowFocus: false,
      enabled: !!orderShopTempsData[0]?.UID,
    }
  );

  const { data: warehouseFromData } = useQuery(
    ["warehouseFromData"],
    () => warehouseFrom.getList().then((res) => res.Data.Items),
    {
      refetchOnWindowFocus: false,
    }
  );

  const { data: warehouseToData } = useQuery(
    ["warehouseToData"],
    () => warehouseTo.getList().then((res) => res.Data.Items),
    {
      refetchOnWindowFocus: false,
    }
  );

  const { data: shippingType } = useQuery(
    ["shippingType"],
    () =>
      shipping
        .getList({
          PageSize: 9999,
          PageIndex: 1,
        })
        .then((res) => res.Data.Items),
    {
      refetchOnReconnect: false,
    }
  );

  const { control, handleSubmit, reset, getValues, setValue } =
    useForm<TUserPayment>({
      mode: "onBlur",
      defaultValues: {
        ShopPayments: orderShopTempsData.map((data) => ({
          ShopId: data?.Id,
          ShippingType: shippingType?.find(
            (x) => x.Id === Number(userPayment?.Data?.ShippingType)
          )?.Id,
          WarehouseTQ: warehouseFromData?.find(
            (x) => x.Id === Number(userPayment?.Data?.WarehouseFrom)
          )?.Id,
          WarehouseVN: warehouseToData?.find(
            (x) => x.Id === Number(userPayment?.Data?.WarehouseTo)
          )?.Id,
        })),
      },
    });

  useDeepEffect(() => {
    if (
      !!warehouseToData?.length &&
      !!warehouseFromData?.length &&
      !!shippingType?.length &&
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
          ShippingType: shippingType?.find(
            (x) => x.Id === Number(userPayment?.Data?.ShippingType)
          )?.Id,
          WarehouseTQ: warehouseFromData?.find(
            (x) => x.Id === Number(userPayment?.Data?.WarehouseFrom)
          )?.Id,
          WarehouseVN: warehouseToData?.find(
            (x) => x.Id === Number(userPayment?.Data?.WarehouseTo)
          )?.Id,
        })),
      });
    }
  }, [[warehouseFromData, warehouseToData, shippingType, orderShopTempsData]]);

  const mutationPayment = useMutation(orderShopTemp.payment);

  const onPress = async (data: TUserPayment) => {
    setValue(
      "Address",
      `${getValuesAddress("address")}, ${getValuesAddress(
        "city"
      )}, ${getValuesAddress("districts")}`
    );

    if (!data?.IsAgreement) {
      toast.warning("Vui l??ng x??c nh???n tr?????c khi thanh to??n");
      return;
    }

    if (
      getValuesAddress("address") === null ||
      getValuesAddress("city") === null ||
      getValuesAddress("districts") === null
    ) {
      toast.warning("Vui l??ng ch???n ?????a ch??? nh??n h??ng!");
      return;
    }

    const shopPayments = getValues("ShopPayments");
    for (let i in shopPayments) {
      if (
        !shopPayments[i].ShippingType ||
        !shopPayments[i].WarehouseTQ ||
        !shopPayments[i].WarehouseVN
      ) {
        toast.warning("Kh??ng th??? load ... vui l??ng reload page!");
        return;
      }
    }

    setLoadingPayment(true);

    mutationPayment
      .mutateAsync({ ...data, Address: getValues("Address") })
      .then(() => {
        toast.success("?????t h??ng th??nh c??ng!");
        queryClient.invalidateQueries({ queryKey: "menuData" });
        router.push("/user/order-list");
        ids.map((id) => dispatch(deleteOrderShopTempById(id)));
        setLoadingPayment(false);
      })
      .catch((error) => {
        toast.error("Vui l??ng th??? l???i!");
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
        <div className="titlePageUser">Thanh to??n</div>
        <CartSteps current={2} />
        {!ids.length ||
          (!orderShopTempsData?.[0] && (
            <Empty description="Kh??ng t??m th???y d??? li???u n??o trong thanh to??n" />
          ))}
      </div>
      {!!ids.length && !!orderShopTempsData?.[0] && (
        <React.Fragment>
          <div className="grid grid-cols-10 gap-4">
            <div className="xl:col-span-7 col-span-10 flex flex-col gap-4 order-1">
              {orderShopTempsData.map((orderShopTempData, index) => (
                <Fragment key={`${index}-${orderShopTempData?.Id}`}>
                  <PaymentOrderInfo
                    {...{
                      index,
                      orderShopTempData,
                      warehouseFromData,
                      warehouseToData,
                      shippingType,
                      userPayment,
                      control,
                    }}
                  />
                </Fragment>
              ))}
            </div>
            <div className="xl:col-span-3 col-span-10 flex flex-col order-2">
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
