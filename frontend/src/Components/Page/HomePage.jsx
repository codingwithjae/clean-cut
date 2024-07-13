import React from "react";
import MainTemplate from "../Templates/MainTemplate";
import HeroSection from "../Organisms/HeroSection";
import ShortenForm from "../Molecules/ShortenForm";

export default function HomePage() {
  return (
    <MainTemplate>
      <HeroSection />
      <ShortenForm />
    </MainTemplate>
  );
}