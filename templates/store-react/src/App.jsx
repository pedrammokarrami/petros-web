import { useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider }  from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Navbar            from './components/Navbar';
import BottomNav         from './components/BottomNav';
import BackToTop         from './components/BackToTop';
import ScrollProgress    from './components/ScrollProgress';
import LoadingScreen     from './components/LoadingScreen';
import Home              from './pages/Home';
import Products          from './pages/Products';
import ProductDetail     from './pages/ProductDetail';
import Cart              from './pages/Cart';
import Checkout          from './pages/Checkout';
import About             from './pages/About';
import Search            from './pages/Search';
import TryOn             from './pages/TryOn';
import Settings          from './pages/Settings';

const ease = [0.25, 0.1, 0.25, 1];

function Wrap({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.22, ease }}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location   = useLocation();
  const background = location.state?.background;

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={background || location} key={(background || location).pathname}>
          <Route path="/"            element={<Wrap><Home /></Wrap>} />
          <Route path="/products"    element={<Wrap><Products /></Wrap>} />
          <Route path="/cart"        element={<Wrap><Cart /></Wrap>} />
          <Route path="/checkout"    element={<Wrap><Checkout /></Wrap>} />
          <Route path="/about"       element={<Wrap><About /></Wrap>} />
          <Route path="/search"      element={<Wrap><Search /></Wrap>} />
          <Route path="/tryon"       element={<Wrap><TryOn /></Wrap>} />
          <Route path="/settings"    element={<Wrap><Settings /></Wrap>} />
          <Route path="/product/:id" element={<Wrap><ProductDetail /></Wrap>} />
        </Routes>
      </AnimatePresence>

      <AnimatePresence>
        {background && (
          <Routes>
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        )}
      </AnimatePresence>
    </>
  );
}

function Inner() {
  return (
    <>
      <BottomNav />
      {/* محتوا: روی موبایل full-width، روی دسکتاپ کنار sidebar */}
      <div className="app-content">
        <div id="scroll-progress" />
        <ScrollProgress />
        <Navbar />
        <AppRoutes />
        <BackToTop />
      </div>
    </>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  return (
    <HashRouter>
      <ToastProvider>
        <CartProvider>
          <AnimatePresence>
            {!loaded && <LoadingScreen key="loader" onDone={() => setLoaded(true)} />}
          </AnimatePresence>
          {loaded && <Inner />}
        </CartProvider>
      </ToastProvider>
    </HashRouter>
  );
}
