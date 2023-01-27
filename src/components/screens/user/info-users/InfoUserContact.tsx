import { Avatar } from "antd";
import React from "react";

export const InfoUserContact: React.FC<any> = ({ onOpenModal, data }) => {
  return (
    <div className="w-full">
      <div className="w-full ">
        <img
          className="rounded-3xl w-full h-72"
          src="https://ui8-fleet-html.herokuapp.com/img/content/bg-profile.jpg"
        />
      </div>
      <div className="w-full items-center text-center xl:p-8 p-4 rounded-3xl mt-[-106px] z-50 relative">
        <div className="bg-white rounded-3xl p-6 grid grid-cols-3 boxShadow">
          <div className="md:col-span-3 xl:col-span-1 flex">
            <div className="border-2 border-[#0c5963] rounded-full p-2 mr-4 border-unactive h-14 xl:h-full overflow-hidden relative">
              <Avatar
                size={{ xxl: 100 }}
                src={data?.AvatarIMG ? data.AvatarIMG : "/empty_avatar.jpg"}
              />
            </div>
            <div className="text-left">
              <p className="font-medium xl:text-2xl text-xl xl:mt-4">
                {data?.UserName}
              </p>
              <button
                onClick={onOpenModal}
                className="text-blue flex lg:text-sm text-xs xl:mt-2"
              >
                <i className="fas fa-edit mr-2 pt-1"></i>
                <span className="mt-[2px]">Cập nhật ảnh đại diện</span>
              </button>
            </div>
          </div>
          <ul className="col-span-1 text-xs mt-4 mb-0">
            <li className="flex text-base py-2">
              <i className="far fa-user mr-8 pt-[2px] text-[#f14f04]"></i>
              <span>{data?.Gender == 0 ? "Nam" : "Nữ"}</span>
            </li>
            <li className="flex text-base py-2">
              <i className="far fa-phone-alt mr-8 pt-[2px] text-[#f14f04]"></i>
              <span>{data?.Phone}</span>
            </li>
          </ul>
          <ul className="col-span-1 text-xs lg:mt-4">
            <li className="flex text-base py-2">
              <i className="far fa-envelope mr-8 pt-[2px] text-[#f14f04]"></i>
              <span>{data?.Email}</span>
            </li>
            <li className="flex text-base py-2">
              <i className="far fa-map-marker-alt mr-8 pt-[2px] text-[#f14f04]"></i>
              <span>{data?.Address}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
