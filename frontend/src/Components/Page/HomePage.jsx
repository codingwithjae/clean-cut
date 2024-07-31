import React from 'react';
import Navbar from '../Organisms/Navbar';
import MainTemplate from '../Templates/MainTemplate';
import HeroSection from '../Organisms/HeroSection';
import ShortenForm from '../Molecules/ShortenForm';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <MainTemplate>
        <HeroSection />
        <ShortenForm />
      </MainTemplate>
    </>
  );
}
