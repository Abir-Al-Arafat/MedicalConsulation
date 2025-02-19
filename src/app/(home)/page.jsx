"use client";

import AboutUs from "../../components/AboutUs";
import AboutUs2 from "../../components/AboutUs2";
import Banner from "../../components/Banner";
import FAQ from "../../components/FAQ";
import GiveUsReview from "../../components/GiveUsReview";
import HealthyTips from "../../components/HealthyTips";
import Services from "../../components/Services";
import Testimonials from "../../components/Testimonials";
import BookAppointment from "../../modal/BookAppointment";

function Page() {
  return (
    <>
      {/* banner section */}
      <Banner />

      {/*  about us section */}
      <AboutUs />

      {/* about us 2 section */}
      <AboutUs2 />

      {/* services section */}
      <Services />

      {/* book appointment section */}
      <BookAppointment />

      {/* FAQ section */}
      <FAQ />
      {/* testimonials section */}
      <Testimonials />

      {/* healthy section */}
      <HealthyTips />
      <GiveUsReview />
    </>
  );
}

export default Page;
