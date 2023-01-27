import {Spin, Tooltip} from "antd";
import Modal from "antd/lib/modal/Modal";
import {differenceWith, isEqual} from "lodash";
import {useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "react-query";
import {smallPackage} from "~/api";
import {FormInput} from "~/components";
import {IconButton} from "~/components/globals/button/IconButton";
import {showToast, toast} from "~/components/toast";
import {controllerList, EOrderTypeStatusData, EPermission, ESmallPackageStatusData} from "~/configs/appConfigs";
import {usePressKeyboard} from "~/hooks";
import {selectIsAcceptRoles, useAppSelector} from "~/store";
import {CheckWarehouseChinaTable} from "../check-warehouse-china";
import {CheckWarehouseVietNamAssign1} from "./CheckWarehouseVietNamAssign1";
import {CheckWarehouseVietNamAssign2} from "./CheckWarehouseVietNamAssign2";

let newKey = new Date().getTime().toString();

type TForm = {
	[key: string]: TWarehouseVN[];
};

export const CheckWarehouseVietNamForm = () => {
	const {handleSubmit, control, reset} = useForm<TWarehouseVN>({
		mode: "onBlur",
	});
	const {confirm}: any = Modal;

	const queryClient = useQueryClient();
	const [loading, setLoading] = useState(false);
	const item = useRef<TWarehouseVN>();
	const modalType = useRef<"assign1" | "assign2">("assign1");
	const [modalAssign1, setModalAssign1] = useState(false);
	const [modalAssign2, setModalAssign2] = useState(false);

	const {
		control: controlArray,
		watch: watchArray,
		setValue: setValueArray,
		handleSubmit: handleSubmitArray,
		unregister: unregisterArray,
	} = useForm<TForm>({
		mode: "onBlur",
	});

	const mutationAddOrderTransactionCode = useMutation(smallPackage.create, {
		onSuccess: (data) => {
			handleData(data.Data, data.Data[0].UserName + data.Data[0].Phone);
		},
	});

	const handleData = (newData: TWarehouseVN[], key: string) => {
		key = !!key.length ? key : newKey;
		if (!Object.keys(watchArray()).length) {
			setValueArray(key, newData);
		} else {
			if (watchArray().hasOwnProperty(key)) {
				const diffData = differenceWith(
					[...newData.map((item) => item.Id)],
					[...watchArray(key).map((item) => item.Id)],
					isEqual
				);

				if (!diffData.length) {
					if (newData.length > 1) {
						toast.warning("Bạn đã quét bao hàng này rồi");
					} else if (newData.length === 1) {
						if (newData[0].OrderType === EOrderTypeStatusData.Transper) {
							toast.warning("Bạn đã quét đơn hàng vận chuyển hộ này rồi");
						} else if (newData[0].OrderType === EOrderTypeStatusData.Buy) {
							confirm({
								title: "Thông báo!",
								content: "Mã này đã scan rồi, bạn có muốn tạo thêm kiện?",
								onOk() {
									mutationAddOrderTransactionCode.mutateAsync({
										OrderTransactionCode: newData[0].OrderTransactionCode,
										IsWarehouseVN: true,
									});
								},
							});
						}
					}
				} else {
					setValueArray(key, [...newData.filter((item) => !!diffData.find((x) => item.Id === x)), ...watchArray(key)]);
				}
			} else {
				setValueArray(key, newData);
			}
		}
	};

	const _onCreate = async (newData: TWarehouseVN) => {
		try {
			setLoading(true);
			const res = await queryClient.fetchQuery(["barCodeVN", newData.OrderTransactionCode], () =>
				smallPackage.getByTransactionCode({
					TransactionCode: newData.OrderTransactionCode.trim(),
				})
			);
			// set data scope
			// ===== begin =====

			if (res?.Data[0].Status === 1) {
				showToast({
					title: "Không thể quét mã này!",
					message: "Kiện này chưa về kho TQ!",
					type: "error",
				});
				return;
			}

			if (res.Data[0].Status === 4) {
				showToast({
					title: "Không thể quét mã này!",
					message: "Đơn nãy đã hủy!",
					type: "error",
				});
				return;
			}

			if (res.Data[0].Status === 5) {
				showToast({
					title: "Không thể quét mã này!",
					message: "Đơn nãy đã giao khách!",
					type: "error",
				});
				return;
			}

			let key = res.Data[0].UserName + res.Data[0].Phone;
			handleData(
				res.Data.map((item) => ({
					...item,
					Status:
						item.Status <= ESmallPackageStatusData.ArrivedToVietNamWarehouse
							? ESmallPackageStatusData.ArrivedToVietNamWarehouse
							: item.Status,
				})),
				key
			);
			return;
			// ===== end =====
		} catch (error) {
			toast.error("Không tìm thấy thông tin kiện này");
		} finally {
			setLoading(false);
		}
		reset();
	};

	const mutationUpdate = useMutation(smallPackage.update, {
		onSuccess: () => !modalAssign1 && !modalAssign2 && toast.success("Cập nhật đơn kiện thành công"),
		onError: toast.error,
	});

	const mutationUpdateLost = useMutation(smallPackage.updateIsLost, {
		onSuccess: () => toast.success("Cập nhật kiện thất lạc thành công"),
		onError: toast.error,
	});

	const _onPress = async (data: (TWarehouseVN & Partial<TAddtionalFieldWarehouse>)[]) => {
		try {
			if (Object.keys(data).length) {
				try {
					await mutationUpdate.mutateAsync(data);
					setModalAssign1(false);
					setModalAssign2(false);
				} catch (error) {}
			} else {
				toast.warning("Hiện tại chưa có mã kiện, vui lòng quét mã kiện trước");
			}
		} catch (error) {}
	};

	const _onHide = (key: string, item?: TWarehouseVN | TWarehouseVN[]) => {
		if (Array.isArray(item)) {
			confirm({
				title: "Thông báo!",
				content: `Bạn muốn ẩn tất cả kiện của ${watchArray(key)[0].UserName}?`,
				onOk() {
					unregisterArray(key);
				},
			});
		} else {
			confirm({
				title: "Thông báo!",
				content: `Bạn muốn ẩn kiện của ${watchArray(key)[0].UserName}?`,
				onOk() {
					let currentListOfKey = watchArray(key);
					currentListOfKey = currentListOfKey.filter((x) => x.Id !== item.Id);
					if (!currentListOfKey.length) {
						unregisterArray(key);
					} else {
						setValueArray(key, currentListOfKey);
					}
				},
			});
		}
	};

	const _onIsLost = (item?: TWarehouseVN[]) => {
		confirm({
			title: "Thông báo!",
			content: "Bạn muốn báo thất lạc kiện này?",
			onOk() {
				mutationUpdateLost.mutateAsync(item[0].Id);
			},
		});
	};

	const handleAssign = (data?: TWarehouseVN, type: "assign1" | "assign2" = "assign1") => {
		if (data) {
			item.current = data;
		} else {
			item.current = undefined;
		}
		if (type === "assign1") {
			modalType.current = "assign1";
			setModalAssign1(true);
		} else {
			modalType.current = "assign2";
			setModalAssign2(true);
		}
		// _onPress([data]);
		// item.current =
	};

	const canUpdateTatCaCacKien = useAppSelector(
		selectIsAcceptRoles({
			controller: controllerList.SmallPackage,
			permissionsRequired: [EPermission.Update],
		})
	);

	usePressKeyboard(
		[
			{
				keyList: ["Control", "q"],
				cb: handleSubmitArray((data) => _onPress(Object.values(data).reduce((prev, cur) => [...prev, ...cur], []))),
			},
		],
		{enabled: canUpdateTatCaCacKien}
	);

	return (
		<Spin spinning={loading || mutationAddOrderTransactionCode.isLoading || mutationUpdate.isLoading}>
			<div className="flex items-end">
				<FormInput
					control={control}
					name="OrderTransactionCode"
					placeholder="Nhập mã vận đơn hoặc mã bao hàng"
					inputContainerClassName="max-w-[424px] mr-4"
					inputClassName="barcode"
					label="Mã vận đơn/Mã bao hàng"
					prefix={
						<Tooltip placement="topLeft" title={"Open barcode!"}>
							<div className="min-w-[50px] px-2 text-center">
								<i className="fas fa-barcode text-2xl"></i>
							</div>
						</Tooltip>
					}
					rules={{
						required: "This field is required",
					}}
					onEnter={handleSubmit((data) => _onCreate(data))}
				/>
				<IconButton
					onClick={handleSubmit((data) => _onCreate(data))}
					btnClass="order-last"
					icon="fas fa-barcode-read"
					title="Quét mã (Enter)"
					toolip=""
				/>
			</div>
			<IconButton
				onClick={handleSubmitArray((data) =>
					_onPress(Object.values(data).reduce((prev, cur) => [...prev, ...cur], []))
				)}
				btnClass="mt-4"
				icon="fas fa-pencil"
				title="Cập nhật tất cả kiện (Ctr + Q)"
				toolip=""
			/>
			{!!Object.keys(watchArray()).length &&
				Object.keys(watchArray()).map((key) => (
					<CheckWarehouseChinaTable
						key={key}
						type="vietnam"
						data={watchArray(key)}
						name={key}
						handleSubmit={handleSubmitArray}
						handleAssign={handleAssign}
						onPress={_onPress}
						onHide={_onHide}
						control={controlArray}
						onIsLost={_onIsLost}
						setValue={setValueArray}
					/>
				))}

			{/* modal của gán đơn cho khách mua hộ */}
			<CheckWarehouseVietNamAssign1
				item={item.current}
				visible={modalAssign1 && modalType.current === "assign1"}
				onCancel={() => setModalAssign1(false)}
				onPress={_onPress}
			/>

			{/* modal của gán đơn cho khách ký gửi */}
			<CheckWarehouseVietNamAssign2
				item={item.current}
				visible={modalAssign2 && modalType.current === "assign2"}
				onCancel={() => setModalAssign2(false)}
				onPress={_onPress}
			/>
		</Spin>
	);
};
