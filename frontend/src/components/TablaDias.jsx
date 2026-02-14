import { IconosDescripcion } from "./IconosDescripcion";
import { FormatearFecha } from "./FormatearFecha";

export function TablaDias({ dias }) {
    return (
        <table className="tabla-prediccion">
            <tbody>
                <tr>
                    <td className="encabezado-vacio"></td>
                    {dias.map((dia, index) => (
                        <td key={index} className="fecha">
                            <FormatearFecha fecha={dia.fecha} />
                        </td>
                    ))}
                </tr>
                <tr>
                    <td className="encabezado-vacio"></td>
                    {dias.map((dia, index) => (
                        <td key={index} className="temp-dia">{dia.tempGeneral !== "" ? `${dia.tempGeneral}ºC` : ""}</td>
                    ))}
                </tr>
                <tr>
                    <td className="encabezado-vacio"></td>
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
            </tbody>
        </table>
    )
}
