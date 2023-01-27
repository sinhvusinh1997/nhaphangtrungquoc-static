import React from "react";
import {useForm} from "react-hook-form";
import {useMutation} from "react-query";
import {customerBenefits} from "~/api";
import {
	Button,
	FormCard,
	FormInput,
	FormInputNumber,
	FormSelect,
	FormSwitch,
	FormTextarea,
	FormUpload,
	Modal,
	toast,
} from "~/components";
import {benefitData} from "~/configs/appConfigs";
import {useDeepEffect} from "~/hooks";
import {TForm} from "~/types/table";

export const ClientBenefitForm: React.FC<
	TForm<TCustomerBenefit> & {refetchcustomerBenefits}
> = ({onCancel, visible, defaultValues, refetchcustomerBenefits}) => {
	const {control, reset, handleSubmit, getValues} = useForm<TCustomerBenefit>({
		mode: "onBlur",
	});

	useDeepEffect(() => {
		reset(defaultValues);
	}, [defaultValues]);

	const mutationUpdate = useMutation(
		(data: TEmployee & {UserGroupId: number}) => customerBenefits.update(data),
		{
			onSuccess: () => {
				mutationUpdate.reset();
				refetchcustomerBenefits();
			},
			onError: toast.error,
		}
	);

	const _onPress = (data: TEmployee & {UserGroupId: number}) => {
		mutationUpdate.mutate(data);
		onCancel();
	};

	return (
		<Modal onCancel={onCancel} visible={visible} width={1000}>
			<FormCard>
				<FormCard.Header onCancel={onCancel}>
					<div className="w-full">
						<p>Cập nhật quyền lợi khách hàng</p>
					</div>
				</FormCard.Header>
				<FormCard.Body>
					<div className="grid grid-cols-2 gap-4">
						<div className="col-span-1">
							<FormInput
								control={control}
								name="Name"
								rules={{required: "This field is required"}}
								label="Tên quyền lợi"
								placeholder=""
							/>
						</div>
						<div className="col-span-1">
							<FormInputNumber
								control={control}
								name="Position"
								rules={{required: "This field is required"}}
								label="Vị trí"
								placeholder=""
							/>
						</div>
						<div className="col-span-1">
							<FormInput
								control={control}
								name="Link"
								required={false}
								label="Link"
								placeholder=""
							/>
						</div>
						<div className="col-span-1">
							<FormSelect
								control={control}
								name="ItemType"
								data={benefitData}
								label="Quyền lợi"
								placeholder=""
								defaultValue={{
									id: getValues("ItemType"),
									name: getValues("ItemTypeName"),
								}}
							/>
						</div>
						<div className="col-span-2">
							<FormUpload
								control={control}
								name="IMG"
								label="Hình ảnh"
								required={false}
							/>
						</div>
						<div className="col-span-2">
							<FormTextarea
								control={control}
								name="Description"
								label="Mô tả ngắn"
								placeholder=""
								required={false}
							/>
						</div>
						<div className="col-span-2">
							<FormSwitch
								control={control}
								name="Active"
								label="Trạng thái:"
								required={false}
							/>
						</div>
					</div>
				</FormCard.Body>
				<FormCard.Footer>
					<Button
						title="Cập nhật"
						btnClass="!bg-active"
						onClick={handleSubmit(_onPress)}
						showLoading
					/>
					<Button
						title="Hủy"
						btnClass="!bg-pending"
						onClick={() => {
							onCancel();
						}}
					/>
				</FormCard.Footer>
			</FormCard>
		</Modal>
	);
};
