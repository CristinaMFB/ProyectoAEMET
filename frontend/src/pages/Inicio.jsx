import { BuscadorMunicipio } from "../components/BuscadorMunicipio";
import { BuscadorDesplegables } from "../components/BuscadorDesplegables";

export function Inicio() {
  return (
    <div>
      <h1>Predicción meteorológica - DWEC</h1>
      {/*BÚSQUEDAS*/}
      <BuscadorMunicipio />
      <BuscadorDesplegables />
    </div>
  );
}
