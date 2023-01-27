import {BackTop} from "antd";

const backTopWrapper = "!right-[2%]";
const backTopInner = "hover:animate-bounce delay-1000";
const backTopIcon =
	"fas fa-angle-double-up text-[#fff] hover:text-[#fff] bg-[#c7ae8d] text-xl py-[14px] px-[18px] rounded-3xl shadow-xl hover:bg-[#f37021]";

export const ButtonBackTop: React.FC<{}> = ({children}) => {
	return (
		<BackTop className={backTopWrapper}>
			<div className={backTopInner}>
				<i className={backTopIcon}></i>
			</div>
		</BackTop>
	);
};
