import { IconosDescripcion } from "./IconosDescripcion";

export function TablaHoras({ listaHoras }) {
    return (
        <div className="tabla">
            <table className="tabla-prediccion">
                <tbody>
                    <tr>
                        <td className="encabezado"></td>
                        {listaHoras.map((h, index) => (
                            <td key={index} className="hora">{h.hora}:00</td>
                        ))}
                    </tr>
                    <tr>
                        <td className="encabezado"></td>
                        {listaHoras.map((h, index) => (
                            <td key={index} className="icono">
                                <IconosDescripcion descripcion={h.estadoCielo} />
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td className="encabezado">Temperatura</td>
                        {listaHoras.map((h, index) => (
                            <td key={index}>{h.temperatura}ºC</td>
                        ))}
                    </tr>
                    <tr>
                        <td className="encabezado">Precipitaciones</td>
                        {listaHoras.map((h, index) => (
                            <td key={index}>{h.precipitacion} mm</td>
                        ))}
                    </tr>
                    <tr>
                        <td className="encabezado">Viento</td>
                        {listaHoras.map((h, index) => (
                            <td key={index} className="viento">
                                <span>{h.vientoDireccion}</span>
                                <span>{h.vientoVelocidad} km/h</span>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}