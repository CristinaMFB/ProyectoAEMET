import { BuscadorMunicipio } from "../components/BuscadorMunicipio";
import { BuscadorDesplegables } from "../components/BuscadorDesplegables";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function Inicio() {
  return (
    <>
      <Header />
      <div className="contenedor-inicio">
        {/*BÚSQUEDAS*/}
        <div className="contenedor-busquedas">
          <div className="contenedor-busqueda">
            <h3>Búsqueda manual por municipio</h3>
            <BuscadorMunicipio />
          </div>
          <div className="contenedor-busqueda">
            <h3>Búsqueda por provincia y municipio</h3>
            <BuscadorDesplegables />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
