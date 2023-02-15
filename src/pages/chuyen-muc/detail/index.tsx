import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { Page } from "~/api";
import { HomeBreadcrumb, HomeLayout, HomeSidebar } from "~/components";
import ContentItem from "~/components/globals/layout/homeLayouts/Card/ContentItem";
import { SEOConfigs } from "~/configs/SEOConfigs";
import { TNextPageWithLayout } from "~/types/layout";

const Index: TNextPageWithLayout = () => {
  const router = useRouter();
  const [Data, setData] = useState({
    Title: "",
    SideBar: null,
  });

  useQuery(["artical-detail"], () => Page.getByCode(`${router?.query?.code}`), {
    onSuccess: (data) => {
      setData(data?.Data);
    },
    onError: (error) => {},
    enabled: !!router?.query?.code,
    retry: true,
  });

  return (
    <div className="categoryhome">
      <div className="col-span-2">
        <HomeBreadcrumb currentRoute={Data} />
        <div className="container">
          <div className="grid grid-cols-12 gap-8 mb-8">
            {Data?.SideBar && (
              <div className="order-2 col-span-12 md:col-span-3 md:order-1">
                <HomeSidebar />
              </div>
            )}
            <div
              className={
                !Data?.SideBar
                  ? "col-span-12"
                  : `order-1 col-span-12 md:col-span-9`
              }
            >
              <ContentItem
                data={Data}
                code={`${router?.query?.code}`}
                Title={""}
                IMG={""}
                Description={""}
                Created={undefined}
                PageContent={undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Index.displayName = SEOConfigs.homePage;
Index.Layout = HomeLayout;

export default Index;
