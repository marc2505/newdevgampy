import React, { useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import Dropdown from "react-bootstrap/Dropdown";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSearchContext } from "../../contexts/ContextSearch";

export default function Header(props) {
    const naviguate = useNavigate();
    const { setRecherche, setDateDebut, setDateFin, setFiltre } =
        useSearchContext();
    const userLocal = JSON.parse(localStorage.getItem("USER"));
    const { user, token, setUser, setToken } = useStateContext();

    const onLogout = (ev) => {
        ev.preventDefault();
        axiosClient.post("/logout").then(() => {
            setUser(null);
            setToken(null);
            naviguate("/");
        });
    };

    return (
        <div>
            <Navbar expand="lg" className="bg-white poppins">
                <Container>
                    <Navbar.Brand
                        as={Link}
                        to="#"
                        onClick={() => {
                            setRecherche(null);
                            setDateDebut(null);
                            setDateFin(null);
                            setFiltre(null);
                            naviguate("/");
                        }}
                    >
                        <img
                            src="/logoGampySansBG-2.png"
                            width="150px"
                            height="80px"
                            className=""
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="mx-auto my-2 my-lg-0"
                            style={{ maxHeight: "100px", fontSize: "20px" }}
                            navbarScroll
                        >
                            {userLocal && userLocal.role == "user" ? (
                                <>
                                    <Nav.Link
                                        as={Link}
                                        to="/devenirHote"
                                        className="mx-3"
                                    >
                                        Devenir hôte
                                    </Nav.Link>
                                    <Nav.Link
                                        as={Link}
                                        to="#"
                                        onClick={onLogout}
                                        className="mx-3"
                                    >
                                        Se déconnecter
                                    </Nav.Link>
                                </>
                            ) : userLocal && userLocal.role == "admin" ? (
                                <>
                                    <Nav.Link
                                        as={Link}
                                        to="#"
                                        onClick={onLogout}
                                        className="mx-3"
                                    >
                                        Se déconnecter
                                    </Nav.Link>
                                </>
                            ) : (
                                <>
                                    <Nav.Link
                                        as={Link}
                                        to="/signup"
                                        className="mx-3"
                                    >
                                        Inscription
                                    </Nav.Link>
                                    <Nav.Link
                                        as={Link}
                                        to="/login"
                                        className="mx-3"
                                    >
                                        Connexion
                                    </Nav.Link>
                                    <Nav.Link
                                        as={Link}
                                        to="/devenirHote"
                                        className="mx-3"
                                    >
                                        Devenir hôte
                                    </Nav.Link>
                                </>
                            )}
                        </Nav>
                        <div className="d-flex">
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant=""
                                    id="dropdown-basic"
                                    className="btn-profile"
                                >
                                    <GiHamburgerMenu id="iconHamburger" />
                                    <FaUserAlt id="iconProfile" />
                                </Dropdown.Toggle>
                                {userLocal == null && (
                                    <>
                                        <Dropdown.Menu className="text-center">
                                            <Dropdown.Item
                                                as={Link}
                                                to="/signup"
                                            >
                                                S'inscrire
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                as={Link}
                                                to="/login"
                                            >
                                                Se connecter
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                as={Link}
                                                to="/devenirHote"
                                            >
                                                Devenir hôte
                                            </Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/faq">
                                                FAQ
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                as={Link}
                                                to="/contact"
                                            >
                                                Contact
                                            </Dropdown.Item>
                                            {/* <Dropdown.Item as={Link} to="/admin/login">Login administrateur</Dropdown.Item> */}
                                        </Dropdown.Menu>
                                    </>
                                )}
                                {userLocal && userLocal.role != "admin" && (
                                    <>
                                        <Dropdown.Menu className="text-center">
                                            <div>{userLocal.name}</div>
                                            <Dropdown.Item
                                                as={Link}
                                                to="/profile"
                                            >
                                                Gestion du profil
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                as={Link}
                                                to={`/gestionAnnonce/${userLocal.id}`}
                                            >
                                                Gestion des annonces
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                as={Link}
                                                to="#"
                                                onClick={onLogout}
                                            >
                                                Se déconnecter
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </>
                                )}
                                {userLocal && userLocal.role == "admin" && (
                                    <>
                                        <Dropdown.Menu className="text-center">
                                            <Dropdown.Item
                                                as={Link}
                                                to="/dashboard"
                                            >
                                                Admin : {userLocal.name}
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                as={Link}
                                                to="/profile"
                                            >
                                                Gestion du profil
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                as={Link}
                                                to="/admin/login"
                                            >
                                                Côté administrateur
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                as={Link}
                                                to="#"
                                                onClick={onLogout}
                                            >
                                                Se déconnecter
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </>
                                )}
                            </Dropdown>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}
