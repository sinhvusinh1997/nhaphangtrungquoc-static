type TEmployee = TBaseReponseParams &
	TBaseUserFileParams & {
		AvatarIMG: string,
		UserName: string;
		Phone: string;
		Email: string;
		Address: string;
		Status: number;
		StatusName: string;
		TienTichLuy: number;
		IsAdmin: boolean;
		IsCheckOTP: boolean;
		IsLoginFaceBook: boolean;
		IsLoginGoogle: boolean;
		Password: string;
		FullName: string;
		TotalViolations: number;
		IsLocked: boolean;
		LockedDate: Date;
		Birthday: Date;
		SaleId: number;
		DatHangId: number;
		Deposit: number;
		FeeTQVNPerWeight: number;
		FeeBuyPro: number;
		Currency: number;
		LevelId: number;
		VIPLevel: string;
		UserLevel: TBaseUserLevel;
		Wallet: number;
		WalletCNY: number;
		WareHouseTQ: string;
		WareHouseVN: string;
		WarehouseFrom: string;
		WarehouseTo: string;
		IsResetPassword: boolean;
		ConfirmPassWord: string;
		PasswordNew: string;
		PasswordAgain: string;
		Gender: number;
		UserGroup: TUserGroupCatalogue;
		UserGroupName: string;
		TotalMainOrder: number;
		TotalPayHelp: number;
		TotalTransportationOrder: number;
		SumAmount: number;
		TotalOrder: number; // cái này chưa có
		UserGroupId: number;
		TotalOrderPrice: number;
		TotalPaidPrice: number;
		TotalUnPaidPrice: number;
		OneSignalPlayerID: String;
	};

type TBonus = {
	Id: number;
	PercentReceive: number;
	TotalPriceReceive: number;
	UserName: string;
	roleId: number;
	RoleName: string;
	Status: number;
	StatusName: string;
	Created: Date;
	CreatedBy: string;
	MainOrderId: number;
	Updated: Date;
	UpdatedBy: string;
};

type TClient = TEmployee;