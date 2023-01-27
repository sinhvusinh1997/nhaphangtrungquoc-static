import { FC } from 'react';
import { useQuery } from 'react-query';
import { reportMainOrder } from '~/api';
import { toast } from '~/components/toast';
import { _format } from '~/utils';
import { SimpleOrderTable } from '..';

const PurchasedOrderTable: FC = () => {
	
	const { data, isFetching } = useQuery(
		['clientPurchaseReportData'],
		() =>
			reportMainOrder
				.getList({
					PageIndex: 1,
					PageSize: 1,
					OrderBy: 'Id desc',
					Status: 5
				})
				.then((res) => res.Data),
		{
			onSuccess: (data) => {},
			onError: toast.error,
		}
	);

	const rows = [
		{
			name: 'Tổng đơn đã mua',
			value: `${data?.TotalItem} đơn hàng`
		},
		{
			name: 'Tổng tiền hàng đã mua',
			value: _format.getVND(data?.Items[0]?.MaxTotalPriceVND)
		},
		{
			name: 'Tổng tiền khách cần thanh toán',
			value: _format.getVND(data?.Items[0]?.MaxMustPay)
		}
	];
	const title = 'Đã mua hàng';
	return <SimpleOrderTable rows={rows} title={title} />;
};

export { PurchasedOrderTable };
