import React, { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import Calendar from "react-calendar";
import format from "date-fns/format";
import "react-calendar/dist/Calendar.css";
import axiosClient from "../axios-client";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useStateContext } from "../contexts/ContextProvider";
import { useSearchContext } from "../contexts/ContextSearch";
import Slider from "react-slick";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import {
    differenceInDays,
    isAfter,
    isBefore,
    isEqual,
    startOfDay,
} from "date-fns";
import { loadStripe } from "@stripe/stripe-js";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const libraries = ["places"];

export default function Terrain() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const params = useParams();
    const terrainId = params.id;
    const from = params.from;
    const mapRef = useRef();
    const [mapCenter, setMapCenter] = useState(null);
    const [marqueurs, setMarqueurs] = useState([]);
    const navigate = useNavigate();
    const { user, token } = useStateContext();
    const [diffDays, setDiffDays] = useState(1);
    const [nbAdultes, setNbAdultes] = useState(2);
    const [nbAdultesMax, setNbAdultesMax] = useState(0);
    const [nbAdo, setNbAdo] = useState(0);
    const [nbAdoMax, setNbAdoMax] = useState(0);
    const [hostName, setHostName] = useState("");
    const [lstEquipements, setLstEquipements] = useState([]);
    const [lstPrestations, setLstPrestations] = useState([]);
    const [firstIndispo, setFirstIndispo] = useState(null);
    const [valueStart, setValueStart] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const closeModal = () => setShowModal(false);
    let demain = new Date(valueStart);
    demain.setDate(demain.getDate() + 1);
    const [valueEnd, setValueEnd] = useState(demain);
    // valueStart.setHours(0,0,0,0)
    // valueEnd.setHours(0,0,0,0)
    const [viewStart, setViewStart] = useState("month");
    const [viewEnd, setViewEnd] = useState("month");
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
    const [terrain, setTerrain] = useState({});
    const [loading, setLoading] = useState(true);
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_CLE_MAPS_API_2,
        libraries,
    });
    const options = {
        componentRestrictions: { country: "ch" },
        fields: [
            "address_components",
            "formatted_address",
            "geometry",
            "icon",
            "name",
        ],
    };

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < 768);
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        });
    }, []);

    const fetchAddress = async (lat, lng) => {
        if (!isLoaded) return;
        const apiKey = import.meta.env.VITE_CLE_MAPS_API_2;
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const address = data.results[0];

            const street_number = address.address_components.find((component) =>
                component.types.includes("street_number")
            )?.long_name;
            const city = address.address_components.find((component) =>
                component.types.includes("locality")
            )?.long_name;
            const route = address.address_components.find((component) =>
                component.types.includes("route")
            )?.long_name;
            const postal_code = address.address_components.find((component) =>
                component.types.includes("postal_code")
            )?.long_name;
            const country = address.address_components.find((component) =>
                component.types.includes("country")
            )?.long_name;
            const street = `${street_number} ${route}`;

            return { street, postal_code, city, country, route };
        } else {
            return null;
        }
    };

    function calculateNewPosition(lat, lng, distance, angle) {
        // Conversion de la distance de mètres à kilomètres
        distance = distance / 1000;
        // Conversion de la distance de kilomètres à une fraction du rayon de la Terre (rayon moyen Terre = 6371km)
        // Conversion nécessaire pour le calcul trigonométrique
        distance = distance / 6371;
        // Conversion de degrés en radians
        // JavaScript fonctionne avec des radions et pas des degrés
        angle = angle * (Math.PI / 180);
        lat = lat * (Math.PI / 180);
        lng = lng * (Math.PI / 180);
        // Equation trigonométrique sphérique pour déterminer les nouvelles coordonnées
        let newLat = Math.asin(
            Math.sin(lat) * Math.cos(distance) +
                Math.cos(lat) * Math.sin(distance) * Math.cos(angle)
        );
        let newLng =
            lng +
            Math.atan2(
                Math.sin(angle) * Math.sin(distance) * Math.cos(lat),
                Math.cos(distance) - Math.sin(lat) * Math.sin(newLat)
            );
        // Conversion de radians en degrés pour les replacer sur la carte
        newLat = newLat * (180 / Math.PI);
        newLng = newLng * (180 / Math.PI);

        return { lat: newLat, lng: newLng };
    }

    const getRandom = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    const fetchCoordinates = async (address) => {
        if (!isLoaded) return;
        let lat = 0;
        let lng = 0;
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: address }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();
                const zone2 = new google.maps.Circle({
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#25632d",
                    fillOpacity: 0.35,
                    map: mapRef.current,
                    center: { lat, lng },
                    radius: 1000,
                    lat: lat,
                    lng: lng,
                });
                setMarqueurs((prev) => [zone2]);
                setMapCenter({ lat, lng });
            } else {
                alert(
                    "Geocode was not successful for the following reason: " +
                        status
                );
            }
        });
        return { lat: lat, lng: lng };
    };

    const Map = useCallback(() => {
        const onMapLoad = useCallback(
            (map) => {
                mapRef.current = map;
                marqueurs.forEach((m) => {
                    let distance = getRandom(900, 1000);
                    let angle = getRandom(0, 360);
                    let positionZone = calculateNewPosition(
                        m.lat,
                        m.lng,
                        distance,
                        angle
                    );
                    new google.maps.Circle({
                        strokeColor: "#25632d",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: "#25632d",
                        fillOpacity: 0.35,
                        map: mapRef.current,
                        center: positionZone,
                        radius: 1000,
                    });
                });
            },
            [marqueurs]
        );

        return (
            <GoogleMap
                zoom={11}
                center={mapCenter}
                onLoad={onMapLoad}
                mapContainerClassName="map-container"
            ></GoogleMap>
        );
    }, [marqueurs, mapCenter]);

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

    const SimpleSliderTerrain = ({ terrain }) => {
        const longueur = terrain.images_principales.split("|").length;
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
            <div className="my-3 px-2">
                <Slider {...settings}>
                    {terrain.images_principales.split("|").map((photo, cle) => {
                        return (
                            <div
                                className="card"
                                key={cle}
                                style={{ height: "100%" }}
                            >
                                <div
                                    style={{
                                        height: "250px",
                                        width: "100%",
                                        // backgroundImage: `url('http://localhost:8000/${photo}')`,
                                        backgroundImage: `url('https://apidev.gampy.ch/${photo}')`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center center",
                                    }}
                                ></div>
                                {/* <img src={`http://localhost:8000/${photo}`} alt="" width={'100%'} height={'250px'}/> */}
                                {/* <img src={`https://apii.keums.com/${photo}`} alt="" width={'100%'} height={'250px'}/> */}
                            </div>
                        );
                    })}
                </Slider>
            </div>
        );
    };

    const getEquipementNomById = (equipId) => {
        axiosClient
            .get(`/getEquipementNomById/${equipId}`)
            .then(({ data }) => {
                console.log("DATA AXIOS RETOUR =");
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (isLoaded) {
            setLoading(true);
            axiosClient
                .get(`/terrains/display/${terrainId}`)
                .then(({ data }) => {
                    setLoading(false);
                    setTerrain(data.data);
                })
                .catch((err) => {
                    setLoading(false);
                    console.log(err);
                });
        }
    }, [isLoaded]);

    useEffect(() => {
        if (isLoaded && terrain && terrain.adresse) {
            fetchCoordinates(terrain.adresse);
        }
    }, [isLoaded, terrain.adresse]);

    useEffect(() => {
        if (terrain && terrain.user_id) {
            setLoading(true);
            axiosClient
                .get(`/user/${terrain.user_id}/pseudo`)
                .then(({ data }) => {
                    setLoading(false);
                    setHostName(data[0]);
                })
                .catch((err) => {
                    setLoading(false);
                    console.log(err);
                });
        }
    }, [terrain.user_id]);

    useEffect(() => {
        console.log("TERRAIN =");
        console.log(terrain.prestations);
        setLstPrestations((prev) => terrain?.prestations ?? []);
        console.log("DEBUT D'APPEL POUR LES EQUIPEMENTS :");
        setLoading(true);
        const fetchEquipement = async () => {
            if (terrain && terrain.equipements) {
                const equipementsIds = terrain.equipements
                    .split("|")
                    .map((e) => e.split("-")[1]);
                const equipementsNoms = [];
                for (const equipId of equipementsIds) {
                    try {
                        const { data } = await axiosClient.get(
                            `/getEquipementNomById/${equipId}`
                        );
                        equipementsNoms.push(data.nom);
                    } catch (err) {
                        console.log(err);
                    }
                }
                setLstEquipements(equipementsNoms);
                setLoading(false);
            }
        };
        fetchEquipement();
    }, [terrain]);

    useEffect(() => {
        setNbAdultesMax(terrain.capacite_visiteurs - nbAdo);
        setNbAdoMax(terrain.capacite_visiteurs - nbAdultes);
        const floatPrixNuitee = parseFloat(terrain.prix_nuitee);
        const floatNbAdultes = parseFloat(nbAdultes - 2);
        const floatPrixAdulteSupp = parseFloat(terrain.prix_adulte_supp);
        const floatNbAdo = parseFloat(nbAdo);
        const floatPrixAdoSupp = parseFloat(terrain.prix_ado_supp);
        const floatPrixTaxeSejour = parseFloat(terrain.prix_taxe_sejour);
        const diffDays =
            differenceInDays(
                startOfDay(new Date(valueEnd)),
                startOfDay(new Date(valueStart))
            ) == 0
                ? 1
                : differenceInDays(
                      startOfDay(new Date(valueEnd)),
                      startOfDay(new Date(valueStart))
                  );
        setDiffDays(
            differenceInDays(
                startOfDay(new Date(valueEnd)),
                startOfDay(new Date(valueStart))
            ) == 0
                ? 1
                : differenceInDays(
                      startOfDay(new Date(valueEnd)),
                      startOfDay(new Date(valueStart))
                  )
        );
        console.log("CALCUL => ");
        console.log("Terrain.prix_nuitée = " + parseFloat(terrain.prix_nuitee));
        console.log("nbAdultes = " + parseFloat(nbAdultes));
        console.log("(nbAdultes-2) = " + parseFloat(nbAdultes - 2));
        console.log("terrain.prix_adulte_supp = " + terrain.prix_adulte_supp);
        console.log("nbAdo = " + nbAdo);
        console.log("terrain.prix_adulte_supp = " + terrain.prix_adulte_supp);
        console.log("terrain.prix_taxe_sejour = " + terrain.prix_taxe_sejour);
        console.log(
            "differenceInDays(new Date(valueEnd), new Date(valueStart)) = " +
                differenceInDays(
                    startOfDay(new Date(valueEnd)),
                    startOfDay(new Date(valueStart))
                )
        );
        console.log("valueEnd = " + startOfDay(new Date(valueEnd)));
        console.log("valueStart = " + startOfDay(new Date(valueStart)));
        console.log("Const diffDays = " + diffDays);
        console.log(
            (terrain.prix_nuitee +
                (nbAdultes - 2) * terrain.prix_adulte_supp +
                nbAdo * terrain.prix_ado_supp +
                terrain.prix_taxe_sejour) *
                diffDays
        );
        const res =
            (floatPrixNuitee +
                floatNbAdultes * floatPrixAdulteSupp +
                floatNbAdo * floatPrixAdoSupp +
                floatPrixTaxeSejour) *
            diffDays;
        console.log("NOUVEAU CALCUL => " + res);
    }, [terrain, nbAdultes, nbAdo]);

    useEffect(() => {
        console.log("LSTPRESTA = ");
        console.log(lstPrestations);
    }, [lstPrestations]);

    const handleChangeValueStart = (e) => {
        setValueStart(e);
        if (isAfter(e, valueEnd)) {
            setValueEnd(e);
        }
    };

    const handleChangeValueEnd = (e) => {
        setValueEnd(e);
        if (isBefore(e, valueStart)) {
            setValueStart(e);
        }
    };

    const masquerIndispo = (date) => {
        if (terrain && terrain.indisponibilites) {
            const datesATracer = terrain.indisponibilites.split("|");
            for (const indispo of datesATracer) {
                const debut = indispo.split("->")[0];
                const fin = indispo.split("->")[1];
                const dateD = new Date(debut);
                const dateF = new Date(fin);

                if (
                    (isAfter(date.date, dateD) || isEqual(date.date, dateD)) &&
                    (isBefore(date.date, dateF) || isEqual(date.date, dateF))
                ) {
                    return true;
                }
            }
        }
        return false;
    };

    useEffect(() => {
        if (valueStart && terrain && terrain.indisponibilites) {
            const datesATracer = terrain.indisponibilites.split("|");
            let premiereDateATracer = null;
            for (const indispo of datesATracer) {
                const debut = indispo.split("->")[0];
                const fin = indispo.split("->")[1];
                const dateD = new Date(debut);
                const dateF = new Date(fin);
                if (
                    isAfter(dateD, valueStart) &&
                    (premiereDateATracer == null ||
                        isBefore(dateD, premiereDateATracer))
                ) {
                    premiereDateATracer = dateD;
                }
            }
            setFirstIndispo(premiereDateATracer);
        }
    }, [valueStart, terrain]);

    useEffect(() => {
        const nbAdultesFromStorage = localStorage.getItem("nbAdultes");
        const nbAdoFromStorage = localStorage.getItem("nbAdo");
        const valueEnd = localStorage.getItem("valueEnd");
        const valueStart = localStorage.getItem("valueStart");

        if (nbAdultesFromStorage) {
            setNbAdultes(Number(nbAdultesFromStorage));
        } else {
            setNbAdultes(2);
        }
        if (nbAdoFromStorage) {
            setNbAdo(Number(nbAdoFromStorage));
        } else {
            setNbAdo(0);
        }
        if (valueStart) {
            setValueStart(new Date(valueStart));
        } else {
            if (dateDebut) {
                setValueStart(new Date(dateDebut));
            } else {
                setValueStart(new Date());
            }
        }
        if (valueEnd) {
            setValueEnd(new Date(valueEnd));
        } else {
            if (dateFin) {
                setValueEnd(new Date(dateFin));
            } else {
                let demain = new Date();
                demain.setDate(demain.getDate() + 1);
                setValueEnd(demain);
            }
        }
        localStorage.removeItem("nbAdultes");
        localStorage.removeItem("nbAdo");
        localStorage.removeItem("valueStart");
        localStorage.removeItem("valueEnd");
    }, []);

    useEffect(() => {
        const diffDays = differenceInDays(
            startOfDay(new Date(valueEnd)),
            startOfDay(new Date(valueStart))
        );
        console.log("VALUESTART = " + startOfDay(new Date(valueStart)));
        console.log("VALUEEND = " + startOfDay(new Date(valueEnd)));
        console.log("DIFFDAYS => " + diffDays);
        setDiffDays(diffDays);
    }, [valueStart, valueEnd]);

    const checkCapacityAndSetValues = (newNbAdultes, newNbAdo) => {
        setNbAdultes(newNbAdultes);
        setNbAdo(newNbAdo);
    };

    return (
        <div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Attention !!!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Le nombre de gampeurs a atteind la capacité du terrain.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        style={{ backgroundColor: "#25632d" }}
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="container mx-auto">
                {user && Object.keys(user).length > 0 ? (
                    <Header user={user} />
                ) : (
                    <Header user={null} />
                )}
            </div>
            <div className="container">
                <div className="d-flex justify-content-between mx-1 py-3">
                    <h3>{!loading && terrain.nom}</h3>
                    <h3>
                        Prix de la nuitée :{" "}
                        {!loading && terrain.prix_nuitee + " CHF"}
                    </h3>
                </div>

                <div className="mx-1 py-3">
                    <h3>{!loading && "Votre hôte : " + hostName}</h3>
                </div>

                <div className="grid-container">
                    {!loading &&
                        terrain.images_principales
                            .split("|")
                            .map((photo, cle) => {
                                return (
                                    <div
                                        className={
                                            isMobile ? "grid-item-mobile" : ""
                                        }
                                        style={{
                                            height: "250px",
                                            width: "100%",
                                            backgroundImage: `url('http://localhost:8000/${photo}')`,
                                            // backgroundImage: `url('https://api.gampy.ch/${photo}')`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center center",
                                        }}
                                    >
                                        {/* <img 
                                        src={`http://localhost:8000/${photo}`} 
                                        width={'100%'}
                                        height={'180px'}
                                        className='img-fluid'
                                        alt="" 
                                    /> */}
                                    </div>
                                );
                            })}
                </div>

                {/* <div className='mx-1 py-3'>
                    <h3>Photos du terrain</h3>
                    <div className="container-fluid">
                        {!loading && <SimpleSliderTerrain terrain={terrain} />}
                    </div>
                </div> */}

                <h3>Description du terrain</h3>

                <div
                    className="my-3"
                    style={{
                        height: "",
                    }}
                >
                    <h4>Description générale : </h4>
                    {!loading && (
                        <div
                            style={{
                                border: "1px solid black",
                                marginBottom: "20px",
                                background: "lightgrey",
                            }}
                        >
                            {terrain.desc_generale}
                        </div>
                    )}
                    <h4>Description du cadre : </h4>
                    {!loading && (
                        <div
                            style={{
                                border: "1px solid black",
                                marginBottom: "20px",
                                background: "lightgrey",
                            }}
                        >
                            {terrain.desc_cadre}
                        </div>
                    )}
                    <h4>Description des équipements : </h4>
                    {!loading && (
                        <div
                            style={{
                                border: "1px solid black",
                                marginBottom: "20px",
                                background: "lightgrey",
                            }}
                        >
                            {terrain.desc_equipement}
                        </div>
                    )}
                </div>

                <h3>Equipements disponibles</h3>
                <div
                    className="my-3"
                    style={{
                        border: "1px solid black",
                        background: "lightgrey",
                    }}
                >
                    {!loading &&
                        lstEquipements.length > 0 &&
                        lstEquipements.map((e, cle) => {
                            return (
                                <p key={cle} style={{ margin: "0" }}>
                                    {e}
                                </p>
                            );
                        })}
                    {!loading && lstEquipements.length == 0 && (
                        <p style={{ margin: "0" }}>Pas d'équipement ...</p>
                    )}
                </div>

                <h3>Prestations supplémentaires</h3>
                <div
                    className="my-3"
                    style={{
                        border: "1px solid black",
                        background: "lightgrey",
                    }}
                >
                    {terrain &&
                        lstPrestations &&
                        lstPrestations.length > 0 &&
                        lstPrestations.map((presta, cle) => {
                            return (
                                <p key={cle} style={{ margin: "0" }}>
                                    {presta.nom} - {presta.prix} CHF
                                </p>
                            );
                        })}
                    {terrain && lstPrestations.length == 0 && (
                        <p style={{ margin: "0" }}>Pas de prestation ...</p>
                    )}
                </div>

                <h3>Infos pratiques</h3>
                <div
                    className="my-3"
                    style={{
                        border: "1px solid black",
                        background: "lightgrey",
                    }}
                >
                    {!loading && terrain.autres_infos}
                    {!loading && !terrain.autres_infos && (
                        <p>Aucunes informations ...</p>
                    )}
                </div>

                <h3>Infos pour les gampeurs</h3>
                <div
                    className="my-3 col-12 col-md-8 col-lg-6 mx-auto"
                    style={{ textAlign: "center" }}
                >
                    <h4>
                        {!loading && "Check-in => dès " + terrain.heure_arrivee}
                    </h4>
                    <h4>
                        {!loading &&
                            "Check-out => jusqu'à " + terrain.heure_depart}
                    </h4>
                    <h4>
                        {!loading &&
                            "Capacité du terrain => " +
                                terrain.capacite_visiteurs +
                                " visiteurs"}
                    </h4>
                    <h4>
                        {!loading &&
                            "Surface du terrain => " + terrain.surface + " m2"}
                    </h4>
                    <h4>
                        {!loading && terrain.annulation != "no"
                            ? "Annulation => " +
                              terrain.annulation +
                              " heures avant l'arrivée"
                            : "Pas d'annulation possible"}
                    </h4>
                </div>
                <h3>Adresse de votre hôte</h3>
                <div className="my-4">{isLoaded && <Map />}</div>
                <div
                    className="my-4 p-2"
                    style={{ border: "1px solid #25632d" }}
                >
                    <h3>Dates du voyage :</h3>
                    <div className="row my-3">
                        <div className="col-sm-6 text-center">
                            <h5>Arrivée :</h5>
                            <Calendar
                                key={valueStart}
                                value={valueStart}
                                className={"mx-auto"}
                                tileDisabled={masquerIndispo}
                                onChange={handleChangeValueStart}
                                view={viewStart}
                                minDate={new Date()}
                            />
                        </div>
                        <div className="col-sm-6 text-center">
                            <h5>Départ :</h5>
                            <Calendar
                                key={valueEnd}
                                value={valueEnd}
                                className={"mx-auto"}
                                tileDisabled={masquerIndispo}
                                onChange={handleChangeValueEnd}
                                view={viewEnd}
                                minDate={new Date()}
                            />
                        </div>
                    </div>
                    <h3>Nombre de voyageurs :</h3>
                    <div className="row" style={{ marginBottom: "30px" }}>
                        <div className="col-sm-6 text-center">
                            <h5 className="my-5">
                                Nombre d'adultes :
                                <button
                                    className="btn ms-3 me-2"
                                    style={{
                                        background: "#25632d",
                                        color: "white",
                                    }}
                                    onClick={() => {
                                        const newNbAdultes = Math.max(
                                            2,
                                            nbAdultes - 1
                                        );
                                        checkCapacityAndSetValues(
                                            newNbAdultes,
                                            nbAdo
                                        );
                                    }}
                                >
                                    -
                                </button>
                                {nbAdultes}
                                <button
                                    className="btn ms-2 me-3"
                                    style={{
                                        background: "#25632d",
                                        color: "white",
                                    }}
                                    onClick={() => {
                                        if (nbAdultes === nbAdultesMax) {
                                            handleShow(true);
                                        } else {
                                            setNbAdultes((prev) =>
                                                Math.min(nbAdultesMax, prev + 1)
                                            );
                                        }
                                    }}
                                >
                                    +
                                </button>
                            </h5>
                            <RangeSlider
                                className="single-thumb"
                                min={2}
                                max={nbAdultesMax}
                                value={[2, nbAdultes]}
                                thumbsDisabled={[true, false]}
                                rangeSlideDisabled={true}
                                onInput={(values) => {
                                    const [debut, fin] = values;
                                    checkCapacityAndSetValues(fin, nbAdo);
                                    if (
                                        fin + nbAdo >
                                        terrain.capacite_visiteurs
                                    ) {
                                        setNbAdo(
                                            terrain.capacite_visiteurs - fin
                                        );
                                    }
                                    setNbAdultes(fin);
                                }}
                            />
                        </div>
                        <div className="col-sm-6 text-center">
                            <h5 className="my-5">
                                Nombre d'adolescents :
                                <button
                                    className="btn ms-3 me-2"
                                    style={{
                                        background: "#25632d",
                                        color: "white",
                                    }}
                                    onClick={() => {
                                        const newNbAdo = Math.max(0, nbAdo - 1);
                                        checkCapacityAndSetValues(
                                            nbAdultes,
                                            newNbAdo
                                        );
                                    }}
                                >
                                    -
                                </button>
                                {nbAdo}
                                <button
                                    className="btn ms-2 me-3"
                                    style={{
                                        background: "#25632d",
                                        color: "white",
                                    }}
                                    onClick={() => {
                                        if (nbAdo === nbAdoMax) {
                                            setShow(true);
                                        } else {
                                            setNbAdo((prev) =>
                                                Math.min(nbAdoMax, prev + 1)
                                            );
                                        }
                                    }}
                                >
                                    +
                                </button>
                            </h5>
                            <RangeSlider
                                className="single-thumb"
                                min={0}
                                max={nbAdoMax}
                                value={[0, nbAdo]}
                                thumbsDisabled={[true, false]}
                                rangeSlideDisabled={true}
                                onInput={(values) => {
                                    const [debut, fin] = values;
                                    checkCapacityAndSetValues(nbAdultes, fin);
                                    if (
                                        fin + nbAdultes >
                                        terrain.capacite_visiteurs
                                    ) {
                                        setNbAdultes(
                                            terrain.capacite_visiteurs - fin
                                        );
                                        setShowModal(true);
                                    }
                                    setNbAdo(fin);
                                }}
                            />
                        </div>
                    </div>
                    <div
                        className="col-md-12"
                        style={{
                            background: "lightgrey",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            paddingBottom: "5px",
                        }}
                    >
                        <h1>Résumé de ma réservation :</h1>
                        <div className="mb-3">
                            <h3>Dates :</h3>
                            Arrivée :{" "}
                            {format(new Date(valueStart), "dd MMM yyyy")}
                            <br />
                            Départ : {format(new Date(valueEnd), "dd MMM yyyy")}
                        </div>
                        <div className="mb-3">
                            <h3>Lieu :</h3>
                            {!loading &&
                                terrain &&
                                terrain.adresse.split(",")[1]}
                        </div>
                        <div className="mb-3">
                            <h3>Nombre de gampeurs :</h3>
                            {nbAdultes + nbAdo} gampeurs ({nbAdultes} adultes &{" "}
                            {nbAdo} adolescents)
                        </div>
                        <div className="mb-3">
                            <h3>Prix nuitée :</h3>
                            {terrain.prix_nuitee} CHF
                        </div>
                        <div className="mb-3">
                            <h3>Prix total :</h3>
                            Faire le calcul <br />
                            (1 x prix_nuitee + (nbGampeursAdultes-2) x
                            prix_adulte_supp + nbGampeursAdo x prix_ado_supp + 1
                            x prix_tax_sejour) x nbJours <br />
                            (1 x {parseFloat(terrain.prix_nuitee)} + (
                            {parseFloat(nbAdultes)}-2) x{" "}
                            {parseFloat(terrain.prix_adulte_supp)} +{" "}
                            {parseFloat(nbAdo)} x{" "}
                            {parseFloat(terrain.prix_ado_supp)} + 1 x{" "}
                            {parseFloat(terrain.prix_taxe_sejour)}) x{" "}
                            {differenceInDays(
                                new Date(valueEnd),
                                new Date(valueStart)
                            ) == 0
                                ? 1
                                : differenceInDays(
                                      new Date(valueEnd),
                                      new Date(valueStart)
                                  )}{" "}
                            ={" "}
                            {(parseFloat(terrain.prix_nuitee) +
                                parseFloat(nbAdultes - 2) *
                                    parseFloat(terrain.prix_adulte_supp) +
                                parseFloat(nbAdo) *
                                    parseFloat(terrain.prix_ado_supp) +
                                parseFloat(terrain.prix_taxe_sejour)) *
                                diffDays}
                        </div>
                        <div className="mb-3">
                            <h3>Commission Gampy :</h3>
                            Faire le calcul de la commission
                        </div>
                        <div className="mb-3">
                            <h3>Informations complémentaires</h3>
                            <textarea
                                id="infos_complementaires"
                                rows="5"
                                className="form-control"
                                placeholder="Renseignez des informations complémentaires (santé, mobilité, etc.)"
                            ></textarea>
                        </div>
                        {user ? (
                            <div className="mb-3 text-center">
                                <Link
                                    to={"#"}
                                    className="btn"
                                    style={{
                                        background: "#25632d",
                                        color: "white",
                                    }}
                                    onClick={() => {
                                        let reservation = {
                                            terrainId: terrain.id,
                                            name: terrain.nom,
                                            desc_generale:
                                                terrain.desc_generale,
                                            desc_cadre: terrain.desc_cadre,
                                            desc_equipement:
                                                terrain.desc_equipement,
                                            currency: "chf",
                                            date_debut: format(
                                                valueStart,
                                                "yyyy-MM-dd"
                                            ),
                                            date_fin: format(
                                                valueEnd,
                                                "yyyy-MM-dd"
                                            ),
                                            duree: diffDays,
                                            unit_amount:
                                                (parseFloat(
                                                    terrain.prix_nuitee
                                                ) +
                                                    parseFloat(nbAdultes - 2) *
                                                        parseFloat(
                                                            terrain.prix_adulte_supp
                                                        ) +
                                                    parseFloat(nbAdo) *
                                                        parseFloat(
                                                            terrain.prix_ado_supp
                                                        ) +
                                                    parseFloat(
                                                        terrain.prix_taxe_sejour
                                                    )) *
                                                diffDays,
                                            quantity: 1,
                                        };

                                        axiosClient
                                            .post("/checkout", reservation)
                                            .then(async ({ data }) => {
                                                const stripe = await loadStripe(
                                                    import.meta.env
                                                        .VITE_STRIPE_PUBLIC_KEY
                                                );
                                                const { error } =
                                                    await stripe.redirectToCheckout(
                                                        {
                                                            sessionId: data.id,
                                                        }
                                                    );
                                                if (error) {
                                                    navigate(
                                                        "/cancel?session_id=" +
                                                            sessionId
                                                    );
                                                }
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            });
                                    }}
                                >
                                    Réserver
                                </Link>
                            </div>
                        ) : (
                            <div className="mb-3 text-center">
                                <a
                                    onClick={() => {
                                        localStorage.setItem(
                                            "nbAdultes",
                                            nbAdultes
                                        );
                                        localStorage.setItem("nbAdo", nbAdo);
                                        localStorage.setItem(
                                            "valueStart",
                                            valueStart
                                        );
                                        localStorage.setItem(
                                            "valueEnd",
                                            valueEnd
                                        );
                                        navigate(
                                            `/login/terrain${terrain.id}?nbAdultes=${nbAdultes}&nbAdo=${nbAdo}`
                                        );
                                    }}
                                    className="btn"
                                    style={{
                                        background: "#25632d",
                                        color: "white",
                                    }}
                                >
                                    Se connecter pour réserver
                                </a>
                            </div>
                        )}
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
            <div className="container">
                <Footer />
            </div>
        </div>
    );
}
