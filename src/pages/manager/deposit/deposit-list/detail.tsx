import { Spin } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { transportationOrder } from "~/api";
import { DepositListForm, Layout, NotFound, toast } from "~/components";
import { breadcrumb } from "~/configs";
import { useCatalogue } from "~/hooks/useCatalogue";
import { selectUser, useAppSelector } from "~/store";
import { TNextPageWithLayout } from "~/types/layout";

const Index: TNextPageWithLayout = ({ connection }) => {
  const { user } = useAppSelector(selectUser);
  if (!user) return null;

  const { query } = useRouter();
  // realtime
  // ===== begin =====
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // thêm CODFee /transportOrder/id PUT

  useEffect(() => {
    let timeout = null;
    if (connection) {
      connection.on("change", async (_, transportation: TUserDeposit[]) => {
        if (!!transportation.length) {
          const item = transportation.find((x) => x.Id === +query?.id);
          if (item) {
            setLoading(true);
            queryClient.setQueryData(["depositList", +query?.id], {
              // ...queryClient.getQueryData(['depositList', +query?.id]),
              Data: item,
            });
            timeout = setTimeout(() => setLoading(false), 2000);
          }
        }
      });
    }

    return () => clearTimeout(timeout);
  }, [connection]);

  // ===== end =====
  const { data, isError, isLoading } = useQuery(
    ["depositList", +query?.id],
    () => transportationOrder.getByID(+query?.id),
    {
      onError: toast.error,
      refetchOnWindowFocus: true,
      retry: false,
      enabled: !!query?.id,
    }
  );

  const { shippingTypeToWarehouse } = useCatalogue({
    shippingTypeToWarehouseEnabled: true,
  });

  if (isError) return <NotFound />;

  return (
    <Spin spinning={loading}>
      <div className="mb-6">
        <DepositListForm
          defaultValues={data?.Data}
          shippingTypeToWarehouseCatalogue={shippingTypeToWarehouse}
          loading={isLoading}
          RoleID={user?.UserGroupId}
        />
      </div>
    </Spin>
  );
};

Index.breadcrumb = breadcrumb.deposit.depositList.detail;
Index.Layout = Layout;

export default Index;
