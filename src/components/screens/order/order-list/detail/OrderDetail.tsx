import { Affix } from "antd";
import clsx from "clsx";
import router from "next/router";
import { Link } from "rc-scroll-anim";
import React, { FC } from "react";
import { useFormContext } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";
import { mainOrder, order } from "~/api";
import { FormSelect } from "~/components";
import { IconButton } from "~/components/globals/button/IconButton";
import { orderStatus, statusData } from "~/configs/appConfigs";
import { useCatalogue } from "~/hooks/useCatalogue";
import { _format } from "~/utils";

type TProps = {
  active: number;
  handleActive: (active: number) => void;
  handleUpdate: (data: TOrder) => Promise<void>;
  data: TOrder;
  loading: boolean;
  disabledPayment?: boolean;
  refetch?: any;
  RoleID: number;
};

const nameContent =
  "w-2/4 py-1 text-sm font-bold text-[#3E3C6A] tracking-normal";
const contentItem = "flex items-center border-b border-[#EDF1F7] py-[4px]";
const contentValue = "w-2/4 py-1 text-sm font-medium text-black";
const linkMenu = "cursor-pointer py-[2px] text-[#0000005a] text-sm block";
const linkMenuActive = "border-l-2 border-orange !text-black font-medium";

const IsShouldAffix: React.FC<{}> = ({ children }) => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 1280px)" });
  return isBigScreen ? (
    <Affix offsetTop={20}>{children}</Affix>
  ) : (
    <>{children}</>
  );
};

