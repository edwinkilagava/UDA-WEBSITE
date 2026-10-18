
import Navbar from "./components/common/Navbar.jsx";
import Footer from "./components/common/Footer";
import AppRoutes from "./Routes/AppRoutes";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <AppRoutes />
      </main>

      <Footer />
    </>
  );
}

export default App;
