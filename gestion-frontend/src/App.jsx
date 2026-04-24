import { useState } from 'react';
import ListaEventos from './components/ListaEventos';
import FormularioEvento from './components/FormularioEvento';

function App() {
  const [recargar, setRecargar] = useState(0);

  // Función para forzar la actualización de la lista cuando se crea un evento nuevo
  const refrescarLista = () => setRecargar(prev => prev + 1);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', margin: '40px 0' }}>
        <h1>Sistema de Gestión de Eventos 🚀</h1>
      </header>
      
      <section>
        <FormularioEvento onEventoCreado={refrescarLista} />
      </section>
      
      <hr style={{ margin: '40px 0' }} />
      
      <section>
        {/* Usar la 'key' dinámica hace que el componente se reinicie y vuelva a pedir los datos */}
        <ListaEventos key={recargar} />
      </section>
    </div>
  );
}

export default App;