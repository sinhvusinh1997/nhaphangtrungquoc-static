export const managerRouter = [
  {
    group: "dashboard",
    controllers: [
      {
        path: "/dashboard",
        name: "Trang điều khiển",
        icon: "fad fa-abacus",
      },
    ],
  },
  // {
  // 	group: "cấu hình",
  // 	controllers: [
  // 		{
  // 			path: "javascript:;",
  // 			icon: "fas fa-tools",
  // 			name: "Cấu hình",
  // 			childrens: [
  // 				{
  // 					path: "/manager/settings/configuration",
  // 					name: "Hệ thống",
  // 				},
  // 				{
  // 					path: "/manager/settings/tariff-user",
  // 					name: "Phí người dùng",
  // 				},
  // 				{
  // 					path: "/manager/settings/tariff-buy-pro",
  // 					name: "Phí dịch vụ mua hàng",
  // 				},
  // 				{
  // 					path: "/manager/settings/tariff-china-vietnam",
  // 					name: "Phí vận chuyển",
  // 				},
  // 				{
  // 					path: "/manager/settings/tariff-goods-checking",
  // 					name: "Phí kiểm hàng",
  // 				},
  // 				{
  // 					path: "/manager/settings/tariff-price-change",
  // 					name: "Phí thanh toán hộ",
  // 				},
  // 				{
  // 					path: "/manager/settings/warehouse",
  // 					name: "Kho vận chuyển",
  // 				},
  // 				{
  // 					path: "/manager/settings/banks",
  // 					name: "Danh sách ngân hàng",
  // 				},
  // 				{
  // 					path: "/manager/settings/notifications",
  // 					name: "Thông báo",
  // 				},
  // 			],
  // 		},
  // 	],
  // },
  {
    group: "Nhân viên - khách hàng",
    controllers: [
      {
        path: "javascript:;",
        name: "Người dùng",
        icon: "fas fa-users",
        childrens: [
          {
            path: "/manager/employee/admin-management",
            name: "Danh sách admin",
          },
          {
            path: "/manager/employee/employee-management",
            name: "Danh sách nhân viên",
          },
          {
            path: "/manager/client/client-list",
            name: "Danh sách khách hàng",
          },
          {
            path: "/manager/client/contact",
            name: "Danh sách khách liên hệ",
          },
          {
            path: "/manager/employee/bonus-order",
            name: "Hoa hồng mua hộ",
          },
          {
            path: "/manager/employee/bonus-deposit",
            name: "Hoa hồng ký gửi",
          },
          {
            path: "/manager/employee/bonus-payment",
            name: "Hoa hồng thanh toán hộ",
          },
          // {
          // 	path: "manager/employee/decentralization-management",
          // 	name: "Quản lý phân quyền",
          // },
        ],
      },
    ],
  },
  {
    group: "Danh sách đơn hàng",
    icon: "far fa-file-invoice-dollar",
    controllers: [
      {
        path: "javascript:;",
        name: "Đơn hàng",
        icon: "fas fa-cubes",
        childrens: [
          {
            key: "MainOrder",
            path: "/manager/order/order-list",
            name: "Đơn mua hộ",
          },
          {
            key: "MainOrderAnother",
            path: "/manager/order/order-list?q=3",
            name: "Đơn mua hộ khác",
          },
          {
            key: "TransportationOrder",
            path: "/manager/deposit/deposit-list",
            name: "Đơn ký gửi",
          },
          {
            key: "PayHelp",
            path: "/manager/order/request-payment",
            name: "Đơn thanh toán hộ",
          },
        ],
      },
    ],
  },
  {
    group: "Lên đơn hộ",
    icon: "far fa-file-invoice-dollar",
    controllers: [
      {
        path: "javascript:;",
        name: "Lên đơn hộ",
        icon: "far fa-person-carry",
        childrens: [
          {
            path: "/manager/order/buy-for/create-order",
            name: "Tạo đơn mua hộ khác",
          },
          {
            path: "/manager/order/buy-for/create-deposit",
            name: "Tạo đơn ký gửi",
          },
        ],
      },
    ],
  },
  {
    group: "Khiếu nại",
    icon: "far fa-file-invoice-dollar",
    controllers: [
      {
        path: "javascript:;",
        name: "Khiếu nại",
        icon: "fas fa-info-square",
        childrens: [
          {
            path: "/manager/order/complain-list",
            name: "Danh sách khiếu nại",
          },
          // {
          // 	path: "/order/complain-list",
          // 	name: "Khiếu nại ký gửi (x)",
          // },
        ],
      },
    ],
  },
  {
    group: "Quản lý kho",
    icon: "fas fa-boxes-alt",
    controllers: [
      {
        path: "javascript:;",
        name: "Quản lý kho",
        icon: "fas fa-warehouse-alt",
        childrens: [
          {
            path: "/manager/warehouse/check-warehouse-china",
            name: "Kiểm hàng kho TQ",
          },
          {
            path: "/manager/warehouse/check-warehouse-vietnam",
            name: "Kiểm hàng kho VN",
          },
          {
            path: "/manager/warehouse/import",
            name: "Import kho TQ",
          },
          {
            path: "/manager/warehouse/add-package-customer",
            name: "Gán kiện ký gửi",
          },
          {
            path: "/manager/warehouse/out-stock",
            name: "Xuất kho",
          },
          {
            path: "/manager/money/out-stock-payment",
            name: "Thanh toán xuất kho",
          },
        ],
      },
    ],
  },
  {
    group: "Quản lý bao kiện",
    icon: "far fa-file-invoice-dollar",
    controllers: [
      {
        path: "javascript:;",
        name: "Quản lý kiện",
        icon: "fas fa-box-open",
        childrens: [
          {
            path: "/manager/warehouse/package-management",
            name: "Bao hàng",
          },
          {
            path: "/manager/warehouse/transaction-code-management",
            name: "Mã vận đơn",
          },
          {
            path: "/manager/warehouse/floating-package",
            name: "Kiện trôi nổi",
          },
        ],
      },
    ],
  },
  {
    group: "Nạp rút - tiền",
    icon: "far fa-computer-classic",
    controllers: [
      {
        path: "javascript:;",
        name: "Nạp rút - tiền",
        icon: "fas fa-hands-usd",
        childrens: [
          {
            path: "/manager/money/personal-recharge",
            name: "Nạp tiền cá nhân",
          },
          {
            path: "/manager/money/recharge-history",
            name: "Yêu cầu nạp",
          },
          {
            path: "/manager/money/withdrawal-history",
            name: "Yêu cầu rút",
          },
        ],
      },
    ],
  },
  {
    group: "Thống kê tổng quan",
    icon: "far fa-computer-classic",
    controllers: [
      {
        path: "javascript:;",
        name: "Thống kê tổng quan",
        icon: "fas fa-chart-bar", // fas fa-chart-scatter
        childrens: [
          {
            path: "/manager/statistical/sales",
            name: "Doanh thu",
          },
          {
            path: "/manager/statistical/purchase-profit",
            name: "Lợi nhuận mua hộ",
          },
          {
            path: "/manager/statistical/payment-profit",
            name: "Lợi nhuận thanh toán",
          },
          {
            path: "/manager/statistical/recharge",
            name: "Nạp - rút tiền",
          },
          {
            path: "/manager/statistical/surplus",
            name: "Số dư",
          },
          {
            path: "/manager/statistical/transaction",
            name: "Giao dịch",
          },
          // {
          // 	path: "/statistical/order",
          // 	name: "Đơn hàng",
          // },
        ],
      },
    ],
  },

  {
    group: "Nội dung trang chủ",
    icon: "far fa-passport",
    controllers: [
      {
        path: "javascript:;",
        name: "Nội dung trang chủ",
        icon: "fas fa-home",
        childrens: [
          {
            path: "/manager/content/home",
            name: "Cấu hình trang chủ",
          },
          {
            path: "/manager/article/article-category",
            name: "Chuyên mục bài viết",
          },
          {
            path: "/manager/article/article-list",
            name: "Danh sách bài viết",
          },
        ],
      },
    ],
  },
];
