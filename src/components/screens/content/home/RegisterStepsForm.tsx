import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { step } from "~/api";
import {
	Button,
	FormCard,
	FormInput,
	FormInputNumber,
	FormSwitch,
	FormTextarea,
	FormUpload,
	Modal,
	toast
} from "~/components";
import { useDeepEffect } from "~/hooks";
import { TForm } from "~/types/table";

export const RegisterStepsForm: React.FC<
	TForm<TRegisterSteps> & {refetchRegisterSteps}
> = ({onCancel, visible, defaultValues, refetchRegisterSteps}) => {
	useDeepEffect(() => {
		reset(defaultValues);
	}, [defaultValues]);

	const {control, getValues, handleSubmit, reset} = useForm<TRegisterSteps>({
		mode: "onBlur",
	});

	const mutationUpdate = useMutation(
		(data: TEmployee & {UserGroupId: number}) => step.update(data),
		{
			onSuccess: () => {
				mutationUpdate.reset();
				refetchRegisterSteps();
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
						<p>Chỉnh sửa bước</p>
					</div>
				</FormCard.Header>
				<FormCard.Body>
					<div className="grid grid-cols-2 gap-4">
						<div className="col-span-1">
							<FormInput
								control={control}
								name="Name"
								label="Tên bước"
								placeholder=""
								rules={{required: "This field is required!"}}
							/>
						</div>
						<div className="col-span-1">
							<FormInputNumber
								control={control}
								name="Position"
								label="Sắp xếp"
								placeholder=""
								rules={{required: "This field is required1"}}
							/>
						</div>
						<div className="col-span-2">
							<FormInput
								control={control}
								name="Link"
								label="Link"
								placeholder=""
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
							<FormSwitch control={control} name="Active" label="Trạng thái:" />
						</div>
						<div className="col-span-2">
							<FormUpload control={control} name="IMG" label="Cập nhật ảnh" required={false} />
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
