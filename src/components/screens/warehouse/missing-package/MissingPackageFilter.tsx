import { Tooltip } from 'antd';
import React from 'react';
import { FilterInput } from '~/components';

const codeProps = {
	id: 'code',
	name: 'code',
	placeholder: 'Mã vận đơn'
};

type TProps = {
	handleFilter: (newFilter) => void;
};

export const MissingPackageFilter: React.FC<TProps> = ({ handleFilter }) => {
	return (
		<div className="max-w-[500px] mb-4">
			<div className="flex max-w-[500px]">
				<FilterInput
					{...codeProps}
					inputClassName="barcode"
					handleSubmit={(val) => handleFilter({PageIndex: 1, SearchContent: val})}
					prefix={
						<Tooltip placement="topLeft" title={'Open barcode!'}>
							<div className="min-w-[50px] px-2 text-center">
								<i className="fas fa-barcode text-2xl translate-y-[2px]"></i>
							</div>
						</Tooltip>
					}
					allowClear={false}
				/>
			</div>
		</div>
	);
};
