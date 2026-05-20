
const Navbar = ({ username = "Usuario" }) => {
    //Se toma la primera letra del nombre para usarla como inicial del Avatar
    const inicial = username.charAt(0).toUpperCase();

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 40px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '30px',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            {/* Logo o Título del Sistema */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>📅</span>
                <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#333', fontWeight: 'bold' }}>
                    Gestión de Eventos
                </h2>
            </div>

            {/* Sección del Perfil del Usuario */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                backgroundColor: '#f8f9fa',
                padding: '6px 14px',
                borderRadius: '25px',
                border: '1px solid #e9ecef'
            }}>
                {/* Avatar Circular con Inicial */}
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    boxShadow: '0 2px 4px rgba(0,123,255,0.2)'
                }}>
                    {inicial}
                </div>

                {/* Información de texto */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: '600', 
                        color: '#495057' 
                    }}>
                        {username}
                    </span>
                    <span style={{ 
                        fontSize: '0.75rem', 
                        color: '#6c757d',
                        marginTop: '-2px' 
                    }}>
                        Organizador
                    </span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;