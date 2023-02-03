import router from "next/router";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { transportationOrder } from "~/api";
import {
  DepositDetail,
  FormInput,
  FormInputNumber,
  FormSelect,
  FormTextarea,
  IconButton,
  toast,
} from "~/components";
import { orderStatusData } from "~/configs/appConfigs";
import { useDeepEffect } from "~/hooks";
import { useCatalogue } from "~/hooks/useCatalogue";

type TProps = {
  defaultValues: TUserDeposit;
  shippingTypeToWarehouseCatalogue: TBaseReponseParams[];
  loading: boolean;
  RoleID: number;
};

export const DepositListForm: React.FC<TProps> = ({
  defaultValues,
  shippingTypeToWarehouseCatalogue,
  loading,
  RoleID,
}) => {
  const [canNote, setCanNote] = useState(null);
  const { handleSubmit, reset, watch, setValue, control, getValues } =
    useForm<TUserDeposit>({
      mode: "onBlur",
      defaultValues,
    });

  useDeepEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues]);

  const mutationUpdate = useMutation(transportationOrder.update, {
    onSuccess: () => {
      toast.success("Cập nhật ký gửi thành công");
    },
    onError: toast.error,
  });

  const _onPress = (data: TUserDeposit) => {
    mutationUpdate.mutateAsync(data);
  };

  const { warehouseTQ, warehouseVN } = useCatalogue({
    warehouseTQEnabled: true,
    warehouseVNEnabled: true,
  });

  const handleSetValue = useCallback((key: keyof TUserDeposit, value: any) => {
    setValue(key, value);
  }, []);

  const handleCount = (key: keyof TUserDeposit, value: number) => {
    const countValueWeight =
      getValues("PayableWeight") * getValues("FeeWeightPerKg");
    const countValueVolume =
      getValues("VolumePayment") * getValues("FeePerVolume");

    handleSetValue(
      "DeliveryPrice",
      countValueVolume > countValueWeight ? countValueVolume : countValueWeight
    );
    const countValueCODFee = getValues("CODFeeTQ") * defaultValues?.Currency;
    handleSetValue("CODFee", countValueCODFee);

    const countValueTotal = [
      "DeliveryPrice",
      "IsCheckProductPrice",
      "IsPackedPrice",
      "InsuranceMoney",
      "CODFee",
    ].reduce((a, b: any) => a + getValues(b), 0);

    handleSetValue(
      "TotalPriceVND",
      countValueTotal *
        (!defaultValues?.FeeWeightCK ? 1 : defaultValues?.FeeWeightCK / 100)
    );
  };

  return (
    <div className="xl:grid xl:grid-cols-10 xl:gap-4 h-full w-full">
      <div className="tableBox xl:block md:grid md:grid-cols-3 col-span-3 gap-4 h-fit p-5 xl:sticky xl:top-[80px] md:mb-4 xl:mb-0">
        <div className="col-span-2 md:col-span-3 text-base xl:mb-4 font-bold py-2 uppercase border-b border-main">
          Thông tin
        </div>
        <div className="col-span-2 md:col-span-1 xl:pb-4">
          <FormInput
            control={control}
            name="UserName"
            label="Username"
            placeholder=""
            disabled
            required={false}
          />
        </div>
        <div className="col-span-2 md:col-span-1 xl:pb-4">
          <FormSelect
            control={control}
            name="Status"
            data={orderStatusData.slice(1)}
            placeholder=""
            label="Trạng thái"
            defaultValue={
              defaultValues?.Status &&
              defaultValues.StatusName && {
                id: defaultValues?.Status,
                name: orderStatusData.find(
                  (x) => x.id === defaultValues?.Status
                )?.name,
              }
            }
            callback={(val) => setCanNote(val === 1 ? 1 : null)}
            rules={{ required: "Không bỏ trống trạng thái" }}
          />
        </div>
        <div className="col-span-2 md:col-span-1 xl:pb-4">
          <FormSelect
            control={control}
            name="ShippingTypeId"
            data={shippingTypeToWarehouseCatalogue}
            placeholder=""
            label="Hình thức vận chuyển"
            select={{ label: "Name", value: "Id" }}
            defaultValue={
              defaultValues?.ShippingTypeId &&
              defaultValues?.ShippingTypeName && {
                Id: defaultValues?.ShippingTypeId,
                Name: defaultValues?.ShippingTypeName,
              }
            }
            rules={{ required: "Không bỏ trống hình thức vận chuyển" }}
          />
        </div>
        <div className="col-span-2 md:col-span-1 xl:pb-4">
          <FormSelect
            control={control}
            data={warehouseTQ}
            name="WareHouseFromId"
            label="Kho Trung Quốc"
            placeholder=""
            defaultValue={
              defaultValues?.WareHouseFromId &&
              defaultValues?.WareHouseFrom && {
                Id: defaultValues?.WareHouseFromId,
                Name: defaultValues?.WareHouseFrom,
              }
            }
            select={{ label: "Name", value: "Id" }}
          />
        </div>
        <div className="col-span-2 md:col-span-1 xl:pb-4">
          <FormSelect
            control={control}
            data={warehouseVN}
            name="WareHouseId"
            label="Kho Việt Nam"
            placeholder=""
            defaultValue={
              defaultValues?.WareHouseId &&
              defaultValues?.WareHouseTo && {
                Id: defaultValues?.WareHouseId,
                Name: defaultValues?.WareHouseTo,
              }
            }
            select={{ label: "Name", value: "Id" }}
          />
        </div>
        <div className="col-span-1 xl:pb-4">
          <FormInputNumber
            control={control}
            name="TotalPriceVND"
            label="Tổng tiền"
            placeholder=""
            required={false}
            disabled
          />
        </div>
        <div className="col-span-2 md:col-span-3 pt-4 border-t border-main">
          {(RoleID === 1 || RoleID === 3) && (
            <IconButton
              onClick={handleSubmit(_onPress)}
              showLoading
              icon="fas fa-edit"
              title="Cập nhật"
              toolip=""
              btnClass="!mr-4"
            />
          )}
          <IconButton
            onClick={() => router.back()}
            showLoading
            icon="fas fa-reply-all"
            title="Trở về"
            toolip=""
          />
        </div>
      </div>

      <div className="col-span-7 tableBoxPag gap-4 h-fit xl:ml-6 grid">
        <div className="tableBox grid p-5 gap-4">
          <div className="col-span-10 text-base font-bold py-2 uppercase border-b border-main">
            Danh sách sản phẩm
          </div>
          <div className="col-span-10 pb-4">
            <DepositDetail data={[defaultValues]} />
          </div>
        </div>
        <div className="tableBox grid p-5 gap-4">
          <div className="col-span-2 text-base font-bold py-2 uppercase border-b border-main">
            Chi tiết đơn hàng
          </div>
          <div className="col-span-1 pb-2">
            <FormInputNumber
              control={control}
              name="PayableWeight"
              suffix=" Kg"
              label="Cân nặng (Kg)"
              placeholder=""
              required={false}
              disabled
            />
          </div>
          <div className="col-span-1 pb-4">
            <FormInputNumber
              suffix=" VNĐ"
              control={control}
              name="FeeWeightPerKg"
              label="Đơn giá cân nặng (VNĐ) "
              placeholder=""
              required={false}
              callback={(val) => {
                handleCount("FeeWeightPerKg", val);
              }}
            />
          </div>
          <div className="col-span-1 pb-2">
            <FormInputNumber
              control={control}
              name="VolumePayment"
              suffix=" &#x33A5;"
              label="Thể tích (&#x33A5;)"
              placeholder=""
              required={false}
              disabled
            />
          </div>
          <div className="col-span-1 pb-4">
            <FormInputNumber
              suffix=" VNĐ"
              control={control}
              name="FeePerVolume"
              label={`Đơn giá thể tích (VNĐ)`}
              placeholder=""
              required={false}
              callback={(val) => {
                handleCount("FeePerVolume", val);
              }}
            />
          </div>
          <div className="col-span-2 pb-4">
            <FormInputNumber
              suffix=" VNĐ"
              control={control}
              name="DeliveryPrice"
              label={`Phí vận chuyển (VNĐ) (CK: ${
                defaultValues?.FeeWeightCK ?? 0
              }%)`}
              placeholder=""
              disabled
              required={false}
            />
          </div>
          <div className="col-span-1 pb-4">
            <FormInputNumber
              prefix="¥ "
              control={control}
              name="CODFeeTQ"
              label="Phí COD Trung Quốc (¥)"
              placeholder=""
              required={false}
              callback={(val) => {
                handleCount("CODFeeTQ", val);
              }}
            />
          </div>
          <div className="col-span-1 pb-4">
            <FormInputNumber
              suffix=" VNĐ"
              control={control}
              name="CODFee"
              label="Phí COD Trung Quốc (VNĐ)"
              placeholder=""
              disabled
              required={false}
            />
          </div>
          <div className="col-span-2 pb-2">
            <FormInputNumber
              control={control}
              name="IsCheckProductPrice"
              suffix=" VNĐ"
              label="Phí kiểm hàng"
              placeholder=""
              required={false}
              callback={(val) => {
                handleCount("IsCheckProductPrice", val);
                handleSetValue("IsCheckProduct", val > 0 ? true : false);
              }}
            />
          </div>
          <div className="col-span-2 pb-2">
            <FormInputNumber
              control={control}
              name="IsPackedPrice"
              suffix=" VNĐ"
              label="Phí đóng gỗ"
              placeholder=""
              required={false}
              callback={(val) => {
                handleCount("IsPackedPrice", val);
                handleSetValue("IsPacked", val > 0 ? true : false);
              }}
            />
          </div>
          <div className="col-span-2 pb-2">
            <FormInputNumber
              control={control}
              name="InsuranceMoney"
              suffix=" VNĐ"
              label="Phí bảo hiểm"
              placeholder=""
              required={false}
              callback={(val) => {
                handleCount("InsuranceMoney", val);
                handleSetValue("IsInsurance", val > 0 ? true : false);
              }}
            />
          </div>
          <div className="col-span-1 pb-2">
            <FormTextarea
              control={control}
              name="Note"
              label="Ghi chú của khách hàng"
              placeholder=""
              required={false}
              disabled
            />
          </div>
          <div className="col-span-1 pb-2">
            <FormTextarea
              control={control}
              name="StaffNote"
              label="Ghi chú của nhân viên"
              placeholder=""
              required={false}
            />
          </div>
          <div className="col-span-2 pb-2">
            <FormTextarea
              control={control}
              name="CancelReason"
              placeholder=""
              label="Lý do hủy đơn"
              required={false}
              disabled={canNote === 1 ? false : true}
            />
          </div>
          <div className="col-span-2 pt-4 border-t border-main xl:hidden">
            {(RoleID === 1 || RoleID === 3) && (
              <IconButton
                onClick={handleSubmit(_onPress)}
                showLoading
                icon="fas fa-edit"
                title="Cập nhật"
                toolip=""
                btnClass="!mr-4"
              />
            )}
            <IconButton
              onClick={() => router.back()}
              showLoading
              icon="fas fa-reply-all"
              title="Trở về"
              toolip=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};
