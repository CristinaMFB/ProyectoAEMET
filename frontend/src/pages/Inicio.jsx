import { BuscadorCP } from "../components/BuscadorCP";

export function Inicio() {
  return (
    <div>
      <h1>Predicción meteorológica - DWEC</h1>
      {/*BÚSQUEDAS*/}
      <BuscadorCP/>
    </div>
  );
}
