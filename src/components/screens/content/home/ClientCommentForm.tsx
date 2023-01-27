import React from "react";
import {useForm} from "react-hook-form";
import {useMutation} from "react-query";
import {customerTalk} from "~/api";
import {Button, FormCard, FormInput, FormSwitch, FormTextarea, FormUpload, Modal, toast} from "~/components";
import {useDeepEffect} from "~/hooks";
import {TForm} from "~/types/table";

export const ClientCommentForm: React.FC<TForm<TCustomerBenefit> & {refetchcustomerComment}> = ({
	onCancel,
	visible,
	defaultValues,
	refetchcustomerComment,
}) => {
	const {control, reset, handleSubmit, getValues} = useForm<TCustomerBenefit>({
		mode: "onBlur",
	});

	useDeepEffect(() => {
		reset(defaultValues);
	}, [defaultValues]);

	const mutationUpdate = useMutation((data: TEmployee & {UserGroupId: number}) => customerTalk.update(data), {
		onSuccess: () => {
			mutationUpdate.reset();
			refetchcustomerComment();
		},
		onError: toast.error,
	});

	const _onPress = (data: TEmployee & {UserGroupId: number}) => {
		mutationUpdate.mutate(data);
		onCancel();
	};

	return (
		<Modal onCancel={onCancel} visible={visible} width={1000}>
			<FormCard>
				<FormCard.Header onCancel={onCancel}>
					<div className="w-full">
						<p>Cập nhật khách hàng nhận xét</p>
					</div>
				</FormCard.Header>
				<FormCard.Body>
					<div className="grid grid-cols-2 gap-4">
						<div className="col-span-2">
							<FormInput
								control={control}
								name="Name"
								rules={{required: "This field is required"}}
								label="Tên khách hàng"
								placeholder=""
							/>
						</div>
						<div className="col-span-2">
							<FormUpload control={control} name="IMG" label="Hình ảnh" required={false} />
						</div>
						<div className="col-span-2">
							<FormTextarea
								control={control}
								name="Description"
								label="Nội dung nhận xét"
								placeholder=""
								required={false}
							/>
						</div>
						<div className="col-span-2">
							<FormSwitch control={control} name="Active" label="Trạng thái:" required={false} />
						</div>
					</div>
				</FormCard.Body>
				<FormCard.Footer>
					<Button title="Cập nhật" btnClass="!bg-active" onClick={handleSubmit(_onPress)} showLoading />
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
