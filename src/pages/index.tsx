import {useQuery} from "react-query";
import {customerBenefits, step, service} from "~/api";
import configHomeData from "~/api/config-home";
import {HomeBanner, HomeBenefit, HomeInfoContact, HomeLayout, HomeRegister, HomeServices} from "~/components";
import {Choosen} from "~/components/screens/home/choosen";
import {Customer} from "~/components/screens/home/customer";
import {Experience} from "~/components/screens/home/experience";
import {Partner} from "~/components/screens/home/partner";
import {SEOConfigs} from "~/configs/SEOConfigs";
import {TNextPageWithLayout} from "~/types/layout";

const Index: TNextPageWithLayout = () => {
	const {data: dataConfig} = useQuery({
		queryKey: ["homeConfig"],
		queryFn: () => configHomeData.get().then((res) => res?.data?.Data),
	});

	const {data: dataService} = useQuery({
		queryKey: ["dataService"],
		queryFn: () =>
			service
				.getList({
					PageIndex: 1,
					PageSize: 20,
					OrderBy: "Id desc",
					Active: true,
				})
				.then((res) => res?.Data?.Items),
	});

	const {data: dataRegisterSteps} = useQuery({
		queryKey: ["dataRegisterSteps"],
		queryFn: () =>
			step
				.getList({
					PageIndex: 1,
					PageSize: 20,
					OrderBy: "Id desc",
					Active: true,
				})
				.then((res) => res?.Data?.Items),
	});

	const {data: dataBenefits} = useQuery({
		queryKey: ["dataBenefits"],
		queryFn: () =>
			customerBenefits
				.getList({
					PageIndex: 1,
					PageSize: 20,
					OrderBy: "Id desc",
					Active: true,
				})
				.then((res) => res?.Data?.Items),
	});

	return (
		<div className="homeindex">
			<div className="col-span-2">
				<HomeBanner data={dataConfig} />
				<Experience />
				<HomeBenefit data={dataBenefits?.filter((item) => item.ItemType === 2)} />
				<HomeServices data={dataService} />
				<Choosen data={dataBenefits?.filter((item) => item.ItemType === 1)} />
				<HomeRegister data={dataRegisterSteps} />
				<Customer />
				<Partner />
				<HomeInfoContact data={dataConfig} />
			</div>
		</div>
	);
};

Index.displayName = SEOConfigs.homePage;
Index.Layout = HomeLayout;

export default Index;
