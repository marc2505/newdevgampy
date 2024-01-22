import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { IoIosPeople } from "react-icons/io";
import { SiGooglemaps } from "react-icons/si";
import { PiMoneyBold } from "react-icons/pi";
import { PiTentFill, PiVanFill } from "react-icons/pi";
import { FaCaravan } from "react-icons/fa";
import { TbCamper } from "react-icons/tb";

export default function CampsFavoris(props) {
    const terrainsListe = props.terrains;
    const [isSwiping, setSwiping] = useState(false);

    function Arrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "#25632d" }}
                onClick={onClick}
            />
        );
    }

    const SimpleSlider = ({ terrains }) => {
        const longueur = terrains.length;
        const settings = {
            dots: true,
            infinite: longueur > 3,
            speed: 1000,
            slidesToShow: 3,
            slidesToScroll: 1,
            initialSlide: 0,
            nextArrow: <Arrow />,
            prevArrow: <Arrow />,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ],
        };
        return (
            <div className="my-3 px-2" style={{}}>
                <Slider {...settings} style={{ paddingTop: "10px" }}>
                    {terrains.map((t, cle) => {
                        let imgPrincipales;
                        if (t.images_principales) {
                            imgPrincipales = t.images_principales.split("|");
                        }
                        if (imgPrincipales) {
                            return (
                                <div
                                    style={{ width: "100%", display: "flex" }}
                                    key={cle}
                                >
                                    <div
                                        className="card cardMobile"
                                        style={{
                                            margin: "auto",
                                            marginBottom: "10px",
                                            boxShadow: "5px 5px 5px 5px gray",
                                            height: "auto",
                                            display: "flex",
                                            width: "75%",
                                            textAlign: "center",
                                            borderRadius: "15px",
                                            border: "none",
                                        }}
                                    >
                                        <a
                                            href={`/terrain/${t.id}/home`}
                                            style={{
                                                color: "inherit",
                                                textDecoration: "none",
                                            }}
                                        >
                                            {imgPrincipales &&
                                                imgPrincipales[0] && (
                                                    // <img
                                                    //     src={`http://localhost:8000/${imgPrincipales[0]}`}
                                                    //     alt=""
                                                    //     width={"97%"}
                                                    //     className="img-fluid mx-auto"
                                                    //     style={{
                                                    //         height: "250px",
                                                    //         borderRadius:
                                                    //             "15px",
                                                    //         marginTop: "5px",
                                                    //     }}
                                                    // />
                                                    <img
                                                        src={`https://apidev.gampy.ch/${imgPrincipales[0]}`}
                                                        alt=""
                                                        width={"97%"}
                                                        className="img-fluid mx-auto"
                                                        style={{
                                                            height: "250px",
                                                            borderRadius:
                                                                "15px",
                                                            marginTop: "5px",
                                                        }}
                                                    />
                                                )}
                                            <div className="card-body poppins">
                                                <h3
                                                    style={{ fontSize: "30px" }}
                                                >
                                                    {t.nom}
                                                </h3>
                                                <div className="row">
                                                    <div
                                                        className="col-6"
                                                        style={{
                                                            textAlign: "left",
                                                            fontSize: "20px",
                                                        }}
                                                    >
                                                        <div>
                                                            <SiGooglemaps />{" "}
                                                            {
                                                                t.adresse.split(
                                                                    ","
                                                                )[2]
                                                            }
                                                        </div>
                                                        <div>
                                                            <IoIosPeople /> Max{" "}
                                                            {
                                                                t.capacite_visiteurs
                                                            }{" "}
                                                            visiteurs
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="col-6 text-end"
                                                        style={{
                                                            fontSize: "20px",
                                                        }}
                                                    >
                                                        <div>
                                                            <PiMoneyBold />{" "}
                                                            {t.prix_nuitee} CHF
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    {t.type_hebergement
                                                        .split("-")[1]
                                                        .split("|")
                                                        .map((h, cle) => {
                                                            if (h == "tente") {
                                                                return (
                                                                    <PiTentFill
                                                                        id="tenteCard"
                                                                        key={
                                                                            cle
                                                                        }
                                                                    />
                                                                );
                                                            }
                                                            if (h == "van") {
                                                                return (
                                                                    <PiVanFill
                                                                        id="vanCard"
                                                                        key={
                                                                            cle
                                                                        }
                                                                    />
                                                                );
                                                            }
                                                            if (
                                                                h == "caravanne"
                                                            ) {
                                                                return (
                                                                    <FaCaravan
                                                                        id="caravanneCard"
                                                                        key={
                                                                            cle
                                                                        }
                                                                    />
                                                                );
                                                            }
                                                            if (
                                                                h ==
                                                                "campingcar"
                                                            ) {
                                                                return (
                                                                    <TbCamper
                                                                        id="camperCard"
                                                                        key={
                                                                            cle
                                                                        }
                                                                    />
                                                                );
                                                            }
                                                        })}
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            );
                        } else {
                            return;
                        }
                    })}
                </Slider>
            </div>
        );
    };

    return (
        <div className="container-fluid">
            <div className="row pb-5">
                <h1 className="px-0">Camps favoris</h1>
            </div>
            <div className="row px-4 py-2" style={{ backgroundColor: "white" }}>
                <SimpleSlider terrains={terrainsListe} />
            </div>
        </div>
    );
}
