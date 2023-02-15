import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { pageType } from "~/api";
import {
  HomeBreadcrumb,
  HomeCard,
  HomeLayout,
  HomeSidebar,
} from "~/components";
import ContentItem from "~/components/globals/layout/homeLayouts/Card/ContentItem";
import MetaTags from "~/components/globals/metaTag";
import { SEOConfigs } from "~/configs/SEOConfigs";
import { TNextPageWithLayout } from "~/types/layout";

const Index: TNextPageWithLayout = () => {
  const router = useRouter();
  const [Data, setData] = useState<{ Name?: string; Pages?: any }>({});

  useQuery(["artical-detail"], () => pageType.getByCode(router?.query?.code), {
    onSuccess: (data) => {
      setData(data?.Data);
    },
    onError: (error) => {},
    enabled: !!router?.query?.code,
    retry: true,
  });

  return (
    <>
      <MetaTags data={Data} />
      <div className="col-span-2">
        <HomeBreadcrumb currentRoute={Data} />
        <div className="container min-h-[60vh]">
          <div className="grid grid-cols-12 gap-8 mb-8">
            <div className="order-2 col-span-12 lg:col-span-3 lg:order-1">
              <HomeSidebar />
            </div>
            <div className="order-1 col-span-12 lg:col-span-9">
              <h1 className="font-bold uppercase text-center">{Data?.Name}</h1>
              <ContentItem
                data={Data}
                code={router?.query?.Code}
                Title={""}
                IMG={""}
                Description={""}
                Created={undefined}
                PageContent={undefined}
              />
              <HomeCard data={Data?.Pages} code={router?.query?.Code} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Index.displayName = SEOConfigs.homePage;
Index.Layout = HomeLayout;

export default Index;
