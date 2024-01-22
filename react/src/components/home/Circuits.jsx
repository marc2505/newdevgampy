import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function Circuits() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const circuitGampy = (ev) => {
        ev.preventDefault();
        handleShow();
    };

    return (
        <div
            className="container-fluid"
            style={{
                background: "#dad5c2",
                paddingBottom: "80px",
                paddingTop: "80px",
            }}
        >
            <div className="row pb-5">
                <h1>Les circuits Gampy</h1>
            </div>
            <div
                className="row mx-1 py-2"
                style={{ backgroundColor: "#dad5c2", height: "" }}
            >
                <div className="col-sm-6 col-md-4 col-lg-4 col-xl-3 mx-auto mb-sm-2 mb-xs-2 mb-2">
                    <div
                        className="card"
                        style={{ border: "", width: "100%", height: "100%" }}
                    >
                        {" "}
                        {/* 1px solid #25632d */}
                        <img
                            src="circuitImg1.jpeg"
                            className="card-img-top img-fluid"
                            style={{ height: "75%" }}
                        />
                        <div className="card-body">
                            <h5
                                className="card-title poppins"
                                style={{ textAlign: "center" }}
                            >
                                <span style={{ fontWeight: "bold" }}>1</span>.
                                choisissez vos dates, votre budget et une région
                                que vous souhaitez découvrir.
                            </h5>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-4 col-xl-3 mx-auto mb-sm-2 mb-xs-2 mb-2">
                    <div
                        className="card"
                        style={{ border: "", width: "100%", height: "100%" }}
                    >
                        <img
                            src="circuitImg2_new.jpg"
                            className="card-img-top img-fluid"
                            style={{ height: "75%" }}
                        />
                        <div className="card-body">
                            <h5
                                className="card-title poppins"
                                style={{ textAlign: "center" }}
                            >
                                <span style={{ fontWeight: "bold" }}>2</span>.
                                Gampy organise votre voyage en fonction de vos
                                envies !
                            </h5>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-md-4 col-lg-4 col-xl-3 mx-auto mb-sm-2 mb-xs-2 mb-2">
                    <div
                        className="card"
                        style={{ border: "", width: "100%", height: "100%" }}
                    >
                        <img
                            src="circuitImg3_new.jpg"
                            className="card-img-top img-fluid"
                            style={{ height: "75%" }}
                        />
                        <div className="card-body">
                            <h5
                                className="card-title poppins"
                                style={{ textAlign: "center" }}
                            >
                                <span style={{ fontWeight: "bold" }}>3</span>.
                                validez et partez à l’aventure !
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row text-center pt-3">
                <div className="col-md-12 mx-auto">
                    <button
                        className="btn"
                        onClick={circuitGampy}
                        style={{ background: "#25632d", color: "white" }}
                    >
                        C'est parti !
                    </button>
                </div>
            </div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Fonctionnalité indisponible</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Cette fonctionnalité sera implémentée très prochainement
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
