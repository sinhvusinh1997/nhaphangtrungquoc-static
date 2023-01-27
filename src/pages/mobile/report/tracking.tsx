import {MobileLayout} from "~/components/globals/layout/mobileLayout";

export default function Tracking() {
	return (
		<iframe
			src="https://m.1688.com/"
			style={{
				width: "100%",
				minHeight: "100vh",
			}}
		></iframe>
	);
}

Tracking.displayName = "Tracking";
Tracking.Layout = MobileLayout;
