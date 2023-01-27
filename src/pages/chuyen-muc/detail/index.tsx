import {TNextPageWithLayout} from "~/types/layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Page} from "~/api";
import {HomeBreadcrumb, HomeLayout, HomeSidebar} from "~/components";
import ContentItem from "~/components/globals/layout/homeLayouts/Card/ContentItem";
import {SEOConfigs} from "~/configs/SEOConfigs";

const Index: TNextPageWithLayout = () => {
	const router = useRouter();
	const code = `${router?.query?.code}`;
	const [Data, setData] = useState({
		Title: "",
		SideBar: null,
	});

	useEffect(() => {
		(async () => {
			Page.getByCode(code).then((res) => setData(res?.Data));
		})();
	}, [code]);

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
						<div className={!Data?.SideBar ? "col-span-12" : `order-1 col-span-12 md:col-span-9`}>
							<ContentItem
								data={Data}
								code={code}
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
