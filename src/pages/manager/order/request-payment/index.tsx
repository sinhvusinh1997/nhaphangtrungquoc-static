import router from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { payHelp } from "~/api";
import { Layout, RequestPaymentFilter, RequestPaymentTable, toast } from "~/components";
import { breadcrumb } from "~/configs";
import { SEOConfigs } from "~/configs/SEOConfigs";
import { TNextPageWithLayout } from "~/types/layout";

const Index: TNextPageWithLayout = () => {

	const [filter, setFilter] = useState({
		SearchContent: null,
		FromDate: null,
		ToDate: null,
		Status: null,
		OrderBy: "Id desc",
		TotalItems: null,
		PageSize: 20,
		PageIndex: 1
	});

	const handleFilter = (newFilter) => {
		setFilter({...filter, ...newFilter});
	};

	const {isFetching, data, isLoading} = useQuery(
		[
			"requestPaymentData",
			{...filter},
		],
		() =>
			payHelp
				.getList(filter)
				.then((res) => res.Data),
		{
			keepPreviousData: true,
			onSuccess: (data) => {
				setFilter({...filter, TotalItems: data?.TotalItem, PageIndex: data?.PageIndex, PageSize: data?.PageSize});
			},
			onError: toast.error,
		}
	);

	const handleExporTExcel = async () => {
		try {
			const res = await payHelp.exportExcel({});
			router.push(`${res.Data}`);
		} catch (error) {
			toast.error(error);
		}
	};

	return (
		<div className="tableBox px-2">
			<div className="">
				<RequestPaymentFilter handleFilter={handleFilter} handleExporTExcel={handleExporTExcel} />
			</div>
			<RequestPaymentTable
				loading={isFetching}
				data={data?.Items}
				filter={filter}
				handleFilter={handleFilter}
			/>
		</div>
	);
};

Index.displayName = SEOConfigs.oder.payFor;
Index.breadcrumb = breadcrumb.order.requestPayment.main;
Index.Layout = Layout;

export default Index;
