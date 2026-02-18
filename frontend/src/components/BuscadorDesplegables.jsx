import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function BuscadorDesplegables() {
    //UseState para guardar la provincia que selecciona el usuario
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");

    //UseState para guardar el municipio seleccionado
    const [municipioSeleccionado, setMunicipioSeleccionado] = useState("");

    //Listas de provincias y municipios que van a aparecer en los desplegables
    const [listaProvincias, setListaProvincias] = useState([]);
    const [listaMunicipios, setListaMunicipios] = useState([]);

    const [error, setError] = useState("");

    //Hook de React Router
    const navigate = useNavigate();

    //Cargar las provincias desde el archivo provincias.json
    useEffect(() => {
        import("../provincias.json")
            .then((datosProvincias) => { setListaProvincias(datosProvincias.default); })
            .catch(() => { 
                setError("Error al cargar las pronvincias");
            });
    }, []);

    //Cargar los municipios cuando cambia la provincia seleccionada
    useEffect(() => {
        if (!provinciaSeleccionada) {
            setListaMunicipios([]);
            return;
        }

        //Obtener los municipios de esa provincia
        fetch(`http://localhost:3000/api/provincia/${provinciaSeleccionada}/municipios`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.success) {
                    setError(data.error || "No se han podido cargar los municipios");
                    setListaMunicipios([]);
                    return;
                }
                //Guardar los municipios
                setListaMunicipios(data.municipios);
            })
            .catch(() => {
                setError("Error al conectar con el servidor");

            })
    }, [provinciaSeleccionada]);

    //Función cuando el usuario pulsa "Aceptar"
    function busqueda() {
        if (!municipioSeleccionado) {
            setError("Debe seleccionar un municipio");
            return;
        }
        //Ir a la página de predicción por días enviando el id del municipio
        navigate(`/prediccion-dias?id=${municipioSeleccionado}`);
    }

    return (
        <div>
            {error && <p className="error">{error}</p>}
            <select className="select-buscador" value={provinciaSeleccionada} onChange={(e) => setProvinciaSeleccionada(e.target.value)}>
                <option value="">Seleccione la provincia</option>
                {/*Rellenar el desplegable con las provincias*/}
                {listaProvincias.map((prov) => (
                    <option key={prov.codigo} value={prov.codigo}>{prov.nombre}</option>
                ))}
            </select>
            <br /><br />
            <select className="select-buscador" value={municipioSeleccionado} onChange={(e) => setMunicipioSeleccionado(e.target.value)}>
                <option value="">Seleccione el municipio</option>
                {/*Rellenar el desplegable con los municipios*/}
                {listaMunicipios.map((mun) => (
                    <option key={mun.id} value={mun.id}>{mun.nombre}</option>
                ))}

            </select>
            <br /><br />
            <button className="boton-buscador" onClick={busqueda}>Aceptar</button>
        </div>
    );
}