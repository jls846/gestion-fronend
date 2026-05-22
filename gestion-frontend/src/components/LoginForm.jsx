import './LoginForm.css';

export default function LoginForm({
    handleLogin,
    credentials,
    setCredentials,
    setMostrarRegistro
}) {

    return (

        <div className="login-container">

            <div className="login-card">

                <h1 className="login-title">
                    Iniciar Sesión
                </h1>

                <form onSubmit={handleLogin}>

                    <div className="input-container">

                        <input
                            type="text"
                            required
                            value={credentials.user}
                            onChange={(e) =>
                                setCredentials({
                                    ...credentials,
                                    user: e.target.value
                                })
                            }
                        />

                        <label>Usuario</label>

                        <div className="bar"></div>

                    </div>

                    <div className="input-container">

                        <input
                            type="password"
                            required
                            value={credentials.pass}
                            onChange={(e) =>
                                setCredentials({
                                    ...credentials,
                                    pass: e.target.value
                                })
                            }
                        />

                        <label>Contraseña</label>

                        <div className="bar"></div>

                    </div>

                    <div className="button-container">

                        <button type="submit">
                            <span>Entrar</span>
                        </button>

                    </div>

                    <div className="footer">

                        <button
                            type="button"
                            onClick={() =>
                                setMostrarRegistro(true)
                            }
                        >
                            Crear cuenta
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}