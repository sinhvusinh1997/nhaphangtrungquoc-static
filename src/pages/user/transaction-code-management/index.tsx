import router from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { smallPackage } from "~/api";
import {
  Layout,
  toast,
  TransactionCodeManagementFilter,
  TransactionCodeManagementTable,
  UserLayout,
} from "~/components";
import { breadcrumb } from "~/configs";
import { SEOConfigs } from "~/configs/SEOConfigs";
import { TNextPageWithLayout } from "~/types/layout";
import { selectUser, useAppSelector } from "~/store";

const Index: TNextPageWithLayout = () => {
  const { user: userStore } = useAppSelector(selectUser);
  if (!userStore) return null;
  const [filter, setFilter] = useState({
    SearchType: null,
    SearchContent: null,
    Status: null,
    FromDate: null,
    ToDate: null,
    OrderBy: "Id desc",
    TotalItems: null,
    PageSize: 20,
    PageIndex: 1,
    Menu: 2,
  });

  const handleFilter = (newFilter) => {
    setFilter({ ...filter, ...newFilter });
  };

  const { data, isFetching, isLoading } = useQuery(
    ["smallPackageList", { ...filter }],
    () => smallPackage.getList(filter).then((res) => res.Data),
    {
      keepPreviousData: true,
      onSuccess: (data) =>
        setFilter({
          ...filter,
          TotalItems: data?.TotalItem,
          PageIndex: data?.PageIndex,
          PageSize: data?.PageSize,
        }),
      onError: toast.error,
    }
  );

  const handleExporTExcel = async () => {
    try {
      const res = await smallPackage.exportExcel({});
      router.push(`${res.Data}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <div className="titlePageUser">Quản lý mã vận đơn</div>
      <div className="tableBox">
        <div className="">
          <TransactionCodeManagementFilter
            handleFilter={handleFilter}
            handleExporTExcel={handleExporTExcel}
          />
        </div>
        <TransactionCodeManagementTable
          data={data?.Items}
          loading={isFetching}
          filter={filter}
          handleFilter={handleFilter}
        />
      </div>
    </>
  );
};

Index.displayName = SEOConfigs.parcelManagement.billCodeManager;
Index.breadcrumb = breadcrumb.warehouse.transactionCodeManagement;
Index.Layout = UserLayout;

export default Index;
