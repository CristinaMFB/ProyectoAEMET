import { IconosDescripcion } from "./IconosDescripcion";
import { FormatearFecha } from "./FormatearFecha";
import { Link } from "react-router-dom";

export function TablaDias({ dias, horas, idMunicipio}) {

    //Función para saber si un día tiene predicción horaria, ya que no todos los días de la tabla aparecen en la predicción horaria (solo los primeros días)
    function tienePredHoras(fechaDia) {
        if(!horas) return false;
        //Fecha únicamente en formato XXXX-XX-XX
        const fechaSinHora = fechaDia.split("T")[0];
        return horas.some(h => h.fecha .split("T")[0] === fechaSinHora);
    }

    return (
        <table className="tabla-prediccion">
            <tbody>
                <tr>
                    <td className="encabezado"></td>
                    {dias.map((dia, index) => (
                        <td key={index} className="fecha">
                            <FormatearFecha fecha={dia.fecha} />
                        </td>
                    ))}
                </tr>
                <tr>
                    <td className="encabezado"></td>
                    {dias.map((dia, index) => (
                        <td key={index} className="temp-dia">{dia.tempGeneral !== "" ? `${dia.tempGeneral}ºC` : ""}</td>
                    ))}
                </tr>
                <tr>
                    <td className="encabezado"></td>
                    {dias.map((dia, index) => (
                        <td key={index} className="icono">
                            <IconosDescripcion descripcion={dia.estadoCielo} />
                        </td>
                    ))}
                </tr>
                <tr>
                    <td className="encabezado">Temperaturas máx. y mín.</td>
                    {dias.map((dia, index) => (
                        <td key={index} className="temp">
                            <span className="temp-min">{dia.temperaturaMin}ºC</span>
                            <span className="temp-max">{dia.temperaturaMax}ºC</span>
                        </td>
                    ))}
                </tr>
                <tr>
                    <td className="encabezado">Precipitaciones</td>
                    {dias.map((dia, index) => (
                        <td key={index}>{dia.probPrecipitacion}%</td>
                    ))}
                </tr>
                <tr>
                    <td className="encabezado">Viento</td>
                    {dias.map((dia, index) => (
                        <td key={index} className="viento">
                            <span>{dia.vientoDireccion}</span>
                            <span>{dia.vientoVelocidad}km/h</span>
                        </td>
                    ))}
                </tr>
                <tr>
                    <td className="encabezado">Predicción por horas</td>
                    {dias.map((d, index) => (
                        <td key={index}>
                            {tienePredHoras(d.fecha) ? (
                                <Link to={`/prediccion-horas?id=${idMunicipio}&dia=${d.fecha}`} className="botonHoras">Mostrar</Link>
                                ) : (
                                    <span className=""></span>
                                )
                            }
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    );
}
