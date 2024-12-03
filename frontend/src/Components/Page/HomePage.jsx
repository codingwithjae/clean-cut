import React from 'react'
import HeroSection from '../Organisms/HeroSection'
import ShortenForm from '../Molecules/ShortenForm'
import { useLinks } from '../../contexts/LinksContext'

export default function HomePage() {
  const { addLink } = useLinks()
  return (
    <>
      <HeroSection />
      <ShortenForm onCreateLink={addLink} />
    </>
  )
}
