import './Nav.css'
import React from 'react'
import {Link} from "react-router-dom";

export default props =>
    <aside className="menu-area">
        <nav className={"menu"}>
            <Link to={"/"}>
                <i className={"fa fa-home"}></i> Home
            </Link>
            <Link to={"/user"}>
                <i className={"fa fa-user"}></i> Cadastrar Cliente
            </Link>
            <Link to={"/users"}>
                <i className={"fa fa-users"}></i> Lista de Clientes
            </Link>
            <Link to={"/location"}>
                <i className={"fa fa-map"}></i> Localização
            </Link>
        </nav>
    </aside>
