import {TablePaginationConfig} from "antd";
import React, {useState} from "react";
import {useQuery} from "react-query";
import {complain} from "~/api";
import {ReportListTable, showToast, toast, UserLayout} from "~/components";
import {defaultPagination} from "~/configs/appConfigs";
import {SEOHomeConfigs} from "~/configs/SEOConfigs";
import {useAppSelector} from "~/store";
import {TNextPageWithLayout} from "~/types/layout";

const Index: TNextPageWithLayout = () => {
	const {current: newUser} = useAppSelector((state) => state.user);
	if (!newUser) return null;

	const [pagination, setPagination] = useState<TablePaginationConfig>(defaultPagination);

	const {isFetching, data} = useQuery(
		[
			"reportList",
			{
				Current: pagination.current,
				PageSize: pagination.pageSize,
				UID: newUser?.UserId,
			},
		],
		() =>
			complain
				.getList({
					UID: newUser?.UserId,
					PageIndex: pagination.current,
					PageSize: pagination.pageSize,
					OrderBy: "Id desc",
				})
				.then((res) => res.Data),
		{
			keepPreviousData: true,
			enabled: !!newUser,
			onSuccess: (data) => setPagination({...pagination, total: data?.TotalItem}),
			onError: (error) => {
				showToast({
					title: "Đã xảy ra lỗi!",
					message: (error as any)?.response?.data?.ResultMessage,
					type: "error",
				});
			},
		}
	);

	return (
		<React.Fragment>
			<h1 className="titlePageUser !mb-0">Danh sách khiếu nại</h1>
			<div className="tableBox">
				<ReportListTable
					{...{
						data: data?.Items,
						pagination,
						handlePagination: (pagination) => setPagination(pagination),
						loading: isFetching,
					}}
				/>
			</div>
		</React.Fragment>
	);
};

Index.displayName = SEOHomeConfigs.complain;
Index.Layout = UserLayout;

export default Index;
