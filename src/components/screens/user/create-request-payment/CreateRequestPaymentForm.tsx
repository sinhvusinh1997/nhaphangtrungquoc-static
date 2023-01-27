import clsx from "clsx";
import { isNumber } from "lodash";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { payHelp } from "~/api";
import {
  FormInput,
  FormInputNumber,
  FormTextarea,
  showToast,
} from "~/components";
import { IconButton } from "~/components/globals/button/IconButton";
import { useDeepEffect } from "~/hooks";
import { selectUser, useAppSelector } from "~/store";

const boxContent = "col-span-1 p-4";

export const CreateRequestPaymentForm = () => {
  const { user: UserData } = useAppSelector(selectUser);
  if (!UserData) return null;

  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, watch, setValue } =
    useForm<TCreateRequestPaymentOrder>({
      mode: "onBlur",
      defaultValues: {
        UserName: UserData.UserName,
        PayHelpDetails: [
          {
            desc2: "",
            desc1: null,
          },
        ],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "PayHelpDetails",
  });

  const handleBill = (type: "add" | "remove", index: number = -1) => {
    if (type === "add") {
      append({
        desc2: "",
        desc1: null,
      });
    } else {
      if (fields.length > 1) {
        remove(index);
      } else {
        toast.warning("Phải có ít nhất 1 hoá đơn");
      }
    }
  };

  // thực hiện tính tổng tiền
  // ===== BEGIN =====
  const [totalPrice, setTotalPrice] = useState<number>(null);

  useDeepEffect(() => {
    const sumTotalPrice = watch("PayHelpDetails").reduce((prev, cur) => {
      // prev = null và price = null hoặc prev = number và price = null
      if (
        (!isNumber(prev) && !isNumber(cur.desc1)) ||
        (isNumber(prev) && !isNumber(cur.desc1))
      ) {
        return prev;
      }
      // prev = null và price = number
      else if (!isNumber(prev) && isNumber(cur.desc1)) {
        return cur.desc1;
      }
      // prev = number và price = number
      else {
        return prev + cur.desc1;
      }
    }, null as number);

    if (sumTotalPrice !== totalPrice) {
      setTotalPrice(sumTotalPrice);
    }

    // trường hợp = null và 0
    if (sumTotalPrice === null || sumTotalPrice === 0) {
      setValue("Currency", sumTotalPrice);
      setValue("TotalPrice", sumTotalPrice);
      setValue("TotalPriceVND", sumTotalPrice);
    }
  }, [watch("PayHelpDetails").map((item) => item.desc1)]);
  // ===== END =====

  useEffect(() => {
    (async () => {
      // kiểm tra khác 0 và null
      if (totalPrice) {
        try {
          const currency = await (
            await payHelp.getExchangeRate(totalPrice)
          ).Data;

          setValue("TotalPrice", totalPrice);
          setValue("TotalPriceVND", totalPrice * currency);
          setValue("Currency", currency);
        } catch (error) {
          showToast({
            title: (error as any)?.response?.data?.ResultCode,
            message: (error as any)?.response?.data?.ResultMessage,
            type: "error",
          });
        }
      }
    })();
  }, [totalPrice]);

  // add item
  const queryClient = useQueryClient();
  const mutationAdd = useMutation((Data: any) => payHelp.create({ ...Data }), {
    // refresh item + table data after adding successfully
    onSuccess: async () => {
      mutationAdd.reset();
      toast.success("Gửi yêu cầu thanh toán hộ thành công");
      queryClient.invalidateQueries({ queryKey: "menuData" });
      Router.push("/user/request-list");
      setLoading(false);
    },
    onError: (error) =>
      showToast({
        title: (error as any)?.response?.data?.ResultCode,
        message: (error as any)?.response?.data?.ResultMessage,
        type: "error",
      }),
  });

  const _onPress = (data: TCreateRequestPaymentOrder) => {
    setLoading(true);
    mutationAdd.mutate(data);
  };

  return (
    <div
      className="grid grid-cols-2 gap-6"
      style={{ pointerEvents: loading ? "none" : "all" }}
    >
      <div
        className={clsx(
          boxContent,
          "xl:mb-0 mb-4 tableBox max-h-[800px] overflow-hidden"
        )}
      >
        <div className="col-span-2 flex items-end border-b pb-4 border-[#cdd6cd] mb-4">
          {/* <span className={clsx(titleTag, titleIcon)}>
						<i className="fas fa-user"></i>
					</span> */}
          <div className="w-full">
            <FormInput
              control={control}
              name="UserName"
              label="Username"
              placeholder=""
              rules={{ required: "This field is required" }}
              disabled
            />
          </div>
          <div className="w-full flex justify-end items-center">
            <IconButton
              onClick={() => handleBill("add")}
              btnClass=""
              icon="far fa-plus"
              title="Thêm yêu cầu"
              showLoading
              toolip=""
              green
            />
          </div>
        </div>
        <div className="col-span-2">
          <div className="max-h-[600px] overflow-y-auto pr-4">
            {fields.map((item, index) => (
              <div
                key={item?.id}
                className={clsx("flex", index !== 0 && "mt-4")}
              >
                <FormInputNumber
                  control={control}
                  name={`PayHelpDetails.${index}.desc1` as const}
                  placeholder="Giá tiền (¥)"
                  label=""
                  prefix="¥ "
                  hideError
                  rules={{ required: "This field is required" }}
                />
                <div className="w-4" />
                <FormInput
                  control={control}
                  name={`PayHelpDetails.${index}.desc2` as const}
                  placeholder="Nội dung"
                />
                <IconButton
                  onClick={() => handleBill("remove", index)}
                  btnClass="ml-2"
                  icon="fas fa-minus-circle !mr-1 translate-y-[2px]"
                  title=""
                  showLoading
                  toolip=""
                  red
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={clsx(boxContent, "h-fit tableBox !mb-0")}>
        <div className="col-span-1 xl:grid grid-cols-2 gap-4">
          <div className="col-span-1 flex items-center">
            {/* <span className={clsx(titleIcon, titleTag)}>
							<i className="fas fa-usd-circle"></i>
						</span> */}
            <div className="w-full">
              <FormInputNumber
                control={control}
                name="TotalPrice"
                label="Tổng tiền Tệ (¥)"
                prefix="¥ "
                placeholder=""
                disabled
                required={false}
              />
            </div>
          </div>
          <div className="col-span-1 flex items-center">
            {/* <span className={clsx(titleTag, titleIcon)}>
							<i className="fas fa-usd-circle"></i>
						</span> */}
            <div className="w-full">
              <FormInputNumber
                control={control}
                name="TotalPriceVND"
                label="Tổng tiền (VNĐ)"
                placeholder=""
                suffix=" VNĐ"
                disabled
                required={false}
              />
            </div>
          </div>
        </div>
        <div className="col-span-2 my-4 flex items-center">
          {/* <span className={clsx(titleTag, titleIcon)}>
						<i className="fas fa-badge-percent"></i>
					</span> */}
          <div className="mt-2 w-full">
            <FormInputNumber
              control={control}
              name="Currency"
              label="Tỉ Giá"
              placeholder=""
              required={false}
              disabled
            />
          </div>
        </div>
        <div className="col-span-2">
          {/* <div className="flex items-center my-2">
						<span className={clsx(titleTag, titleIcon)}>
							<i className="fas fa-sticky-note"></i>
						</span>
					</div> */}
          <div className="mt-2 w-full">
            <FormTextarea
              control={control}
              name="Note"
              label="Ghi chú"
              placeholder=""
              required={false}
            />
          </div>
        </div>
        <div className="col-span-2 flex justify-end">
          <IconButton
            onClick={handleSubmit(_onPress)}
            btnClass="mt-4 !bg-orange !text-white"
            icon={loading ? "fas fa-sync fa-spin" : "fas fa-check-circle"}
            title="Gửi yêu cầu"
            showLoading
            toolip=""
          />
        </div>
      </div>
    </div>
  );
};
