import React, { useContext, useEffect, useState } from "react";
import Header from "../components/layout/Header";
import { ContextSearch, useSearchContext } from "../contexts/ContextSearch";
import { useStateContext } from "../contexts/ContextProvider";
import Footer from "../components/layout/Footer";
import axiosClient from "../axios-client";
import { Link, useNavigate } from "react-router-dom";
import SearchArea from "../components/home/SearchArea";

export default function Terrains() {
    const navigate = useNavigate();
    const { user, token } = useStateContext();
    const {
        recherche,
        setRecherche,
        dateDebut,
        setDateDebut,
        dateFin,
        setDateFin,
        filtre,
        setFiltre,
    } = useSearchContext();
    const [loading, setLoading] = useState(true);
    const [terrains, setTerrains] = useState([]);
    const [tousLesTerrains, setTousLesTerrains] = useState([]);
    const [aucunChamp, setAucunChamp] = useState(false);
    const [justeDate, setJusteDate] = useState(false);
    const [msg, setMsg] = useState("");

    setTimeout(() => {
        window.scrollTo(0, 0);
    });

    useEffect(() => {
        console.log("RECHERCHE = ");
        console.log(recherche);
        console.log("DATE DEBUT = ");
        console.log(dateDebut);
        console.log("DATE FIN = ");
        console.log(dateFin);
        console.log("FILTRE = ");
        console.log(filtre);
        setLoading(true);
        axiosClient
            .get(
                `/terrains/recherche?recherche=${recherche}&dateDebut=${dateDebut}&dateFin=${dateFin}&filtre=${JSON.stringify(
                    filtre
                )}`
            )
            .then(({ data }) => {
                setLoading(false);
                console.log("Les terrains correspondant à la recherche ...");
                console.log(data);
                setMsg(data.message);
                if (data.terrains) {
                    setTerrains(data.terrains);
                } else if (data.tousLesTerrains) {
                    setTousLesTerrains(data.tousLesTerrains);
                }
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }, []);

    useEffect(() => {
        // console.log('CHANGEMENT DE LA LISTE DE TERRAINS :')
        // console.log(terrains)
    }, [terrains]);

    return (
        <div>
            <div className="container mx-auto">
                {user && Object.keys(user).length > 0 ? (
                    <Header user={user} />
                ) : (
                    <Header user={null} />
                )}
            </div>
            {loading && (
                <div className="container">
                    <h5>Chargement des terrains ...</h5>
                </div>
            )}
            {!loading && (
                <div className="container">
                    <h5>
                        {msg} (
                        {terrains.length > 0
                            ? terrains.length
                            : tousLesTerrains.length}{" "}
                        terrain
                        {terrains.length > 0
                            ? terrains.length > 1
                                ? "s"
                                : ""
                            : tousLesTerrains.length > 1
                            ? "s"
                            : ""}
                        ) :{" "}
                    </h5>
                    {/* <h5>Liste des terrains {recherche != 'vide' ? 'à '+recherche : ''} {dateDebut && dateFin ? 'du '+dateDebut+' au '+dateFin : ''} ({terrains.length} terrain{terrains.length > 1 ? 's' : ''}) : </h5> */}
                    {tousLesTerrains.length == 0 &&
                        terrains.map((t, cle) => {
                            return (
                                <div key={cle}>
                                    <Link
                                        // to={`/terrain/${t.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            localStorage.setItem(
                                                "valueStart",
                                                dateDebut
                                            );
                                            localStorage.setItem(
                                                "valueEnd",
                                                dateFin
                                            );
                                            navigate(`/terrain/${t.id}`);
                                        }}
                                        style={{
                                            color: "inherit",
                                            textDecoration: "none",
                                        }}
                                    >
                                        <div
                                            className="row my-2"
                                            style={{
                                                border: "1px solid #25632d",
                                                borderRadius: "5px 5px 5px 5px",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <div className="col-md-4 p-0">
                                                {/* <img
                                                    src={`http://localhost:8000/${
                                                        t.images_principales.split(
                                                            "|"
                                                        )[0]
                                                    }`}
                                                    width={"100%"}
                                                    height={"200px"}
                                                /> */}
                                                <img
                                                    src={`https://apidev.gampy.ch/${
                                                        t.images_principales.split(
                                                            "|"
                                                        )[0]
                                                    }`}
                                                    width={"100%"}
                                                    height={"200px"}
                                                />
                                            </div>
                                            <div className="col-md-8">
                                                <h3>{t.nom}</h3>
                                                <h5>{t.adresse}</h5>
                                                <h5>
                                                    {t.prix_nuitee} CHF / nuitée
                                                </h5>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    {tousLesTerrains.length > 0 &&
                        tousLesTerrains.map((t, cle) => {
                            return (
                                <div key={cle}>
                                    <Link
                                        // to={`/terrain/${t.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            localStorage.setItem(
                                                "valueStart",
                                                dateDebut
                                            );
                                            localStorage.setItem(
                                                "valueEnd",
                                                dateFin
                                            );
                                            navigate(`/terrain/${t.id}`);
                                        }}
                                        style={{
                                            color: "inherit",
                                            textDecoration: "none",
                                        }}
                                    >
                                        <div
                                            className="row my-2"
                                            style={{
                                                border: "1px solid #25632d",
                                                borderRadius: "5px 5px 5px 5px",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <div className="col-md-4 p-0">
                                                {/* <img
                                                    src={`http://localhost:8000/${
                                                        t.images_principales.split(
                                                            "|"
                                                        )[0]
                                                    }`}
                                                    width={"100%"}
                                                    height={"200px"}
                                                /> */}
                                                <img
                                                    src={`https://apidev.gampy.ch/${
                                                        t.images_principales.split(
                                                            "|"
                                                        )[0]
                                                    }`}
                                                    width={"100%"}
                                                    height={"200px"}
                                                />
                                            </div>
                                            <div className="col-md-8">
                                                <h3>{t.nom}</h3>
                                                <h5>{t.adresse}</h5>
                                                <h5>
                                                    {t.prix_nuitee} CHF / nuitée
                                                </h5>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    <div className="text-center">
                        <Link
                            className="btn"
                            to={"#"}
                            onClick={() => {
                                setDateDebut(null);
                                setDateFin(null);
                                setFiltre(null);
                                setRecherche(null);
                                navigate("/");
                            }}
                            style={{ background: "#25632d", color: "white" }}
                        >
                            Retour
                        </Link>
                    </div>
                </div>
            )}
            <div className="container">
                <Footer />
            </div>
        </div>
    );
}
