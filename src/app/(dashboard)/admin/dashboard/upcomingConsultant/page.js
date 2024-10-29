"use client";

import {
  Button,
  Dropdown,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Typography,
  message,
} from "antd";
import { Edit, MoreVertical, Notebook, Plus } from "lucide-react";
import { MdAssignment, MdDone } from "react-icons/md";
import {
  useAddZoomLinkMutation,
  useAssignDoctorToAppointmentMutation,
  useCancelAppointmentMutation,
  useCompleteAppointmentMutation,
  useGetAllAppointmentQuery,
} from "../../../../../../redux/apiSlices/appointmentsSlices";

import { CloseCircleFilled } from "@ant-design/icons";
import { useState } from "react";
import Swal from "sweetalert2";
import { useAllDoctorQuery } from "../../../../../../redux/apiSlices/authSlice";
import SelectBox from "../../../../../components/dashboard/share/SelectBox";

// Define Props type

const { Text } = Typography;

const selectOptions = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];
// Correctly specify props
const UpcomingConsultant = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [form] = Form.useForm();
  const [openModel, setOpenModel] = useState(false);
  const [showSizeChange, onShowSizeChange] = useState(10);
  const [userData, setUserData] = useState(null);
  const [selectAppointment, setAppointment] = useState(null);
  const [selectItem, setSelectedItem] = useState("");
  const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);

  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [openZoomModal, setOpenZoomModal] = useState(false);
  const [openAssignDoctor, setAssignDoctor] = useState(false);

  // console.log(showSizeChange);

  const [value, setValue] = useState(3);
  const [selectedValue, setSelectedValue] = useState();
  const { data: AllAppointment } = useGetAllAppointmentQuery({
    page: currentPage,
    limit: showSizeChange,
    status: selectedValue === "all" || !selectedValue ? "" : selectedValue,
  });
  // console.log(AllAppointment);
  const handleSelectChange = (value) => {
    setSelectedValue(value);
    // console.log("Selected", value);
  };

  const handleDoctorClick = (record) => {
    console.log(record);
    form.setFieldsValue({
      doctorId: record?.doctorId?._id,
      appointmentId: record?._id,
    });
    setAppointment(record);
    setAssignDoctor(true);
  };

  const handleZoomLink = (record) => {
    setAppointment(record);
    record?.zoomLink && form.setFieldValue("zoom_link", record?.zoomLink);
    console.log(record);
    setOpenZoomModal(true);
  };

  const [AddZoomLink] = useAddZoomLinkMutation();
  const [assignDoctor] = useAssignDoctorToAppointmentMutation();
  const [cancelAppointment] = useCancelAppointmentMutation();
  const [completedAppointment] = useCompleteAppointmentMutation();
  const handleCreateZoom = (values) => {
    AddZoomLink({
      appointmentId: selectAppointment?._id,
      zoomLink: values?.zoom_link,
      email: selectAppointment?.patientEmail,
    }).then((res) => {
      console.log(res);
      if (res?.data) {
        Swal.fire({
          title: "Success",
          text: res.data?.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        setOpenZoomModal(false);
        form.resetFields();
      } else if (res?.error) {
        Swal.fire({
          title: "Error",
          text: res?.error?.data?.message,
          icon: "error",
          confirmButtonText: "OK",
        });
        form.resetFields();
      }
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleCancel = () => {
    setOpenModel(false);
    form.resetFields();
    setOpenPrescriptionModal(false);
    setOpenNoteModal(false);
    setOpenZoomModal(false);
    setAssignDoctor(false);
  };

  const { data: doctor } = useAllDoctorQuery({
    limit: 500,
  });

  const doctorSelectOptions = doctor?.data?.result?.map((item) => ({
    label: item?.name + " - " + item?.email,
    value: item?._id,
  }));

  const columns = [
    {
      title: "Doctor Email",
      dataIndex: "doctorId",
      key: "doctorId",
      render: (_, record) => (
        <div code className="">
          {record?.doctorId?.email}
        </div>
      ),
    },
    {
      title: "Patient Email",
      dataIndex: "patientEmail",
      key: "patientEmail",
    },
    {
      title: "Date Of Week",
      dataIndex: "dayOfWeek",
      key: "dayOfWeek",
    },

    {
      title: "Date and Time",
      dataIndex: "dateTime",
      key: "dateTime",
      render: (_, record) => (
        <Text code className="text-[#71717A]">
          {new Date(record?.dateTime).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (_, record) => (
        <div
          className={`${
            record?.paymentStatus === "paid"
              ? "text-green-500"
              : record?.paymentStatus === "unpaid"
              ? "text-red-500"
              : "text-yellow-500"
          }`}
        >
          {record.paymentStatus}
        </div>
      ),
    },

    {
      title: "Consultation type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Zoom Link",
      dataIndex: "zoomLink",
      key: "zoomLink",
      render: (_, record) => (
        <div className="flex flex-col gap-2 items-start w-24">
          {record?.zoomLink && (
            <Text
              type="secondary"
              copyable={{
                text: record?.zoomLink,
                onCopy: () => {
                  message.success("Link Copied");
                },
              }}
              role="link"
              className="text-[#71717A]"
            >
              {record?.zoomLink?.slice(0, 20)}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <div
          className={`${
            record?.status === "upcoming"
              ? "text-yellow-500"
              : record?.status === "completed"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {record.status}
        </div>
      ),
    },
    {
      title: "Documents",
      dataIndex: "details",
      key: "details",
      render: (_, record) => (
        <div className="flex flex-col gap-2 items-center">
          {/* )} */}
          {/* {record?.notes?.length > 0 && ( */}

          {/* )} */}

          <Dropdown
            menu={{
              items: [
                record?.status !== "completed" && {
                  key: "1",
                  label: (
                    <Button
                      onClick={() => handleZoomLink(record)}
                      type="secondary"
                      icon={
                        record?.zoomLink ? (
                          <Edit size={20} />
                        ) : (
                          <Plus size={20} />
                        )
                      }
                      size="small"
                    >
                      {record?.zoomLink ? "Edit Zoom" : "Add Zoom"}
                    </Button>
                  ),
                },
                {
                  key: "2",
                  label: (
                    <Button
                      onClick={() => handleNoteClick(record)}
                      type="secondary"
                      icon={<Notebook size={20} />}
                      size="small"
                    >
                      Note
                    </Button>
                  ),
                },
                {
                  key: "3",
                  label: (
                    <Button
                      icon={<Notebook size={20} />}
                      onClick={() => handlePrescriptionClick(record)}
                      type="secondary"
                      size="small"
                    >
                      Prescription
                    </Button>
                  ),
                },
                record?.status !== "completed" && {
                  key: "4",
                  label: (
                    <Button
                      icon={<MdAssignment size={20} />}
                      onClick={() => handleDoctorClick(record)}
                      type="secondary"
                      size="small"
                    >
                      Assign Doctor
                    </Button>
                  ),
                },
                record?.status !== "completed" && {
                  key: "5",
                  label: (
                    <Button
                      icon={<MdDone size={20} />}
                      onClick={() => handleCompletedClick(record)}
                      type="secondary"
                      size="small"
                    >
                      Completed
                    </Button>
                  ),
                },
                record?.status !== "completed" && {
                  key: "4",
                  label: (
                    <Button
                      icon={<CloseCircleFilled size={20} />}
                      onClick={() => handleCancelClick(record)}
                      type="secondary"
                      size="small"
                      danger
                    >
                      Cancel
                    </Button>
                  ),
                },
              ],
            }}
            placement="bottomRight"
          >
            <Button icon={<MoreVertical size={20} />} />
          </Dropdown>
        </div>
      ),
    },
    // {
    //   title: "Ratings",
    //   dataIndex: "rating", // Use "rating" data field (numeric value)
    //   key: "rating",
    //   render: (rating) => <Rate className="custom-rate" disabled value={rating} />, // Display stars
    // }
  ];

  const handlePage = (page) => {
    setCurrentPage(page);
  };

  const handlePrescriptionClick = (record) => {
    // console.log(record?.prescription);
    setSelectedItem(record?.prescription);
    setOpenPrescriptionModal(true);
  };
  const handleNoteClick = (record) => {
    console.log(record);
    setSelectedItem(record?.notes);
    setOpenNoteModal(true);
  };

  // console.log(selectItem);

  const handleCompletedClick = (record) => {
    console.log(record);
    Swal.fire({
      title: "Are you sure?",
      text: "Completed this appointment!",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "gray",
      confirmButtonText: "Yes, completed it!",
    }).then((result) => {
      if (result.isConfirmed) {
        completedAppointment({
          appointmentId: record?._id,
          patientId: record?.patientId,
        }).then((res) => {
          if (res.data) {
            Swal.fire({
              title: "Good job!",
              text: "Appointment completed successfully!",
              icon: "success",
            });
          }
          if (res.error) {
            Swal.fire({
              title: "Error",
              text: res.error.data.message,
              icon: "error",
            });
          }
        });
      }
    });
  };

  const handleCancelClick = (record) => {
    console.log(record);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "gray",
      confirmButtonText: "Yes, completed it!",
    }).then((result) => {
      console.log({
        appointmentId: record?._id,
        patientId: record?.patientId,
      });
      if (result.isConfirmed) {
        cancelAppointment({
          appointmentId: record?._id,
          patientId: record?.patientId,
        }).then((res) => {
          if (res.data) {
            Swal.fire({
              title: "Good job!",
              text: "Appointment cancelled successfully!",
              icon: "success",
            });
          }
          if (res.error) {
            Swal.fire({
              title: "Error",
              text: res.error.data.message,
              icon: "error",
            });
          }
        });
      }
    });
  };

  const handleDoctorValues = (values) => {
    console.log(values);
    assignDoctor(values).then((res) => {
      if (res.data) {
        Swal.fire({
          title: "Good job!",
          text: "Doctor assigned successfully!",
          icon: "success",
        });
        setAssignDoctor(false);
      }
      if (res.error) {
        Swal.fire({
          title: "Error",
          text: res.error.data.message,
          icon: "error",
        });
        setAssignDoctor(false);
      }
    });
  };

  return (
    <div className="py-1">
      <div className="flex justify-between">
        <h1 className="p-4 ">
          <span className="text-xl font-bold">All Appointments</span> (
          {AllAppointment?.data?.total ? AllAppointment?.data?.total : 0}{" "}
          Consultant)
        </h1>
        <div>
          <SelectBox
            placeholder="filter Status"
            options={selectOptions}
            onChange={handleSelectChange}
            style={{ width: 150 }}
          />
        </div>
      </div>
      <div className="py-2">
        <Table
          dataSource={AllAppointment?.data?.result}
          columns={columns}
          pagination={{
            showSizeChange,
            total: AllAppointment?.data?.total,
            current: currentPage,
            onChange: handlePage,
            onShowSizeChange: (current, pageSize) => onShowSizeChange(pageSize),
          }}
          rowClassName={() => "hover:bg-transparent"}
        />
      </div>

      <Modal
        open={openPrescriptionModal}
        onClose={() => handleCancel(false)}
        onCancel={() => handleCancel(false)}
        title="Prescription"
        footer={[
          <Button key="cancel" onClick={() => handleCancel(false)}>
            Cancel
          </Button>,
        ]}
      >
        <div className="p-2">
          {selectItem?.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            selectItem?.map((item, index) => {
              console.log(item);
              return (
                <div key={item?.id} className="p-2 flex flex-col gap-3">
                  <div className="flex gap-2 items-center">
                    <span className="text-lg text-gray-900">
                      {" "}
                      {index + 1}.{" "}
                    </span>
                    <p className="text-lg font-semibold text-gray-900">
                      {item?.title}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 border border-dashed p-3 rounded-lg">
                    {item?.content}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </Modal>
      <Modal
        onCancel={() => handleCancel(false)}
        footer={[
          <Button key="cancel" onClick={() => handleCancel(false)}>
            Cancel
          </Button>,
        ]}
        open={openNoteModal}
        onClose={() => handleCancel(false)}
        title="Notes"
      >
        <div className="p-2  ">
          {selectItem?.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            selectItem?.map((item, index) => {
              console.log(item);
              return (
                <div key={item?.id} className="p-2 flex flex-col gap-3">
                  <div className="flex gap-2 items-center">
                    <span className="text-lg text-gray-900">
                      {" "}
                      {index + 1}.{" "}
                    </span>
                    <p className="text-lg font-semibold text-gray-900">
                      {item?.title}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 border border-dashed p-3 rounded-lg">
                    {item?.content}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </Modal>
      <Modal
        onCancel={() => handleCancel(false)}
        footer={null}
        open={openZoomModal}
        onClose={() => handleCancel(false)}
        title="Zoom Link"
        centered
      >
        <Form
          form={form}
          name="basic"
          onFinish={handleCreateZoom}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="zoom_link"
            rules={[
              { required: true, message: "Please input your zoom link!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item className="w-full flex justify-end">
            <Button
              type="text"
              size="middle"
              className=" bg-primary6 text-white"
              htmlType="submit"
            >
              {selectAppointment?.zoomLink
                ? "Update Zoom Link"
                : "Add Zoom Link"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        onCancel={() => handleCancel(false)}
        footer={null}
        open={openAssignDoctor}
        onClose={() => handleCancel(false)}
        title="Assign Doctor"
        centered
      >
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={handleDoctorValues}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item name="appointmentId" style={{ display: "none" }}>
            <Input />
          </Form.Item>
          <Form.Item name="doctorId" label="Doctors">
            <Select
              showSearch
              placeholder="doctor"
              style={{ flex: 1 }}
              className="w-full bg-white rounded mb-4 border border-primary6"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={doctorSelectOptions}
            />
          </Form.Item>
          <Form.Item className="w-full flex justify-end">
            <Button
              type="text"
              size="middle"
              className=" bg-primary6 text-white"
              htmlType="submit"
            >
              {selectAppointment?.doctorId?._id
                ? "Update Doctor"
                : "Add Doctor"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UpcomingConsultant;
