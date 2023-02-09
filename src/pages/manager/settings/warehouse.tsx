import { Modal, Space, Tabs, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { shipping, warehouseFrom, warehouseTo } from "~/api";
import {
  ActionButton,
  Button,
  DataTable,
  FormCard,
  FormInput,
  FormSelect,
  IconButton,
  Layout,
} from "~/components";
import { breadcrumb } from "~/configs";
import { SEOConfigs } from "~/configs/SEOConfigs";
import type { TNextPageWithLayout } from "~/types/layout";
import { TColumnsType } from "~/types/table";
import { _format } from "~/utils";

type TCreateMethods = {
  Name: string;
};

const AddNewWareHouseForm = ({ onCancel, visible, refetchFrom, refetchTo }) => {
  const { control, handleSubmit, reset } = useForm<TCreateWareHouse>({
    defaultValues: {
      Name: "",
      Address: "",
      IsChina: 1,
    },
  });

  useEffect(() => {
    reset({
      Name: "",
      Address: "",
      IsChina: 1,
    });
  }, [visible]);

  const _onAddNew = async (data: TCreateWareHouse) => {
    const newData = { ...data, IsChina: Boolean(data.IsChina) };
    const id = toast.loading("Đang xử lý ...");
    try {
      if (data.IsChina) {
        warehouseFrom.create(newData).then(() => {
          toast.update(id, {
            render: "Thêm kho thành công!",
            type: "success",
            isLoading: false,
            autoClose: 1000,
          });
          refetchFrom();
        });
      } else {
        warehouseTo.create(newData).then(() => {
          toast.update(id, {
            render: "Thêm kho thành công!",
            type: "success",
            isLoading: false,
            autoClose: 1000,
          });
          refetchTo();
        });
      }
      onCancel();
    } catch (error) {
      toast.update(id, {
        render: "Xảy ra lỗi khi thêm kho!!",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
      onCancel();
    }
  };

  return (
    <Modal
      onCancel={onCancel}
      visible={visible}
      closable={false}
      footer={false}
    >
      <FormCard>
        <FormCard.Header onCancel={onCancel}>
          <div className="w-full">
            <p>Thêm kho</p>
          </div>
        </FormCard.Header>
        <FormCard.Body>
          <FormInput
            label="Tên kho"
            control={control}
            name={"Name"}
            placeholder={"Nhập tên kho"}
            inputContainerClassName="mb-2"
            rules={{ required: "Vui lòng nhập tên kho!" }}
          />
          <FormInput
            label="Địa chỉ kho"
            control={control}
            name={"Address"}
            placeholder={"Nhập địa chỉ kho"}
            inputContainerClassName="mb-2"
            rules={{ required: "Vui lòng nhập đia chỉ kho!" }}
          />
          <FormSelect
            label="Kho ở đâu?"
            data={[
              { Name: "Trung Quốc", Id: 1 },
              { Name: "Việt Nam", Id: 0 },
            ]}
            select={{ label: "Name", value: "Id" }}
            control={control}
            name={"IsChina"}
            placeholder={"Chọn nơi đặt kho!"}
            rules={{ required: "Vui lòng chọn nơi đặt kho!" }}
          />
        </FormCard.Body>
        <FormCard.Footer>
          <Button
            title="Thêm mới"
            btnClass="!bg-active"
            onClick={handleSubmit(_onAddNew)}
            showLoading
          />
          <Button
            title="Hủy"
            btnClass="!bg-pending"
            onClick={() => {
              onCancel();
            }}
          />
        </FormCard.Footer>
      </FormCard>
    </Modal>
  );
};

const AddNewMethod = ({ onCancel, visible, refetchMethod }) => {
  const { control, handleSubmit, reset } = useForm<TCreateMethods>({
    defaultValues: {
      Name: "",
    },
  });

  const _onAddNew = async (data: TCreateMethods) => {
    onCancel();
    const id = toast.loading("Đang xử lý ...");
    try {
      shipping.create(data).then(() => {
        toast.update(id, {
          render: "Thêm phương thức thành công!",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
        refetchMethod();
        reset();
      });
    } catch (error) {
      toast.update(id, {
        render: "Thêm phương thức thất bại!",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
    }
  };

  return (
    <Modal
      onCancel={onCancel}
      visible={visible}
      closable={false}
      footer={false}
    >
      <FormCard>
        <FormCard.Header onCancel={onCancel}>
          <div className="w-full">
            <p>Thêm phương thức vận chuyển</p>
          </div>
        </FormCard.Header>
        <FormCard.Body>
          <FormInput
            label="Tên phương thức vận chuyển"
            control={control}
            name={"Name"}
            placeholder={"Tên phương thức vận chuyển"}
            rules={{ required: "Vui lòng nhập tên phương thức vận chuyển!" }}
          />
        </FormCard.Body>
        <FormCard.Footer>
          <Button
            title="Thêm"
            btnClass="!bg-active"
            onClick={handleSubmit(_onAddNew)}
            showLoading
          />
          <Button
            title="Hủy"
            btnClass="!bg-pending"
            onClick={() => {
              onCancel();
            }}
          />
        </FormCard.Footer>
      </FormCard>
    </Modal>
  );
};

const EditComponent = ({
  onCancel,
  visible,
  defaultValues,
  refetchFrom,
  refetchTo,
  refetchMethod,
}) => {
  const { control, handleSubmit, reset } = useForm<TCreateWareHouse>({
    mode: "onBlur",
    defaultValues: defaultValues,
  });

  const _onSubmit = (data) => {
    const id = toast.loading("Đang xử lý ...");
    if (!defaultValues?.IsWareHouse) {
      delete data.IsWareHouse;
      shipping
        .update(data)
        .then(() => {
          refetchMethod();
          toast.update(id, {
            render: "Cập nhật thành công!",
            type: "success",
            isLoading: false,
            autoClose: 1000,
          });
        })
        .catch((error) =>
          toast.update(id, {
            render: "Cập nhật thất bại!",
            type: "error",
            isLoading: false,
            autoClose: 1000,
          })
        );
      onCancel();
      return;
    }
    delete data.IsWareHouse;

    if (defaultValues?.IsChina) {
      warehouseFrom
        .update(data)
        .then(() => {
          refetchFrom();
          toast.update(id, {
            render: "Cập nhật thành công!",
            type: "success",
            isLoading: false,
            autoClose: 1000,
          });
        })
        .catch((error) =>
          toast.update(id, {
            render: "Cập nhật thất bại!",
            type: "error",
            isLoading: false,
            autoClose: 1000,
          })
        );
      onCancel();
      return;
    }

    if (!defaultValues?.IsChina) {
      warehouseTo
        .update(data)
        .then(() => {
          refetchTo();
          toast.update(id, {
            render: "Cập nhật thành công!",
            type: "success",
            isLoading: false,
            autoClose: 1000,
          });
        })
        .catch((error) =>
          toast.update(id, {
            render: "Cập nhật thất bại!",
            type: "error",
            isLoading: false,
            autoClose: 1000,
          })
        );
      onCancel();
      return;
    }
  };

  return (
    <Modal
      onCancel={onCancel}
      visible={visible}
      closable={false}
      footer={false}
    >
      <FormCard>
        <FormCard.Header onCancel={onCancel}>
          <div className="w-full">
            <p>Cập nhật</p>
          </div>
        </FormCard.Header>
        <FormCard.Body>
          {defaultValues?.IsWareHouse ? (
            <>
              <FormInput
                label="Tên kho"
                control={control}
                name={"Name"}
                placeholder={"Nhập tên kho"}
                inputContainerClassName="mb-2"
                rules={{ required: "Vui lòng nhập tên kho!" }}
              />
              <FormInput
                label="Địa chỉ kho"
                control={control}
                name={"Address"}
                placeholder={"Nhập địa chỉ kho"}
                inputContainerClassName="mb-2"
                rules={{ required: "Vui lòng nhập đia chỉ kho!" }}
              />
              {/* <FormSelect
                label="Kho ở đâu?"
                data={[
                  { Name: "Trung Quốc", Id: true },
                  { Name: "Việt Nam", Id: false },
                ]}
                defaultValue={{
                  Name: defaultValues?.IsChina ? "Trung Quốc" : "Việt Nam",
                  Id: defaultValues?.Id,
                }}
                select={{ label: "Name", value: "Id" }}
                control={control}
                name={"IsChina"}
                placeholder={""}
              /> */}
            </>
          ) : (
            <FormInput
              label="Tên phương thức vận chuyển"
              control={control}
              name={"Name"}
              placeholder={"Tên phương thức vận chuyển"}
              rules={{ required: "Vui lòng nhập tên phương thức vận chuyển!" }}
            />
          )}
        </FormCard.Body>
        <FormCard.Footer>
          <Button
            title="Thêm"
            btnClass="!bg-active"
            onClick={handleSubmit(_onSubmit)}
            showLoading
          />
          <Button
            title="Hủy"
            btnClass="!bg-pending"
            onClick={() => {
              onCancel();
            }}
          />
        </FormCard.Footer>
      </FormCard>
    </Modal>
  );
};

const Index: TNextPageWithLayout = () => {
  const [modalWarehouse, setModalWarehouse] = useState(false);
  const [modalMethod, setModalMethod] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const item = useRef(null);

  const { refetch: refetchFrom, data: warehouseFromData } = useQuery(
    ["warehouseFromData"],
    () => warehouseFrom.getList().then((res) => res.Data.Items)
  );

  const { refetch: refetchTo, data: warehouseToData } = useQuery(
    ["warehouseToData"],
    () => warehouseTo.getList().then((res) => res.Data.Items)
  );

  const { refetch: refetchMethod, data: shippingType } = useQuery(
    ["shippingType"],
    () =>
      shipping
        .getList({
          PageSize: 20,
          PageIndex: 1,
        })
        .then((res) => res.Data.Items),
    {
      retry: false,
    }
  );

  const columnsWarehouse: TColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "Id",
    },
    {
      title: "Tên kho",
      dataIndex: "Name",
    },
    {
      dataIndex: "Address",
      title: "Địa chỉ",
    },
    {
      dataIndex: "Active",
      title: "Trạng thái",
      render(value, record, index) {
        return (
          <Tag color={value ? "blue" : "red"}>{value ? "Hiện" : "Ẩn"}</Tag>
        );
      },
    },
    {
      title: () => <>Nhân viên cập nhật</>,
      dataIndex: "UpdatedBy",
    },
    {
      title: "Ngày tạo",
      dataIndex: "Created",
      render: (date) => _format.getVNDate(date, "DD/MM/YYYY - HH:mm:A"),
    },
    {
      title: "Cập nhật mới nhất",
      dataIndex: "Updated",
      render: (date) => {
        return date ? _format.getVNDate(date, "DD/MM/YYYY - HH:mm:A") : "---";
      },
    },
    {
      align: "right",
      title: "Thao tác",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <Space>
            <ActionButton
              onClick={() =>
                Modal.confirm({
                  title: "Xác nhận ẩn kho này?",
                  content: <div>Ẩn kho sẽ không sử dụng được kho này nữa.</div>,
                  onOk: () => {
                    if (record?.IsChina) {
                      warehouseFrom.delete(record?.Id).then(() => {
                        toast.success("Ẩn kho thành công");
                        refetchFrom();
                      });
                    } else {
                      warehouseTo.delete(record?.Id).then(() => {
                        toast.success("Ẩn kho thành công");
                        refetchTo();
                      });
                    }
                  },
                })
              }
              icon="fas fa-eye-slash"
              title="Ẩn kho"
            />
            <ActionButton
              onClick={() => {
                item.current = { ...record, IsWareHouse: true };
                setModalEdit(true);
              }}
              title="Cập nhật kho"
              icon="fas fa-edit"
            />
          </Space>
        );
      },
    },
  ];

  const columnsMethod: TColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "Id",
    },
    {
      title: "Phương thức vận chuyển",
      dataIndex: "Name",
    },
    {
      title: "Ngày tạo",
      dataIndex: "Created",
      render: (date) => _format.getVNDate(date, "DD/MM/YYYY - HH:mm:A"),
    },
    {
      title: "Cập nhật mới nhất",
      dataIndex: "Updated",
      render: (date) => {
        return date ? _format.getVNDate(date, "DD/MM/YYYY - HH:mm:A") : "---";
      },
    },
    {
      title: () => <>Nhân viên cập nhật</>,
      dataIndex: "UpdatedBy",
    },
    {
      align: "right",
      title: "Thao tác",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <Space>
            <ActionButton
              onClick={() =>
                Modal.confirm({
                  title: "Xác nhận phương thức này?",
                  onOk: () => {
                    shipping.delete(record.Id).then(() => {
                      refetchMethod();
                      toast.success("Xóa phương thức thành công!");
                    });
                  },
                })
              }
              icon="fas fa-trash"
              title="Xóa"
            />
            <ActionButton
              onClick={() => {
                item.current = { ...record, IsWareHouse: false };
                setModalEdit(true);
              }}
              title="Cập nhật phương thức"
              icon="fas fa-edit"
            />
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <div className="tableBox py-2 w-full">
        <Tabs
          tabBarExtraContent={
            <div className="text-right">
              <IconButton
                onClick={() => setModalWarehouse(!modalWarehouse)}
                title="Thêm kho"
                icon="fas fa-plus"
                showLoading
                btnClass="!mr-4"
                toolip="Thêm Kho"
                green
              />
              <IconButton
                onClick={() => setModalMethod(!modalMethod)}
                title="Thêm phương thức"
                icon="fas fa-plus"
                showLoading
                toolip="Thêm Kho"
                green
              />
            </div>
          }
        >
          <Tabs.TabPane key="1" tab={"Kho Trung Quốc"}>
            <div className="tableBoxNon mt-4">
              <DataTable
                rowKey={"Id"}
                key={"1"}
                columns={columnsWarehouse}
                data={warehouseFromData}
                pagination={false}
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab={"Kho Việt Nam"}>
            <div className="tableBoxNon mt-4">
              <DataTable
                rowKey={"Id"}
                key={"2"}
                columns={columnsWarehouse}
                data={warehouseToData}
                pagination={false}
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane key="3" tab={"Phương thức vận chuyển"}>
            <div className="tableBoxNon mt-4">
              <DataTable
                rowKey={"Id"}
                key={"3"}
                columns={columnsMethod}
                data={shippingType}
                pagination={false}
              />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
      {modalWarehouse && (
        <AddNewWareHouseForm
          onCancel={() => setModalWarehouse(false)}
          visible={modalWarehouse}
          refetchFrom={refetchFrom}
          refetchTo={refetchTo}
        />
      )}
      {modalMethod && (
        <AddNewMethod
          onCancel={() => setModalMethod(false)}
          visible={modalMethod}
          refetchMethod={refetchMethod}
        />
      )}
      {item.current && (
        <EditComponent
          onCancel={() => {
            item.current = null;
            setModalEdit(false);
          }}
          visible={modalEdit}
          defaultValues={item.current}
          refetchFrom={refetchFrom}
          refetchTo={refetchTo}
          refetchMethod={refetchMethod}
        />
      )}
    </>
  );
};
Index.displayName = SEOConfigs?.settings.wareHouse;
Index.breadcrumb = breadcrumb.settings.wareHouse;
Index.Layout = Layout;

export default Index;
