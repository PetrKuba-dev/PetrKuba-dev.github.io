import Hero from '../hp_sections/Hero';
import SelectedWork from '../hp_sections/Work';
import About from '../hp_sections/About';
import ContactCTA from '../hp_sections/ContactCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <About />
      <ContactCTA />
    </>
  );
}
