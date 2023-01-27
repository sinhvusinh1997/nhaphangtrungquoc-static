import React from "react";
import {_format} from "~/utils";

type TProps = {
	Title: string;
	IMG: string;
	Description: string;
	Created: Date;
	PageContent: any;
	data: any;
	code: any;
};

const ContentItem: React.FC<TProps> = ({data}) => {
	const PageContent = data?.PageContent ?? data?.Description;
	return (
		<div>
			<div dangerouslySetInnerHTML={{__html: PageContent}}></div>
		</div>
	);
};

export default ContentItem;
