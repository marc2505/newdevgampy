import React from "react";

export default function CommentCaMarcheCode() {
    return (
        <div
            className="container-fluid"
            style={{ paddingTop: "95px", paddingBottom: "95px" }}
        >
            <div className="row">
                <div className="row pb-5">
                    <h1>Comment ça marche ?</h1>
                </div>
                <div className="col-12 col-md-6">
                    {/* <img src="lesHotes.png" className='img-fluid' /> */}
                    <h2
                        className="text-center pb-5"
                        style={{ fontSize: "45px", fontWeight: "bold" }}
                    >
                        Les <span style={{ color: "#25632d" }}>H</span>ôtes
                    </h2>
                    <br />
                    <div
                        className="bordered-div"
                        style={{ borderRight: "2px solid black" }}
                    >
                        <div className="row d-flex align-items-center">
                            <div className="col-3 text-center">
                                <img src="ordi.png" className="img-fluid" />
                            </div>
                            <div className="col-9 pe-4">
                                <h4 style={{ color: "#25632d" }}>
                                    Publiez gratuitement votre annonce
                                </h4>
                                <h5>Établissez un tarif pour les gampeurs.</h5>
                            </div>
                        </div>
                        <br />
                        <br />
                        <div className="row d-flex align-items-center">
                            <div className="col-3 text-center">
                                <img
                                    src="justeFaux.png"
                                    className="img-fluid"
                                />
                            </div>
                            <div className="col-9 pe-4">
                                <h4 style={{ color: "#25632d" }}>
                                    Acceptez ou refusez les demandes
                                </h4>
                                <h5>
                                    Les voyageurs font des demandes de
                                    réservation en ligne.
                                </h5>
                            </div>
                        </div>
                        <br />
                        <br />
                        <div className="row d-flex align-items-center">
                            <div className="col-3 text-center">
                                <img src="bonhomme.png" className="img-fluid" />
                            </div>
                            <div className="col-9 pe-4">
                                <h4 style={{ color: "#25632d" }}>
                                    Préparez-vous à accueillir vos invités
                                </h4>
                                <h5>
                                    Bénéficiez d'une assurance pendant leur
                                    séjour ! Recevez vos paiements une fois
                                    l'expérience terminée.
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 margin-div">
                    {/* <img src="lesGampeurs.png" className='img-fluid' /> */}
                    <h2
                        className="text-center pb-5"
                        style={{ fontSize: "45px", fontWeight: "bold" }}
                    >
                        Les <span style={{ color: "#25632d" }}>G</span>ampeurs
                    </h2>
                    <br />
                    <div>
                        <div className="row d-flex align-items-center">
                            <div className="col-3 text-center">
                                <img src="fleche.png" className="img-fluid" />
                            </div>
                            <div className="col-9 pe-4">
                                <h4 style={{ color: "#25632d" }}>
                                    Parcourez les annonces
                                </h4>
                                <h5>
                                    Découvrez l'endroit parfait à un tarif
                                    avantageux.
                                </h5>
                            </div>
                        </div>
                        <br />
                        <br />
                        <div className="row d-flex align-items-center">
                            <div className="col-3 text-center">
                                <img src="signal.png" className="img-fluid" />
                            </div>
                            <div className="col-9 pe-4">
                                <h4 style={{ color: "#25632d" }}>
                                    Effectuez votre réservation en ligne
                                </h4>
                                <h5>Votre paiement est 100% sécurisé.</h5>
                            </div>
                        </div>
                        <br />
                        <br />
                        <div className="row d-flex align-items-center">
                            <div className="col-3 text-center">
                                <img src="boussole.png" className="img-fluid" />
                            </div>
                            <div className="col-9 pe-4">
                                <h4 style={{ color: "#25632d" }}>
                                    Partez à l'aventure
                                </h4>
                                <h5>Vivez une expérience inoubliable.</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