const ComponentAffix: React.FC<TProps> = ({
  data,
  loading,
  active,
  handleActive,
  handleUpdate,
  disabledPayment,
  refetch,
  RoleID,
}) => {
  const { warehouseTQ, warehouseVN, shippingTypeToWarehouse } = useCatalogue({
    warehouseTQEnabled: !!RoleID,
    warehouseVNEnabled: !!RoleID,
    shippingTypeToWarehouseEnabled: !!RoleID,
  });

  const { handleSubmit, control } = useFormContext<TOrder>();

  return (
    <>
      <div className="tableBox p-4 md:mb-4 xl:mb-0">
        <div className="md:grid grid-cols-2 gap-4 xl:block">
          <div className="col-span-1">
            {!data?.IsCheckNotiPrice && data?.OrderType === 3 && (
              <div className={clsx(contentItem)}>
                <div className={clsx(nameContent)}>B??o gi??: </div>
                <div className={clsx(contentValue)}>
                  <IconButton
                    onClick={async () => {
                      await mainOrder
                        .updateNotiPrice({ ...data, IsCheckNotiPrice: true })
                        .then(() => {
                          toast.success("???? b??o gi?? cho kh??ch!");
                          refetch();
                        });
                    }}
                    title="B??o gi??"
                    icon="far fa-credit-card"
                    btnClass="mr-4 mb-4 lg:mb-0"
                    btnIconClass="mr-4"
                    showLoading
                    toolip="Click ????? b??o gi?? cho kh??ch"
                    yellow
                    disabled={
                      data?.IsCheckNotiPrice ||
                      !(RoleID === 1 || RoleID === 3 || RoleID === 4)
                    }
                  />
                </div>
              </div>
            )}
            <div className={clsx(contentItem)}>
              <div className={clsx(nameContent)}>Order ID</div>
              <div className={clsx(contentValue)}>{data?.Id}</div>
            </div>
            <div className={clsx(contentItem)}>
              <div className={clsx(nameContent)}>Loa??i ????n ha??ng</div>
              <div className={clsx(contentValue)}>{data?.OrderTypeName}</div>
            </div>
            <div className={clsx(contentItem)}>
              <div className={clsx(nameContent)}>T????ng ti????n</div>
              <div className={clsx(contentValue)}>
                {_format.getVND(data?.TotalOrderAmount)}
              </div>
            </div>
            <div className={clsx(contentItem)}>
              <div className={clsx(nameContent)}>??a?? tra??</div>
              <div className={clsx(contentValue)}>
                {_format.getVND(data?.Deposit)}
              </div>
            </div>
            {/* <div className={clsx(contentItem)}>
              <div className={clsx(nameContent)}>Ti???n ph???i c???c</div>
              <div className={clsx(contentValue, "text-[#008000]")}>
                {_format.getVND(data?.AmountDeposit)}
              </div>
            </div> */}
            <div className={clsx(contentItem)}>
              <div className={clsx(nameContent)}>Co??n la??i</div>
              <div className={clsx(contentValue, "!text-warning")}>
                {_format.getVND(data?.RemainingAmount)}
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className={clsx(contentItem, "xl:mt-4 border-none")}>
              <FormSelect
                control={control}
                name="Status"
                label="Trang th??i"
                placeholder=""
                data={orderStatus?.slice(1, orderStatus.length - 1)}
                defaultValue={orderStatus
                  ?.slice(1, orderStatus.length - 1)
                  .find((x) => x.id === data?.Status)}
              />
            </div>
            <div className={clsx(contentItem, "border-none")}>
              <FormSelect
                control={control}
                name="FromPlace"
                label="Kho TQ"
                placeholder=""
                data={warehouseTQ}
                select={{ label: "Name", value: "Id" }}
                defaultValue={{
                  Id: data?.FromPlace,
                  Name: data?.FromPlaceName,
                }}
              />
            </div>
            <div className={clsx(contentItem, "border-none")}>
              <FormSelect
                control={control}
                name="ReceivePlace"
                label="Nh????n ha??ng ta??i"
                placeholder=""
                data={warehouseVN}
                select={{ label: "Name", value: "Id" }}
                defaultValue={{
                  Id: data?.ReceivePlace,
                  Name: data?.ReceivePlaceName,
                }}
              />
            </div>
            <div className={clsx(contentItem, "border-none")}>
              <FormSelect
                control={control}
                name="ShippingType"
                label="Ph????ng th????c v????n chuy????n"
                placeholder=""
                data={shippingTypeToWarehouse}
                select={{ label: "Name", value: "Id" }}
                defaultValue={{
                  Id: data?.ShippingType,
                  Name: data?.ShippingTypeName,
                }}
              />
            </div>
          </div>
        </div>
        {(RoleID === 1 || RoleID === 3 || RoleID === 4) && (
          <div className="flex items-center justify-center jus mt-3 pt-3 m-auto border-t border-[#edf1f7]">
            <IconButton
              onClick={handleSubmit(handleUpdate)}
              icon="fas fa-pencil"
              title="C???p nh???t"
              btnClass="mr-2 !bg-orange !text-white"
              showLoading
              toolip=""
            />
            {!disabledPayment &&
              (RoleID === 1 || RoleID === 3) &&
              data?.TotalOrderAmount !== data?.Deposit && (
                <a
                  style={{
                    pointerEvents:
                      data?.TotalOrderAmount === data?.Deposit ? "none" : "all",
                  }}
                >
                  <IconButton
                    onClick={() => {
                      const id = toast.loading("??ang x??? l?? ...");
                      mainOrder
                        .payment({
                          Id: data?.Id,
                          Note: undefined,
                          PaymentMethod: data?.Status === 0 ? 2 : 1,
                          PaymentType: 1,
                          Amount:
                            data?.Status === 0
                              ? data?.AmountDeposit
                              : data?.RemainingAmount,
                        })
                        .then(() => {
                          toast.update(id, {
                            render: `${
                              data?.Status === 0
                                ? "?????t c???c th??nh c??ng!"
                                : "Thanh to??n th??nh c??ng!"
                            }`,
                            autoClose: 0,
                            isLoading: false,
                            type: "success",
                          });
                          refetch();
                        })
                        .catch((error) => {
                          toast.update(id, {
                            render: (error as any)?.response?.data
                              ?.ResultMessage,
                            autoClose: 0,
                            isLoading: false,
                            type: "error",
                          });
                        });
                    }}
                    icon="fas fa-credit-card"
                    // title="Thanh to??n"
                    title={data?.Status === 0 ? "?????t c???c" : "Thanh to??n"}
                    showLoading
                    toolip=""
                    blue
                  />
                </a>
              )}
          </div>
        )}
      </div>
      <div className="tableBox xl:block hidden my-4 py-3">
        <ul className="mb-0">
          <li>
            <Link
              onFocus={() => handleActive(0)}
              offsetTop={120}
              to="order-code"
              className={clsx(linkMenu, active === 0 && linkMenuActive)}
            >
              <a className="pl-2">M?? ????n h??ng</a>
            </Link>
          </li>
          <li>
            <Link
              onFocus={() => handleActive(1)}
              offsetTop={120}
              to="transfer-code-list"
              className={clsx(linkMenu, active === 1 && linkMenuActive)}
            >
              <a className="pl-2">M?? v???n ????n</a>
            </Link>
          </li>
          <li>
            <Link
              onFocus={() => handleActive(2)}
              offsetTop={120}
              to="product-list"
              className={clsx(linkMenu, active === 2 && linkMenuActive)}
            >
              <a className="pl-2">Danh s??ch s???n ph???m</a>
            </Link>
          </li>
          <li>
            <Link
              onFocus={() => handleActive(4)}
              offsetTop={120}
              to="surcharge-list"
              className={clsx(linkMenu, active === 4 && linkMenuActive)}
            >
              <a className="pl-2">Chi ph?? ????n h??ng</a>
            </Link>
          </li>
          <li>
            <Link
              onFocus={() => handleActive(6)}
              offsetTop={120}
              to="order-info"
              className={clsx(linkMenu, active === 6 && linkMenuActive)}
            >
              <a className="pl-2">Th??ng tin ng?????i ?????t - nh???n h??ng</a>
            </Link>
          </li>
          <li>
            <Link
              onFocus={() => handleActive(7)}
              offsetTop={120}
              to="history"
              className={clsx(linkMenu, active === 7 && linkMenuActive)}
            >
              <a className="pl-2">L???ch s??? thanh to??n - thay ?????i</a>
            </Link>
          </li>
        </ul>
      </div>

      <IconButton
        onClick={() =>
          router.push(
            `/manager/order/order-list${data?.OrderType === 3 ? "?q=3" : ""}`
          )
        }
        // onClick={() => router.back()}
        icon="fas fa-undo-alt"
        title="V??? danh s??ch"
        btnClass="mr-2 !bg-orange !text-white md:hidden xl:block"
        showLoading
        toolip=""
      />
    </>
  );
};

export const OrderDetail: FC<TProps> = (props) => {
  return (
    <IsShouldAffix>
      <ComponentAffix {...props} />
    </IsShouldAffix>
  );
};
