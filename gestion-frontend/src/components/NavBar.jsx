import { useState } from 'react';

import {
    Home,
    PlusCircle,
    BarChart3,
    Pencil,
    LogOut,
    User,
    CalendarDays,
    ClipboardList
} from "lucide-react";

import './Navbar.css';

const Navbar = ({
    username = "Usuario",
    onLogout,
    setVistaActual
}) => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] =
        useState(false);

    const [activeDropdown, setActiveDropdown] =
        useState(null);

    // Inicial del usuario

    const inicial = username
        ? username.charAt(0).toUpperCase()
        : 'U';

    // Menú móvil

    const toggleMobileMenu = () => {

        setIsMobileMenuOpen(
            !isMobileMenuOpen
        );
    };

    // Dropdown

    const toggleDropdown = (index, e) => {

        e.preventDefault();

        setActiveDropdown(
            activeDropdown === index
                ? null
                : index
        );
    };

    return (

        <section className="navigation">

            <div className="nav-container">

                {/* LOGO */}

                <div className="brand">

                    <a
                        href="#!"

                        onClick={() =>
                            setVistaActual("inicio")
                        }
                    >

                        <CalendarDays
                            size={20}
                            style={{
                                marginRight: '8px'
                            }}
                        />

                        Gestión de Eventos

                    </a>

                </div>

                <nav>

                    {/* MENÚ HAMBURGUESA */}

                    <div className="nav-mobile">

                        <a
                            id="nav-toggle"
                            href="#!"
                            className={
                                isMobileMenuOpen
                                    ? 'active'
                                    : ''
                            }

                            onClick={toggleMobileMenu}
                        >

                            <span></span>

                        </a>

                    </div>

                    {/* MENÚ */}

                    <ul
                        className="nav-list"

                        style={{
                            display:
                                isMobileMenuOpen
                                    ? 'block'
                                    : ''
                        }}
                    >

                        {/* INICIO */}

                        <li>

                            <a
                                href="#!"

                                onClick={() =>
                                    setVistaActual("inicio")
                                }
                            >

                                <Home size={18} />

                                <span
                                    style={{
                                        marginLeft: '8px'
                                    }}
                                >
                                    Inicio
                                </span>

                            </a>

                        </li>

                        {/* DROPDOWN */}

                        <li className="dropdown-wrapper">

                            <a
                                href="#!"

                                onClick={(e) =>
                                    toggleDropdown(1, e)
                                }
                            >

                                <ClipboardList
                                    size={18}
                                />

                                <span
                                    style={{
                                        marginLeft: '8px'
                                    }}
                                >
                                    Acciones
                                </span>

                            </a>

                            <ul
                                className="nav-dropdown"

                                style={{
                                    display:
                                        activeDropdown === 1
                                            ? 'block'
                                            : ''
                                }}
                            >

                                {/* CREAR EVENTO */}

                                <li>

                                    <a
                                        href="#!"

                                        onClick={() =>
                                            setVistaActual("crear")
                                        }
                                    >

                                        <PlusCircle
                                            size={17}
                                        />

                                        <span
                                            style={{
                                                marginLeft: '8px'
                                            }}
                                        >
                                            Crear Evento
                                        </span>

                                    </a>

                                </li>

                                {/* MIS EVENTOS */}

                                <li>

                                    <a
                                        href="#!"

                                        onClick={() =>
                                            setVistaActual(
                                                "misEventos"
                                            )
                                        }
                                    >

                                        <Pencil
                                            size={17}
                                        />

                                        <span
                                            style={{
                                                marginLeft: '8px'
                                            }}
                                        >
                                            Mis Eventos
                                        </span>

                                    </a>

                                </li>

                                {/* ESTADÍSTICAS */}
                                <li>

                                    <a
                                        href="#!"

                                        onClick={() =>
                                            setVistaActual(
                                                "estadisticas"
                                            )
                                        }
                                    >

                                        <BarChart3
                                            size={17}
                                        />

                                        <span
                                            style={{
                                                marginLeft: '8px'
                                            }}
                                        >
                                            Estadísticas
                                        </span>

                                    </a>

                                </li>

                            </ul>

                        </li>

                        {/* PERFIL */}

                        <li className="user-profile-item">

                            <div className="user-profile-box">

                                {/* AVATAR */}

                                <div className="user-avatar">

                                    {inicial}

                                </div>

                                {/* INFO */}

                                <div className="user-info">

                                    <span className="user-name">

                                        <User
                                            size={14}
                                            style={{
                                                marginRight: '5px'
                                            }}
                                        />

                                        {username}

                                    </span>

                                    <span className="user-role">

                                        Organizador

                                    </span>

                                </div>

                            </div>

                        </li>

                        {/* LOGOUT */}

                        <li>

                            <a
                                href="#!"

                                onClick={onLogout}

                                style={{
                                    color: '#ff6b6b'
                                }}
                            >

                                <LogOut size={18} />

                                <span
                                    style={{
                                        marginLeft: '8px'
                                    }}
                                >
                                    Cerrar Sesión
                                </span>

                            </a>

                        </li>

                    </ul>

                </nav>

            </div>

        </section>
    );
};

export default Navbar;