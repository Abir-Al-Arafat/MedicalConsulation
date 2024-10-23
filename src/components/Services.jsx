"use client";

import { useGetAllServicesQuery } from "../../redux/apiSlices/servicesSlices";

function Services({
  title,
  titleStyle,
  containerBg,
  selectedItem,
  setSelectedItem,
}) {
  const { data, isError, error } = useGetAllServicesQuery({});

  // Function to handle selecting an item
  const handleSelectItem = (item) => {
    setSelectedItem(item); // Set the clicked item as the selected item
  };

  return (
    <section id="services" className={`${containerBg || "bg-primary3 py-20"}`}>
      <div className="container mx-auto">
        <h1
          className={`${
            titleStyle ||
            "text-primary10 text-[32px] leading-[22px] font-merri mb-6 font-bold"
          } `}
        >
          {title || "Services"}
        </h1>

        <div className="grid grid-cols-4 gap-4 items-center">
          {data?.data.map((service, index) => (
            <div
              key={index}
              onClick={() => handleSelectItem(service)}
              className={`cursor-pointer p-4 rounded-sm h-52 flex flex-col justify-between flex-1 
                ${
                  selectedItem === service
                    ? "bg-primary6 text-white"
                    : "bg-white border border-neutral4"
                }`} // Conditional styles for the selected item
            >
              <h1 className={`text-lg font-roboto font-bold`}>
                {service?.title}
              </h1>
              <p className={`text-base font-roboto font-medium`}>
                $ {service?.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
