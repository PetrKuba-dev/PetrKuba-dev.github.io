import './index.css';
import { Routes, Route, useLocation } from 'react-router-dom';

import Layout from './Layout';

import Header from './components/Header';
import Footer from './components/Footer';

import ContactPage from './pages/Contact';
import HomePage from './pages/Home';
import AboutMePage from './pages/AboutMe';
import WorkPage from './pages/Work';

import { LocaleProvider, LocalePreferenceRedirect } from './i18n/LocaleProvider.jsx';
import { ThemeProvider } from './theme/ThemeProvider.jsx';

function LocalizedShell() {
  const location = useLocation();

  return (
    <ThemeProvider>
      <LocaleProvider>
        <LocalePreferenceRedirect />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="work" element={<WorkPage />} />
                <Route path="about-me" element={<AboutMePage />} />
                <Route path="contact" element={<ContactPage />} />
              </Route>
              <Route path="/cs" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="work" element={<WorkPage />} />
                <Route path="about-me" element={<AboutMePage />} />
                <Route path="contact" element={<ContactPage />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </LocaleProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return <LocalizedShell />;
}
