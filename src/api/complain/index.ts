import BaseAPI from "../methods";

type TFilterParams = {
	UID: number;
	Status: number;
	FromDate: string;
	ToDate: string;
};

const {put, globalCRUD, post} = new BaseAPI<TReport, TFilterParams>("complain");

export const complain = {
	...globalCRUD,

	updateComplain: (data) => put(`/update-complain`, data),

	exportExcel: (params?: {UID: number}) => post("/export-excel", {params}),
};
