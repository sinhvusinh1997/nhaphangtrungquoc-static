import React, {FC} from "react";
import {Control} from "react-hook-form";
import {FormInput, FormTextarea, FormUpload} from "~/components";

type TProps<T extends object = object> = {
	control: Control<T, object>;
	data: T;
};

export const ConfigurationSEO: FC<TProps<TConfig6>> = ({control, data}) => {
	return (
		<React.Fragment>
			<div className="grid grid-cols-1 gap-4 px-6">
				<div className="col-span-1 flex justify-between mt-4">
					<FormInput
						control={control}
						name="MetaTitle"
						label="Title"
						placeholder=""
						required={false}
						inputContainerClassName="w-[30%]"
					/>
					<FormInput
						control={control}
						name="MetaKeyword"
						label="Meta Keyword"
						placeholder=""
						required={false}
						inputContainerClassName="w-[30%]"
					/>
					<FormInput
						control={control}
						name="MetaDescription"
						label="Meta Description"
						placeholder="Nhập meta description"
						required={false}
						inputContainerClassName="w-[30%]"
					/>
				</div>
				<div className="col-span-1 flex justify-between">
					<FormInput
						control={control}
						name="OGTitle"
						label="OG Title"
						placeholder="Nhập OG Title"
						required={false}
						inputContainerClassName="w-[23%]"
					/>
					<FormInput
						control={control}
						name="OGDescription"
						label="OG Description"
						placeholder="Nhập OG Description"
						required={false}
						inputContainerClassName="w-[23%]"
					/>
					<FormInput
						control={control}
						name="OGTwitterTitle"
						label="OG Twitter Title"
						placeholder="Nhập OG Twitter Title"
						required={false}
						inputContainerClassName="w-[23%]"
					/>
					<FormInput
						control={control}
						name="OGTwitterDescription"
						label="OG Twitter Description"
						placeholder="Nhập OG Twitter Description"
						required={false}
						inputContainerClassName="w-[23%]"
					/>
				</div>
				<div className="col-span-1 flex justify-start">
					<div className="w-[25.5%]">
						<FormUpload
							control={control}
							name="OGImage"
							label="OG Image"
							required={false}
						/>
					</div>
					<div className="w-[25.5%]">
						<FormUpload
							control={control}
							name="OGTwitterImage"
							label="OG Twitter Image"
							required={false}
						/>
					</div>
				</div>
				<div className="col-span-1">
					<FormTextarea
						control={control}
						name="GoogleAnalytics"
						label="Google Analytics (Đặt nội dung trong thẻ script)"
						placeholder=""
						required={false}
					/>
				</div>
				<div className="col-span-1">
					<FormTextarea
						control={control}
						name="WebmasterTools"
						label="WebMaster Tools (Đặt nội dung trong thẻ script)"
						placeholder=""
						required={false}
					/>
				</div>
				<div className="col-span-1">
					<FormTextarea
						control={control}
						name="HeaderScriptCode"
						label="Header Script Code (Đặt nội dung trong thẻ script)"
						placeholder=""
						required={false}
					/>
				</div>
				<div className="col-span-1">
					<FormTextarea
						control={control}
						name="FooterScriptCode"
						label="Footer Script (Đặt nội dung trong thẻ script)"
						placeholder=""
						required={false}
					/>
				</div>
			</div>
		</React.Fragment>
	);
};
