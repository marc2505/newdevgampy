import React, { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";

export default function GestionAnnonces() {
    const navigate = useNavigate();
    const params = useParams();
    const idUser = params.idUser;
    const [terrains, setTerrains] = useState([]);
    const userLocal =
        localStorage.getItem("USER") != null
            ? JSON.parse(localStorage.getItem("USER"))
            : "vide";
    const { user, token, setUser, setToken, notification, setNotification } =
        useStateContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // alert('idUser = '+idUser)
        // console.log('USER=')
        // console.log(user)
        // console.log('USERLOCAL=')
        // console.log(userLocal)
        setLoading(true);
        axiosClient
            .get(`/getTerrainsByIdUser/${user.id}`)
            .then(({ data }) => {
                setLoading(false);
                // console.log('RETOUR DE /GETTERRAINBYIDUSER/{IDUSER}')
                // console.log(data)
                setTerrains(data.terrains);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
        // console.log('TERRAINS=')
        // console.log(terrains)
    }, []);

    return (
        <div>
            <h1 className="text-center">Mes annonces</h1>
            <div
                className="col-sm-10 col-md-8 col-lg-6 mx-auto"
                style={{ background: "lightgray" }}
            >
                <div className="row mb-5">
                    <div className="col-6 col-lg-4 text-center">
                        {userLocal && userLocal.image != null ? (
                            <img
                                src={
                                    "https://apidev.gampy.ch/" + userLocal.image
                                }
                                className="img-fluid rounded-circle"
                                style={{ maxHeight: "150px" }}
                            />
                        ) : (
                            // <img
                            //     src={"http://localhost:8000/" + userLocal.image}
                            //     className="img-fluid rounded-circle"
                            //     style={{ maxHeight: "150px" }}
                            // />
                            <img
                                src={"/profile-icon.png"}
                                className="img-fluid rounded-circle"
                                style={{ maxHeight: "150px" }}
                            />
                        )}
                    </div>
                    <div className="col-6 col-lg-8 d-flex align-items-center justify-content-center">
                        {userLocal && userLocal.name}
                    </div>
                </div>
            </div>
            <div className="row mb-5">
                <div className="col-md-12">
                    <div className="container-fluid">
                        <h3>Liste de mes annonces</h3>
                        {!loading &&
                            terrains.length > 0 &&
                            terrains.map((t, cle) => {
                                return (
                                    <div
                                        className="row mb-3"
                                        style={{
                                            border: "1px solid #25632d",
                                            borderRadius: "5px",
                                        }}
                                        key={cle}
                                    >
                                        <div className="col-12 col-sm-4 col-md-3 col-lg-4 d-flex justify-content-center align-items-center">
                                            {t.images_principales &&
                                            t.images_principales.split("|")
                                                .length > 0 ? (
                                                // <img
                                                //     src={`http://localhost:8000/${
                                                //         t.images_principales.split(
                                                //             "|"
                                                //         )[0]
                                                //     }`}
                                                //     style={{
                                                //         maxHeight: "150px",
                                                //     }}
                                                //     className="img-fluid"
                                                // />
                                                <img
                                                    src={`https://apidev.gampy.ch/${
                                                        t.images_principales.split(
                                                            "|"
                                                        )[0]
                                                    }`}
                                                    style={{
                                                        maxHeight: "150px",
                                                    }}
                                                    className="img-fluid"
                                                />
                                            ) : (
                                                // <img src={`https://apii.keums.com/${t.images_principales.split('|')[0]}`} style={{ maxHeight:'150px' }} className='img-fluid'/>
                                                <img
                                                    src={"/profile-icon.png"}
                                                    style={{
                                                        maxHeight: "150px",
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="col-12 col-sm-4 col-md-4 col-lg-4 d-flex justify-content-center align-items-center">
                                            <div>{t.nom}</div>
                                        </div>
                                        <div className="col-12 col-sm-4 col-md-5 col-lg-4 d-flex flex-column justify-content-center align-items-center text-center">
                                            <div>
                                                <Link
                                                    to={`/annonce/${t.id}/gestionAnnonce`}
                                                    className="btn"
                                                    style={{
                                                        background: "#25632d",
                                                        color: "white",
                                                    }}
                                                >
                                                    Modifier mon annonce
                                                </Link>
                                            </div>
                                            <div>
                                                Statut : {t.statut_validation}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        {!loading && terrains.length == 0 && (
                            <div className="row">
                                <h3>Pas de terrain pour l'instant ...</h3>
                                <div>
                                    <h3>
                                        Vous pouvez en rajouter en cliquant sur
                                        ce
                                        <Link
                                            to={"/annonce"}
                                            className="btn ms-2"
                                            style={{
                                                background: "#25632d",
                                                color: "white",
                                            }}
                                        >
                                            bouton
                                        </Link>
                                    </h3>
                                </div>
                            </div>
                        )}
                        {/* <div className='row mb-3' style={{ border:'1px solid #25632d' }}>
                            <div className="col-12 col-sm-4 col-md-3 col-lg-4 d-flex justify-content-center align-items-center">
                                <img src={'/profile-icon.png'} style={{ maxHeight:'150px' }}/>
                            </div>
                            <div className="col-12 col-sm-4 col-md-4 col-lg-4 d-flex justify-content-center align-items-center">
                                <div>Titre de l'annonce</div>
                            </div>
                            <div className="col-12 col-sm-4 col-md-5 col-lg-4 d-flex flex-column justify-content-center align-items-center text-center">
                                <div>Voir mon annonce</div>
                                <div>Status de l'annonce</div>
                                <div>Modifier mon annonce</div>
                            </div>
                        </div>
                        <div className='row mb-3' style={{ border:'1px solid #25632d' }}>
                            <div className="col-12 col-sm-4 col-md-3 col-lg-4 d-flex justify-content-center align-items-center">
                                <img src={'/profile-icon.png'} style={{ maxHeight:'150px' }}/>
                            </div>
                            <div className="col-12 col-sm-4 col-md-4 col-lg-4 d-flex justify-content-center align-items-center">
                                <div>Titre de l'annonce</div>
                            </div>
                            <div className="col-12 col-sm-4 col-md-5 col-lg-4 d-flex flex-column justify-content-center align-items-center text-center">
                                <div>Voir mon annonce</div>
                                <div>Status de l'annonce</div>
                                <div>Modifier mon annonce</div>
                            </div>
                        </div>
                        <div className='row mb-3' style={{ border:'1px solid #25632d' }}>
                            <div className="col-12 col-sm-4 col-md-3 col-lg-4 d-flex justify-content-center align-items-center">
                                <img src={'/profile-icon.png'} style={{ maxHeight:'150px' }}/>
                            </div>
                            <div className="col-12 col-sm-4 col-md-4 col-lg-4 d-flex justify-content-center align-items-center">
                                <div>Titre de l'annonce</div>
                            </div>
                            <div className="col-12 col-sm-4 col-md-5 col-lg-4 d-flex flex-column justify-content-center align-items-center text-center">
                                <div>Voir mon annonce</div>
                                <div>Status de l'annonce</div>
                                <div>Modifier mon annonce</div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
            <div className="text-center">
                <Link
                    className="btn"
                    to={"#"}
                    onClick={() => {
                        navigate(-1);
                    }}
                    style={{ background: "#25632d", color: "white" }}
                >
                    Retour
                </Link>
            </div>
        </div>
    );
}
