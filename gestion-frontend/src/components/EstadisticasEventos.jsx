import './EstadisticasEventos.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const EstadisticasEventos = ({ eventos }) => {

  // DATOS PARA BARRAS

  const datosBarras = eventos.map((ev) => ({
    nombre: ev.nombre,
    asistentes: ev.inscripciones?.length || 0
  }));

  // DATOS PARA PASTEL

  const totalLlenos = eventos.filter(
    ev =>
      (ev.inscripciones?.length || 0)
      >= ev.capacidadMaxima
  ).length;

  const totalDisponibles =
    eventos.length - totalLlenos;

  const datosPastel = [
    {
      name: "Eventos Llenos",
      value: totalLlenos
    },
    {
      name: "Con Cupo",
      value: totalDisponibles
    }
  ];

  const COLORS = ["#ed2553", "#262626"];

  // ESTADISTICAS

  const totalEventos = eventos.length;

  const totalInscritos = eventos.reduce(
    (acc, ev) =>
      acc + (ev.inscripciones?.length || 0),
    0
  );

  const eventoPopular = eventos.reduce(
    (max, ev) =>
      (ev.inscripciones?.length || 0)
      >
      (max.inscripciones?.length || 0)
        ? ev
        : max,
    eventos[0] || {}
  );

  return (
    <div className="estadisticas-container">

      <h2 className="estadisticas-title">
        Estadísticas de Eventos
      </h2>

      {/* CARDS */}

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Eventos</h3>
          <p>{totalEventos}</p>
        </div>

        <div className="stat-card">
          <h3>Total Inscritos</h3>
          <p>{totalInscritos}</p>
        </div>

        <div className="stat-card">
          <h3>Evento Popular</h3>
          <p>
            {eventoPopular?.nombre || "N/A"}
          </p>
        </div>

      </div>

      {/* GRAFICA BARRAS */}

      <div className="chart-card">

        <h3>Inscripciones por Evento</h3>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart data={datosBarras}>

            <XAxis dataKey="nombre" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="asistentes"
              fill="#ed2553"
              radius={[8,8,0,0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* GRAFICA PASTEL */}

      <div className="chart-card">

        <h3>Capacidad de Eventos</h3>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <PieChart>

            <Pie
              data={datosPastel}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              label
            >

              {datosPastel.map(
                (entry, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />

                )
              )}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default EstadisticasEventos;