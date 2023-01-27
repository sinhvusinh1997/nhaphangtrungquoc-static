import { Checkbox } from "antd";
import React from "react";
import {
  ActionButton,
  DataTable,
  FormCheckbox,
  FormInput,
  FormInputNumber,
} from "~/components";
import { toast } from "~/components/toast";
import { TControl } from "~/types/field";
import { TColumnsType, TTable } from "~/types/table";

type TProps = TControl<TUserCreateDeposit> &
  TTable<TUserCreateDepositBill> & {
    onPress: (data: TUserCreateDeposit) => void;
  };

export const CreateDepositTable: React.FC<TProps & { setValue }> = ({
  control,
  data,
  remove,
  setValue,
}) => {
  function test() {}

  function handleCheckbox(ctrl, e) {
    setValue(ctrl, e.target.checked);
  }

  const columns: TColumnsType<TUserCreateDepositBill> = [
    {
      dataIndex: "Id",
      title: "STT",
      align: "center",
      render: (_, __, index) => ++index,
    },
    {
      dataIndex: "OrderTransactionCode",
      title: "Mã kiện",
      align: "center",
      render: (_, __, index) => (
        <FormInput
          control={control}
          name={`smallPackages.${index}.OrderTransactionCode`}
          placeholder=""
          hideError
          rules={{
            required: "Mã kiện không được trống",
            validate: {
              check: (value) => {
                if (/\s/g.test(value)) {
                  return "Mã kiện đang trống!";
                }
              },
            },
          }}
        />
      ),
    },
    {
      dataIndex: "Category",
      title: "Loại sản phẩm",
      align: "center",
      render: (_, __, index) => (
        <FormInput
          control={control}
          name={`smallPackages.${index}.Category`}
          placeholder=""
        />
      ),
    },
    {
      dataIndex: "Amount",
      title: "Số lượng",
      align: "center",
      render: (_, __, index) => (
        <FormInputNumber
          control={control}
          name={`smallPackages.${index}.Amount`}
          placeholder=""
        />
      ),
    },
    {
      dataIndex: "FeeShip",
      title: (
        <>
          Phí COD <br /> Trung QUỐC (¥)
        </>
      ),
      align: "center",
      render: (_, __, index) => (
        <FormInputNumber
          prefix={"¥ "}
          control={control}
          name={`smallPackages.${index}.FeeShip`}
          placeholder=""
        />
      ),
    },
    {
      dataIndex: "IsCheckProduct",
      title: "Kiểm đếm",
      align: "center",
      render: (_, __, index) => (
        <Checkbox
          defaultChecked={false}
          onChange={(e) =>
            handleCheckbox(`smallPackages.${index}.IsCheckProduct`, e)
          }
        />
      ),
    },
    {
      dataIndex: "IsPacked",
      title: "Đóng gỗ",
      align: "center",
      render: (_, __, index) => (
        <Checkbox
          defaultChecked={false}
          onChange={(e) => handleCheckbox(`smallPackages.${index}.IsPacked`, e)}
        />
      ),
    },
    {
      dataIndex: "IsInsurance",
      title: "Bảo hiểm",
      align: "center",
      render: (_, __, index) => (
        <Checkbox
          defaultChecked={false}
          onChange={(e) =>
            handleCheckbox(`smallPackages.${index}.IsInsurance`, e)
          }
        />
      ),
    },
    {
      dataIndex: "UserNote",
      title: "Ghi chú",
      align: "center",
      render: (_, __, index) => (
        <FormInput
          control={control}
          name={`smallPackages.${index}.UserNote`}
          placeholder=""
        />
      ),
    },
    {
      dataIndex: "action",
      title: "Thao tác",
      align: "center",
      render: (_, __, index) => (
        <ActionButton
          title="Xoá"
          icon="fas fa-minus-circle"
          onClick={() => {
            if (data.length > 1) {
              remove(index);
            } else {
              toast.warning("Phải có ít nhất 1 kiện ký gửi");
            }
          }}
          btnRed
        />
      ),
    },
  ];

  // const expandable = {
  // 	expandedRowRender: (record, index) => (
  // 		<ul className="px-2 text-xs">
  // 			<li className="sm:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Loại sản phẩm:</span>
  // 				<FormInput control={control} name={`smallPackages.${index}.Category`} placeholder="" />
  // 			</li>
  // 			<li className="sm:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Số lượng:</span>
  // 				<FormInputNumber control={control} name={`smallPackages.${index}.Amount`} placeholder="" />
  // 			</li>
  // 			<li className="md:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Giá trị:</span>
  // 				<FormInputNumber control={control} name={`smallPackages.${index}.FeeShip`} placeholder="" />
  // 			</li>
  // 			<li className="md:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Cân nặng (KG):</span>
  // 				<FormInputNumber control={control} name={`smallPackages.${index}.PayableWeight`} placeholder="" />
  // 			</li>
  // 			<li className="lg:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Kiểm đếm:</span>
  // 				<FormCheckbox control={control} name={`smallPackages.${index}.IsCheckProduct`} />
  // 			</li>
  // 			<li className="lg:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Đóng gỗ:</span>
  // 				<FormCheckbox control={control} name={`smallPackages.${index}.IsPacked`} />
  // 			</li>
  // 			<li className="xl:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Bảo hiểm:</span>
  // 				<FormCheckbox control={control} name={`smallPackages.${index}.IsInsurance`} />
  // 			</li>
  // 			<li className="xl:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Ghi chú:</span>
  // 				<FormInput control={control} name={`smallPackages.${index}.UserNote`} placeholder="" />
  // 			</li>
  // 			<li className="xl:hidden justify-between flex py-2">
  // 				<span className="font-medium mr-4">Thao tác:</span>
  // 				<ActionButton
  // 					title="Xoá"
  // 					icon="fas fa-minus-circle"
  // 					onClick={() => {
  // 						if (data.length > 1) {
  // 							remove(index);
  // 						} else {
  // 							toast.warning("Phải có ít nhất 1 kiện ký gửi");
  // 						}
  // 					}}
  // 					btnRed
  // 				/>
  // 			</li>
  // 		</ul>
  // 	),
  // };
  return (
    <DataTable
      {...{
        columns,
        data,
        bordered: true,
        // expandable: expandable,
      }}
    />
  );
};
