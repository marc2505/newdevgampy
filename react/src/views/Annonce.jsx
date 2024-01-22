import React, { useEffect, useState, useLayoutEffect } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import TypeHebergement from "./TypeHebergement";
import AdresseTerrain from "./AdresseTerrain";
import NombreVisiteurs from "./NombreVisiteurs";
import Environnement from "./Environnement";
import Equipements from "./Equipements";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addDays, format, parse, startOfDay } from "date-fns";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import BoxDescription from "./BoxDescription";
import { LuTent } from "react-icons/lu";
import BoxImage from "./BoxImage";
import axiosClient from "../axios-client";
import AProximite from "./AProximite";
import { useStateContext } from "../contexts/ContextProvider";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function Annonce() {
    const { user, token } = useStateContext();
    const userLocal = JSON.parse(localStorage.getItem("USER"));
    const [users, setUsers] = useState([]);
    const params = useParams();
    const from = params.from;
    let { terrainId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);
    const [formSubmitted1, setFormSubmitted1] = useState(false);
    const [formSubmitted2, setFormSubmitted2] = useState(false);
    const [formSubmitted3, setFormSubmitted3] = useState(false);
    const [photosPrincipales, setPhotosPrincipales] = useState([]);
    const [photosCadre, setPhotosCadre] = useState([]);
    const [photosAutres, setPhotosAutres] = useState([]);
    const [photosPrincipalesFiles, setPhotosPrincipalesFiles] = useState([]);
    const [photosCadreFiles, setPhotosCadreFiles] = useState([]);
    const [photosAutresFiles, setPhotosAutresFiles] = useState([]);
    const [lstPrestations, setLstPrestations] = useState([
        {
            terrain_id: Number(terrainId),
            nom: "",
            prix: 0,
            description: "",
        },
    ]);
    const [terrain, setTerrain] = useState({
        id: null,
        user_id: null,
        nom: "",
        adresse: "",
        prix_nuitee: 0,
        prix_adulte_supp: 0,
        prix_ado_supp: 0,
        prix_taxe_sejour: 0,
        images_principales: "",
        images_cadres: "",
        images_autres: "",
        surface: 0,
        capacite_visiteurs: 0,
        desc_generale: "",
        desc_cadre: "",
        desc_equipement: "",
        annulation: "",
        heure_arrivee: "",
        heure_depart: "",
        regles: "",
        autres_infos: "",
        statut_validation: "",
        type_hebergement: "",
        environnement: "radioCampagne",
        a_proximite: "",
        indisponibilites: "",
    });

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [selectedAnnulationValue, setSelectedAnnulationValue] = useState("");
    const updateTerrain = (updatedTerrain) => {
        setTerrain(updatedTerrain);
    };
    const [activeTab, setActiveTab] = useState("first");
    const [cpt, setCpt] = useState(2);
    const handleTabSelect = (tab) => {
        setActiveTab(tab);
        // window.scrollTo(0,0)
    };

    useEffect(() => {
        // console.log('TERRAINID =')
        // console.log(terrainId)
        console.log("TERRAIN =");
        console.log(terrain);
        if (terrain && terrain.prestations && terrain.prestations.length > 0) {
            setLstPrestations((prev) => terrain.prestations);
        }
    }, [terrain]);

    useEffect(() => {
        console.log("LSTPRESTATION =");
        console.log(lstPrestations);
    }, [lstPrestations]);

    const parseRange = (rangeString) => {
        const rangeTab = rangeString.split("|");
        const newRange = rangeTab.map((range, i) => {
            const [startDate, endDate] = range.split("->").slice(0, 2);
            return {
                startDate: parse(startDate, "dd/MMM/yyyy", new Date()),
                endDate: parse(endDate, "dd/MMM/yyyy", new Date()),
                key: `selection${i}`,
            };
        });
        return newRange;
    };

    const initialRange = {
        startDate: addDays(new Date(), 0),
        endDate: addDays(new Date(), 0),
        key: "selection0",
    };

    const [state, setState] = useState([initialRange]);
    // const [state, setState] = useState(()=>{
    //     const rangeStr = !loading ? terrain.indisponibilites : 'En attente'
    //     return parseRange(rangeStr)
    // })

    let stateAsString, stateAsDate;

    useEffect(() => {
        stateAsString = state.map((range) => {
            return {
                ...range,
                startDate: format(range.startDate, "dd/MMM/yyyy"),
                endDate: format(range.endDate, "dd/MMM/yyyy"),
            };
        });

        stateAsDate = stateAsString.map((range) => {
            return {
                ...range,
                startDate: parse(range.startDate, "dd/MMM/yyyy", new Date()),
                endDate: parse(range.endDate, "dd/MMM/yyyy", new Date()),
            };
        });

        let indisponibilites = "";
        stateAsString.map((range, i) => {
            // console.log('RANGE '+i+' :')
            // console.log(range)
            if (i == stateAsString.length - 1) {
                indisponibilites +=
                    range.startDate + "->" + range.endDate + "->selection" + i;
            } else {
                indisponibilites +=
                    range.startDate +
                    "->" +
                    range.endDate +
                    "->selection" +
                    i +
                    "|";
            }

            // console.log('INDISPOOOOOOOOOOOOOOOOOOO :')
            // console.log(indisponibilites.split('|'))
        });
        setTerrain((prev) => ({ ...prev, indisponibilites: indisponibilites }));

        // console.log('CHANGEMENT DU STAAAAAAAAAAAAAAAAAAATE :')
        // console.log(state)
        // console.log('CHANGEMENT STATEASSTRING :')
        // console.log(stateAsString)
        // console.log('CHANGEMENT STATEASDATE :')
        // console.log(stateAsDate)
    }, [state]);

    const handleRangeChange = (newRange) => {
        let newState = [...state];
        Object.keys(newRange).forEach((key) => {
            const newRangeI = newState.findIndex((range) => range.key === key);
            if (newRangeI !== -1) {
                newState[newRangeI] = newRange[key];
            }
        });
        setState(newState);
    };

    const addRange = () => {
        setState([
            // ...state,
            // {
            //     startDate: addDays(new Date(), 0),
            //     endDate: addDays(new Date(), 0),
            //     key: `selection${state.length}`,
            // },
            ...state,
            {
                startDate: new Date(),
                endDate: addDays(new Date(), 1),
                key: `selection${state.length}`,
            },
        ]);
    };

    // const [state, setState] = useState({
    //     selection1: {
    //       startDate: addDays(new Date(), 0),
    //       endDate: addDays(new Date(), 0),
    //       key: 'selection1'
    //     },
    //     // selection2: {
    //     //   startDate: addDays(new Date(), 1),
    //     //   endDate: addDays(new Date(), 1),
    //     //   key: 'selection2'
    //     // },
    // })

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [activeTab]);

    // useEffect(()=>{
    //     console.log('CHANGEMENT TERRAIN ANNONCE.JSX :')
    //     console.log(terrain)
    // }, [terrain])

    useEffect(() => {
        // alert(1)
        setLoading(true);
        if (userLocal.role == "admin") {
            // alert(2)
            axiosClient
                .get("/users")
                .then(({ data }) => {
                    // setLoading(false)
                    // console.log('VOICI LES UTILISATEURS :')
                    // console.log(data.data)
                    // alert(3)
                    setUsers(data.data);
                })
                .catch((err) => {
                    // setLoading(false)
                    console.log(err);
                });
        } else {
            // alert(4)
            if (userLocal) {
                // console.log('USER')
                // console.log(user)
                // console.log('USERLOCAL')
                // console.log(userLocal)
                // return
                // alert(5)
                setTerrain((prev) => ({ ...prev, user_id: userLocal.id }));
            }
        }
        if (terrainId) {
            // alert('on veut visualiser le terrain n°'+terrainId)
            // alert(6)
            setLoading(true);
            axiosClient
                .get("/terrains/" + terrainId)
                .then(({ data }) => {
                    // alert(7)
                    setLoading(false);
                    // console.log('TERRAIN N°'+terrainId+' :')
                    // console.log(data.data)
                    setTerrain(data.data);
                    const imgPrincipales = data?.data?.images_principales;
                    const imgCadres = data?.data?.images_cadres;
                    const imgAutres = data?.data?.images_autres;
                    if (imgPrincipales) {
                        const imgPTab = imgPrincipales.split("|");
                        setPhotosPrincipales(imgPTab);
                    } else {
                        setPhotosPrincipales([]);
                    }
                    if (imgCadres) {
                        const imgPTab = imgCadres.split("|");
                        setPhotosCadre(imgPTab);
                    } else {
                        setPhotosCadre([]);
                    }
                    if (imgAutres) {
                        const imgPTab = imgAutres.split("|");
                        setPhotosAutres(imgPTab);
                    } else {
                        setPhotosAutres([]);
                    }
                    if (data.data.indisponibilites) {
                        setState(parseRange(data.data.indisponibilites));
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    console.log(err);
                });
        } else {
            // alert(8)
            setLoading(false);
            // setTerrain(prev => ({...prev, user_id: user.id}))
        }
        // window.scrollTo(0,0)
    }, []);

    const handleChangeDescGenerale = (e) => {
        // alert('ok textarea desc générale')
        setTerrain((prev) => ({ ...prev, desc_generale: e.target.value }));
    };

    const handleChangeDescCadre = (e) => {
        // alert('ok textarea desc cadre')
        setTerrain((prev) => ({ ...prev, desc_cadre: e.target.value }));
    };

    const handleChangeDescEquipements = (e) => {
        // alert('ok textarea desc équipements')
        setTerrain((prev) => ({ ...prev, desc_equipement: e.target.value }));
    };

    const handleChangeDescRegles = (e) => {
        // alert('ok textarea desc règles')
        setTerrain((prev) => ({ ...prev, regles: e.target.value }));
    };

    const handleChangeDescAutresInfos = (e) => {
        // alert('ok textarea desc autres informations')
        setTerrain((prev) => ({ ...prev, autres_infos: e.target.value }));
    };

    const handlePhotoPrincipale = (e) => {
        // alert('ok image principale')
        setFormSubmitted1(true);
        setPhotosPrincipales([]);
        setPhotosPrincipalesFiles([]);
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).map((file) => {
                return URL.createObjectURL(file);
            });
            setPhotosPrincipales((prevImage) => prevImage.concat(filesArray));
            setPhotosPrincipalesFiles(e.target.files);
            Array.from(e.target.files).map((file) => {
                return URL.revokeObjectURL(file);
            });
        }
    };

    const handlePhotoCadre = (e) => {
        // alert('ok image cadre')
        setFormSubmitted2(true);
        setPhotosCadre([]);
        setPhotosCadreFiles([]);
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).map((file) => {
                return URL.createObjectURL(file);
            });
            setPhotosCadre((prevImage) => prevImage.concat(filesArray));
            setPhotosCadreFiles(e.target.files);
            Array.from(e.target.files).map((file) => {
                return URL.revokeObjectURL(file);
            });
        }
    };

    const handlePhotoAutre = (e) => {
        // alert('ok image autre')
        setFormSubmitted3(true);
        setPhotosAutres([]);
        setPhotosAutresFiles([]);
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).map((file) => {
                return URL.createObjectURL(file);
            });
            setPhotosAutres((prevImage) => prevImage.concat(filesArray));
            setPhotosAutresFiles(e.target.files);
            Array.from(e.target.files).map((file) => {
                return URL.revokeObjectURL(file);
            });
        }
    };

    useEffect(() => {
        setTerrain((prev) => ({
            ...prev,
            images_principales: photosPrincipalesFiles,
            images_cadres: photosCadreFiles,
            images_autres: photosAutresFiles,
        }));
    }, [photosPrincipalesFiles, photosCadreFiles, photosAutresFiles]);

    const handlePrixNuitee = (e) => {
        // alert('ok prix de la nuitée')
        setTerrain((prev) => ({
            ...prev,
            prix_nuitee: Number(e.target.value),
        }));
    };

    const handlePrixAdulteSupp = (e) => {
        // alert('ok prix d\'un adulte supplémentaire')
        setTerrain((prev) => ({
            ...prev,
            prix_adulte_supp: Number(e.target.value),
        }));
    };

    const handlePrixAdoSupp = (e) => {
        // alert('ok prix d\'un adolescent supplémentaire')
        setTerrain((prev) => ({
            ...prev,
            prix_ado_supp: Number(e.target.value),
        }));
    };

    const handlePrixTaxeSejour = (e) => {
        // alert('ok prix de la taxe de séjour')
        setTerrain((prev) => ({
            ...prev,
            prix_taxe_sejour: Number(e.target.value),
        }));
    };

    const handleNomPrestation = (e, input) => {
        alert("ok nom prestation " + input);
    };

    const handlePrixPrestation = (e, input) => {
        alert("ok prix prestation " + input);
    };

    const handleDescPrestation = (e, input) => {
        alert("ok description prestation " + input);
    };

    const handleAnnulation = (e) => {
        // alert('changement de délai d\'annulation')
        setSelectedAnnulationValue(e.target.value);
        setTerrain((prev) => ({ ...prev, annulation: e.target.value }));
    };

    const handleInputChange = (e) => {
        const identifier = e.target.getAttribute("data-identifier");
        const input = identifier.split("-")[0];
        const action = identifier.split("-")[1];
        // console.log('IDENTIFIER =')
        // console.log(identifier)
        switch (action) {
            case "nom":
                handleNomPrestation(e, input);
                break;
            case "prix":
                handlePrixPrestation(e, input);
                break;
            case "desc":
                handleDescPrestation(e, input);
                break;
            default:
                break;
        }
    };

    const handleAjoutPrestNew = (e) => {
        e.preventDefault();
        setLstPrestations((prev) => [
            ...prev,
            {
                terrain_id: Number(terrainId),
                nom: "",
                prix: 0,
                description: "",
            },
        ]);
    };

    const handleAjoutPresta = (e) => {
        const newIdentifier = `input${cpt}`;

        var divCol1 = document.createElement("div");
        divCol1.className = "col-12 col-sm-12 col-md-6";

        var labelNom = document.createElement("label");
        labelNom.textContent = "Nom de la prestation";

        var inputNom = document.createElement("input");
        inputNom.type = "text";
        inputNom.setAttribute("data-identifier", `${newIdentifier}-nom`);
        inputNom.className = "form-control";
        inputNom.placeholder = "Entrer le nom de la prestation";
        inputNom.addEventListener("input", handleInputChange);

        var divInput = document.createElement("div");
        divInput.appendChild(inputNom);

        divCol1.appendChild(labelNom);
        divCol1.appendChild(divInput);

        var divCol2 = document.createElement("div");
        divCol2.className = "col-12 col-sm-12 col-md-6";

        var labelPrix = document.createElement("label");
        labelPrix.textContent = "Prix de la prestation";

        var inputPrix = document.createElement("input");
        inputPrix.type = "number";
        inputPrix.setAttribute("data-identifier", `${newIdentifier}-prix`);
        inputPrix.className = "form-control";
        inputPrix.placeholder = "Entrer le prix de la prestation";
        inputPrix.addEventListener("input", handleInputChange);

        var divInput = document.createElement("div");
        divInput.appendChild(inputPrix);

        divCol2.appendChild(labelPrix);
        divCol2.appendChild(divInput);

        var divCol3 = document.createElement("div");
        divCol3.className = "col-12";

        var labelDesc = document.createElement("label");
        labelDesc.textContent = "Description de la prestation";

        var textareaDesc = document.createElement("textarea");
        textareaDesc.id = "desc_prestation";
        textareaDesc.setAttribute("data-identifier", `${newIdentifier}-desc`);
        textareaDesc.className = "form-control";
        textareaDesc.rows = "5";
        textareaDesc.placeholder = "Entrer une description pour la prestation";
        textareaDesc.addEventListener("input", handleInputChange);

        divCol3.appendChild(labelDesc);
        divCol3.appendChild(textareaDesc);

        // Ajouter les éléments créés à un conteneur existant sur votre page
        var conteneur = document.getElementById("nouvellesPrestations");
        conteneur.appendChild(divCol1);
        conteneur.appendChild(divCol2);
        conteneur.appendChild(divCol3);

        setCpt((prev) => prev + 1);
    };

    const handleInputChangeNew = (event, index) => {
        const newLstPrestation = [...lstPrestations];
        const fieldName = event.target.getAttribute("data-fieldname");
        newLstPrestation[index][fieldName] = event.target.value;

        setLstPrestations(newLstPrestation);
    };

    const handleInputChange2 = (index, field, event) => {
        setLstPrestations((prevPrestations) => {
            return prevPrestations.map((item, i) => {
                if (i !== index) return item;
                if (field == "prix") {
                    return { ...item, [field]: Number(event.target.value) };
                } else {
                    return { ...item, [field]: event.target.value };
                }
            });
        });
    };

    const appelAxios1erTab = (e) => {
        e.preventDefault();
        // alert('From = '+from)
        // return
        // alert('ok continuer')
        // terrain.type_hebergement = '0-tente|van'
        // terrain.environnement = 'radioMontagne'
        // terrain.a_proximite = 'bar|parc'
        terrain.statut_validation = "en_cours-etape1";
        // terrain.user_id = user.id
        // axiosClient.post('/admin/terrains', terrain)

        axiosClient
            .post("/terrains", terrain)
            .then(({ data }) => {
                // console.log('RETOUR DU POST TERRAIN')
                // console.log(data)
                setTerrain(data);
                setActiveTab("second");
                // window.scrollTo(0,0)
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    const appelAxiosUpdate1erTab = (e) => {
        e.preventDefault();

        // alert('update terrain '+terrainId)
        // axiosClient.post(`/admin/terrains/step1/${terrainId}`, terrain)
        axiosClient
            .post(`/terrains/step1/${terrainId}`, terrain)
            .then(({ data }) => {
                // console.log('RETOUR DU POST TERRAIN STEP 1')
                // console.log(data)
                setActiveTab("second");
                // window.scrollTo(0,0)
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    const appelAxios2emeTab = (e) => {
        e.preventDefault();
        // alert('Enregistrement des description du terrain et passage à l\'onglet n°3')
        terrain.statut_validation = "en_cours-etape2";

        // axiosClient.post(`/admin/terrains/step2/${terrain.id}`, terrain)
        axiosClient
            .post(`/terrains/step2/${terrain.id}`, terrain)
            .then(({ data }) => {
                // console.log('RETOUR DU POST TERRAIN STEP 2')
                // console.log(data)
                setActiveTab("third");
                // window.scrollTo(0,0)
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    const appelAxios3emeTab = (e) => {
        e.preventDefault();
        // alert('Enregistrement des images du terrain et passage à l\'onglet n°4')
        terrain.statut_validation = "en_cours-etape3";

        let formData = new FormData();

        for (let cle in terrain) {
            if (
                cle != "images_principales" &&
                cle != "images_cadres" &&
                cle != "images_autres"
            ) {
                if (terrain.hasOwnProperty(cle)) {
                    formData.append(cle, terrain[cle]);
                }
            }
        }

        for (let i = 0; i < terrain.images_principales.length; i++) {
            formData.append(
                "images_principales[]",
                terrain.images_principales[i]
            );
        }
        for (let i = 0; i < terrain.images_cadres.length; i++) {
            formData.append("images_cadres[]", terrain.images_cadres[i]);
        }
        for (let i = 0; i < terrain.images_autres.length; i++) {
            formData.append("images_autres[]", terrain.images_autres[i]);
        }

        // axiosClient.post(`/admin/terrains/step3/${terrain.id}`, formData)
        axiosClient
            .post(`/terrains/step3/${terrain.id}`, formData)
            .then(({ data }) => {
                // console.log('RETOUR DU POST TERRAIN STEP 3')
                // console.log(data)
                setActiveTab("fourth");
                // window.scrollTo(0,0)
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    const appelAxios4emeTab = (e) => {
        e.preventDefault();
        // alert('Enregistrement de l\'adresse du terrain et passage à l\'onglet n°5')
        terrain.statut_validation = "en_cours-etape4";

        // axiosClient.post(`/admin/terrains/step4/${terrain.id}`, terrain)
        axiosClient
            .post(`/terrains/step4/${terrain.id}`, terrain)
            .then(({ data }) => {
                // console.log('RETOUR DU POST TERRAIN STEP 4')
                // console.log(data)
                setActiveTab("fifth");
                // window.scrollTo(0,0)
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    const appelAxios5emeTab = (e) => {
        e.preventDefault();
        // alert('Enregistrement du prix du terrain et des éventuelles prestations')
        terrain.statut_validation = "en_cours-etape5";
        if (
            lstPrestations.length == 1 &&
            (lstPrestations[0].nom == "" ||
                lstPrestations[0].prix == 0 ||
                lstPrestations[0].description == "")
        ) {
        } else {
            // console.log('LSTPRESTATIONS AVANT APPEL AXIOS :')
            // console.log(lstPrestations)
            terrain.lstPrestations = lstPrestations;
        }

        // console.log('AVANT APPEL AXIOS LSTPRESTATIONS :')
        // console.log(lstPrestations)
        // return
        // axiosClient.post(`/admin/terrains/step5/${terrain.id}`, terrain)
        axiosClient
            .post(`/terrains/step5/${terrain.id}`, terrain)
            .then(({ data }) => {
                // console.log('RETOUR DU POST TERRAIN STEP 5')
                // console.log(data)
                setActiveTab("sixth");
                // window.scrollTo(0,0)
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    const appelAxios6emeTab = (e) => {
        e.preventDefault();
        // alert('Enregistrement final du terrain !')
        // console.log('STAAAAAAAAAAAAAAAAAAAATE =')
        // console.log(state)
        // axiosClient.post(`/admin/terrains/step6/${terrain.id}`, terrain)
        axiosClient
            .post(`/terrains/step6/${terrain.id}`, terrain)
            .then(({ data }) => {
                // console.log('RETOUR DU POST TERRAIN STEP 6')
                // console.log(data)
                handleShow();
                setActiveTab("first");
                // window.scrollTo(0,0)
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });

        // setState({
        //     selection1: {
        //         //   startDate: addDays(new Date(), 1),
        //         startDate: addDays(new Date(), 0),
        //         endDate: addDays(new Date(), 0),
        //         key: 'selection1'
        //     },
        //     // selection2: {
        //     //     //   startDate: addDays(new Date(), 1),
        //     //     startDate: addDays(new Date(), 1),
        //     //     endDate: addDays(new Date(), 1),
        //     //     key: 'selection2'
        //     // },
        // })
        // addRange()
        // navigate('/')
        // window.scrollTo(0,0)
    };

    const handleProprietaire = (e) => {
        e.preventDefault();
        // console.log('VALEUUUUUUUUUUUUR = ')
        // console.log(e.target.value)
        setTerrain((prev) => ({ ...prev, user_id: e.target.value }));
    };

    useEffect(() => {
        // console.log('CHANGEMENT DU TERRAIN USER_ID =')
        // console.log(terrain.user_id)
        // console.log('Terrain :')
        // console.log(terrain)
    }, [terrain]);

    useEffect(() => {
        // console.log('FROM = ')
        // console.log(from)
        // console.log('TERRAINID = ')
        // console.log(terrainId)
    }, []);

    return (
        <div className="container">
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    {terrainId ? (
                        <Modal.Title>
                            Modification du terrain réussi
                        </Modal.Title>
                    ) : (
                        <Modal.Title>Ajout du terrain réussi</Modal.Title>
                    )}
                </Modal.Header>
                <Modal.Body>
                    {terrainId ? (
                        <p>Votre terrain à bien été modifié !</p>
                    ) : (
                        <p>Votre terrain à bien été ajouté !</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <h1 className="text-center">
                {user.role == "user"
                    ? !loading && !terrain.id
                        ? "Créer ton annonce"
                        : "Modifie ton annonce"
                    : !loading && !terrainId
                    ? "Ajouter une annonce pour un utilisateur"
                    : "Modifier une annonce pour un utilisateur"}
            </h1>

            <Tabs
                activeKey={activeTab}
                onSelect={handleTabSelect}
                defaultActiveKey="first"
                fill
                className="customLink"
            >
                <Tab eventKey="first" title="Infos générales">
                    {activeTab === "first" && (
                        <div>
                            <h2>Informations générales sur le terrain</h2>
                            {!loading && user.role == "admin" && (
                                <div className="my-3 col-md-6 mx-auto">
                                    <h3>Choisir un utilisateur</h3>
                                    <div className="form-floating">
                                        <select
                                            className="form-select"
                                            onChange={handleProprietaire}
                                            id="floatingSelect2"
                                            // size={6}
                                            value={
                                                terrain.user_id !== null
                                                    ? terrain.user_id
                                                    : ""
                                            }
                                        >
                                            <option defaultValue>
                                                Choisir un propriétaire
                                            </option>
                                            {/* mapper sur les users */}
                                            {users.length > 0 &&
                                                users.map((u, cle) => {
                                                    return (
                                                        <option
                                                            value={u.id}
                                                            key={cle}
                                                        >
                                                            {u.name}
                                                        </option>
                                                    );
                                                })}
                                        </select>
                                        <label htmlFor="floatingSelect2">
                                            Choix du propriétaire du terrain
                                        </label>
                                    </div>
                                </div>
                            )}
                            {!loading && (
                                <TypeHebergement
                                    terrain={terrain}
                                    updateTerrain={updateTerrain}
                                />
                            )}
                            <br />
                            {!loading && (
                                <NombreVisiteurs
                                    terrain={terrain}
                                    updateTerrain={updateTerrain}
                                />
                            )}
                            <br />
                            {!loading && (
                                <Environnement
                                    terrain={terrain}
                                    updateTerrain={updateTerrain}
                                />
                            )}
                            <br />
                            {!loading && (
                                <Equipements
                                    terrain={terrain}
                                    updateTerrain={updateTerrain}
                                />
                            )}
                            <br />
                            {!loading && (
                                <AProximite
                                    terrain={terrain}
                                    updateTerrain={updateTerrain}
                                />
                            )}
                            <br />
                            <div className="text-center">
                                <Link
                                    className="btn mt-2"
                                    to={"#"}
                                    style={{
                                        background: "#25632d",
                                        color: "white",
                                    }}
                                    onClick={
                                        terrainId
                                            ? appelAxiosUpdate1erTab
                                            : appelAxios1erTab
                                    }
                                >
                                    {terrain.id ? "Modifier" : "Enregistrer"}
                                </Link>
                            </div>
                        </div>
                    )}
                </Tab>
                <Tab eventKey="second" title="Description">
                    {activeTab === "second" && (
                        <div>
                            <h1>Donnez plus de détail sur votre terrain</h1>

                            <div className="col-12 col-md-8 mx-auto">
                                <h5>
                                    <LuTent
                                        style={{
                                            fontSize: "25px",
                                            color: "red",
                                            marginRight: "10px",
                                        }}
                                    />
                                    Donnez un nom à votre terrain :
                                </h5>
                                <input
                                    className={`form-control ${
                                        errors?.nom ? "border-danger" : ""
                                    }`}
                                    id="nomTerrain"
                                    type="text"
                                    placeholder="Entrer un nom pour votre terrain"
                                    value={terrain.nom ? terrain.nom : ""}
                                    onChange={(e) => {
                                        setTerrain((prev) => ({
                                            ...prev,
                                            nom: e.target.value,
                                        }));
                                    }}
                                />
                            </div>

                            {!loading && (
                                <BoxDescription
                                    isMendatory
                                    value={terrain.desc_generale}
                                    className={`${
                                        errors?.desc_generale
                                            ? "border-danger"
                                            : ""
                                    }`}
                                    name={"desc_generale"}
                                    id={"desc_generale"}
                                    placeholder={
                                        "Entrer une description générale du terrain"
                                    }
                                    titre={
                                        "Dites-nous en plus sur votre terrain ..."
                                    }
                                    message={
                                        "Important ! Renseignez le maximum de détails sur votre terrain afin que les potentiels gampeurs aient l'envie de le réserver."
                                    }
                                    onChange={handleChangeDescGenerale}
                                />
                            )}

                            {!loading && (
                                <BoxDescription
                                    isMendatory
                                    value={terrain.desc_cadre}
                                    className={`${
                                        errors?.desc_cadre
                                            ? "border-danger"
                                            : ""
                                    }`}
                                    name={"desc_cadre"}
                                    id={"desc_cadre"}
                                    placeholder={
                                        "Entrer une description du cadre du terrain"
                                    }
                                    titre={"Détaillez le cadre du terrain ..."}
                                    message={
                                        "Important ! Décrivez aux gampeurs le lieu où ils résideront (les alentours, le bruit, le trafic, la vue, etc.)"
                                    }
                                    onChange={handleChangeDescCadre}
                                />
                            )}

                            {!loading && (
                                <BoxDescription
                                    isMendatory
                                    value={terrain.desc_equipement}
                                    className={`${
                                        errors?.desc_equipement
                                            ? "border-danger"
                                            : ""
                                    }`}
                                    name={"desc_equipements"}
                                    id={"desc_equipements"}
                                    placeholder={
                                        "Entrer une description des équipements"
                                    }
                                    titre={
                                        "Détaillez les équipements mis à disposition ..."
                                    }
                                    message={
                                        "Important ! Renseignez le maximum de détails concernant l'utilisation des équipements"
                                    }
                                    onChange={handleChangeDescEquipements}
                                />
                            )}

                            <div className="my-3">
                                <h5>
                                    <LuTent
                                        style={{
                                            fontSize: "25px",
                                            color: "red",
                                            marginRight: "10px",
                                        }}
                                    />
                                    Annulations
                                </h5>
                                <div className="row">
                                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 mx-auto">
                                        <div className="form-floating">
                                            <select
                                                id="annulation"
                                                className={`form-select ${
                                                    errors?.annulation
                                                        ? "border-danger"
                                                        : ""
                                                }`}
                                                onChange={handleAnnulation}
                                                // value={selectedAnnulationValue}
                                                value={
                                                    terrain.annulation
                                                        ? terrain.annulation
                                                        : ""
                                                }
                                            >
                                                <option value="">
                                                    Choisir une durée
                                                </option>
                                                <option value="24">
                                                    24 heures avant l'arrivée
                                                </option>
                                                <option value="48">
                                                    48 heures avant l'arrivée
                                                </option>
                                                <option value="72">
                                                    72 heures avant l'arrivée
                                                </option>
                                                <option value="no">
                                                    Pas d'annulation possible
                                                </option>
                                            </select>
                                            <label htmlFor="annulation">
                                                Choix du délai d'annulation
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="my-3">
                                <h5>
                                    <LuTent
                                        style={{
                                            fontSize: "25px",
                                            color: "red",
                                            marginRight: "10px",
                                        }}
                                    />
                                    Heure d'arrivée / heure de départ
                                </h5>
                                <div className="row">
                                    <div className="col-12 col-sm-10 col-md-6 col-lg-6 col-xl-4 mx-auto">
                                        Heure d'arrivée :
                                        <div>
                                            <input
                                                className={`form-control ${
                                                    errors?.heure_arrivee
                                                        ? "border-danger"
                                                        : ""
                                                }`}
                                                type="time"
                                                id="heureArrivee"
                                                value={
                                                    terrain.heure_arrivee
                                                        ? terrain.heure_arrivee
                                                        : ""
                                                }
                                                onChange={(e) => {
                                                    // alert('changement heure arrivee')
                                                    // console.log('CHANGEMENT HEURE ARRIVEE')
                                                    // console.log('Heure = '+e.target.value)
                                                    setTerrain((prev) => ({
                                                        ...prev,
                                                        heure_arrivee:
                                                            e.target.value,
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-10 col-md-6 col-lg-6 col-xl-4 mx-auto">
                                        Heure de départ :
                                        <div>
                                            <input
                                                className={`form-control ${
                                                    errors?.heure_depart
                                                        ? "border-danger"
                                                        : ""
                                                }`}
                                                type="time"
                                                id="heureDepart"
                                                value={
                                                    terrain.heure_depart
                                                        ? terrain.heure_depart
                                                        : ""
                                                }
                                                onChange={(e) => {
                                                    // alert('changement heure départ')
                                                    // console.log('CHANGEMENT HEURE DEPART')
                                                    // console.log('Heure = '+e.target.value)
                                                    setTerrain((prev) => ({
                                                        ...prev,
                                                        heure_depart:
                                                            e.target.value,
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {!loading && (
                                <BoxDescription
                                    isMendatory
                                    value={terrain.regles}
                                    className={`${
                                        errors?.regles ? "border-danger" : ""
                                    }`}
                                    name={"desc_regles"}
                                    id={"desc_regles"}
                                    placeholder={
                                        "Entrer les règles à respecter"
                                    }
                                    titre={
                                        "Détaillez les règles à respecter sur le terrain ..."
                                    }
                                    message={
                                        "Important ! Renseignez le maximum de détails."
                                    }
                                    onChange={handleChangeDescRegles}
                                />
                            )}

                            {!loading && (
                                <BoxDescription
                                    value={terrain.autres_infos}
                                    name={"desc_autres_infos"}
                                    id={"desc_autres_infos"}
                                    placeholder={
                                        "Entrer les autres informations importantes"
                                    }
                                    titre={
                                        "Autres informations importantes ..."
                                    }
                                    message={
                                        "Important ! Renseignez le maximum de détails."
                                    }
                                    onChange={handleChangeDescAutresInfos}
                                />
                            )}

                            <div className="text-center">
                                <Link
                                    className="btn mt-2"
                                    to={"#"}
                                    style={{
                                        background: "#25632d",
                                        color: "white",
                                    }}
                                    onClick={appelAxios2emeTab}
                                >
                                    Enregistrer
                                </Link>
                            </div>
                        </div>
                    )}
                </Tab>
                <Tab eventKey="third" title="Photos">
                    {activeTab === "third" && (
                        <div>
                            <h1>Photos</h1>

                            <BoxImage
                                isMendatory
                                className={"img_principale"}
                                id={"img_principale"}
                                titre={"Photos principales"}
                                conseil={
                                    "Conseil : un terrain avec plusieurs photos attirera plus de gampeurs"
                                }
                                onChange={handlePhotoPrincipale}
                            />

                            <div
                                className="mt-3"
                                style={{ textAlign: "center" }}
                            >
                                {/* {
                            renderPhotos(photosPrincipales)
                        } */}
                                {!formSubmitted1
                                    ? photosPrincipales &&
                                      photosPrincipales.map((url) => {
                                          return (
                                              <img
                                                  //   src={
                                                  //       "http://localhost:8000/" +
                                                  //       url
                                                  //   }
                                                  src={
                                                      "https://apidev.gampy.ch/" +
                                                      url
                                                  }
                                                  alt=""
                                                  key={url}
                                                  style={{
                                                      width: "250px",
                                                      height: "150px",
                                                  }}
                                              />
                                          );
                                      })
                                    : photosPrincipales &&
                                      photosPrincipales.map((url) => {
                                          return (
                                              <img
                                                  src={url}
                                                  alt=""
                                                  key={url}
                                                  style={{
                                                      width: "250px",
                                                      height: "150px",
                                                  }}
                                              />
                                          );
                                      })}
                            </div>

                            <BoxImage
                                isMendatory
                                className={"img_cadre"}
                                id={"img_cadre"}
                                titre={"Photos du cadre"}
                                conseil={
                                    "Conseil : un cadre mis en avant attirera plus de gampeurs"
                                }
                                onChange={handlePhotoCadre}
                            />

                            <div
                                className="mt-3"
                                style={{ textAlign: "center" }}
                            >
                                {/* {
                            renderPhotos(photosCadre)
                        } */}
                                {!formSubmitted2
                                    ? photosCadre &&
                                      photosCadre.map((url) => {
                                          return (
                                              <img
                                                  //   src={
                                                  //       "http://localhost:8000/" +
                                                  //       url
                                                  //   }
                                                  src={
                                                      "https://apidev.gampy.ch/" +
                                                      url
                                                  }
                                                  alt=""
                                                  key={url}
                                                  style={{
                                                      width: "250px",
                                                      height: "150px",
                                                  }}
                                              />
                                          );
                                      })
                                    : photosCadre &&
                                      photosCadre.map((url) => {
                                          return (
                                              <img
                                                  src={url}
                                                  alt=""
                                                  key={url}
                                                  style={{
                                                      width: "250px",
                                                      height: "150px",
                                                  }}
                                              />
                                          );
                                      })}
                            </div>

                            <BoxImage
                                className={"img_autre"}
                                id={"img_autre"}
                                titre={"Autres photos"}
                                conseil={
                                    "Conseil : plusieurs photos attireront plus de gampeurs"
                                }
                                onChange={handlePhotoAutre}
                            />

                            <div
                                className="mt-3"
                                style={{ textAlign: "center" }}
                            >
                                {/* {
                            renderPhotos(photosAutres)
                        } */}
                                {!formSubmitted3
                                    ? photosAutres &&
                                      photosAutres.map((url) => {
                                          return (
                                              <img
                                                  //   src={
                                                  //       "http://localhost:8000/" +
                                                  //       url
                                                  //   }
                                                  src={
                                                      "https://apidev.gampy.ch/" +
                                                      url
                                                  }
                                                  alt=""
                                                  key={url}
                                                  style={{
                                                      width: "250px",
                                                      height: "150px",
                                                  }}
                                              />
                                          );
                                      })
                                    : photosAutres &&
                                      photosAutres.map((url) => {
                                          return (
                                              <img
                                                  src={url}
                                                  alt=""
                                                  key={url}
                                                  style={{
                                                      width: "250px",
                                                      height: "150px",
                                                  }}
                                              />
                                          );
                                      })}
                            </div>

                            <div className="text-center">
                                <Link
                                    className="btn mt-2"
                                    to={"#"}
                                    style={{
                                        background: "#25632d",
                                        color: "white",
                                    }}
                                    onClick={appelAxios3emeTab}
                                >
                                    Enregistrer
                                </Link>
                            </div>
                        </div>
                    )}
                </Tab>
                <Tab eventKey="fourth" title="Adresse">
                    {activeTab === "fourth" && (
                        <div>
                            <h1>Adresse du terrain</h1>
                            <div>
                                L'adresse sera uniquement visible après le
                                paiement d'une réservation.
                            </div>
                            {!loading && (
                                <AdresseTerrain
                                    terrain={terrain}
                                    updateTerrain={updateTerrain}
                                />
                            )}
                            <div className="text-center">
                                <Link
                                    className="btn mt-2"
                                    to={"#"}
                                    style={{
                                        background: "#25632d",
                                        color: "white",
                                    }}
                                    onClick={appelAxios4emeTab}
                                >
                                    Enregistrer
                                </Link>
                            </div>
                        </div>
                    )}
                </Tab>
                <Tab eventKey="fifth" title="Prix">
                    {activeTab === "fifth" && (
                        <div>
                            <h2>Prix</h2>

                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <h5>
                                        <LuTent
                                            style={{
                                                fontSize: "25px",
                                                color: "red",
                                                marginRight: "10px",
                                            }}
                                        />
                                        Prix de la nuitée (2 pers.)
                                    </h5>
                                    <div>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Entrer un prix pour la nuitée"
                                            value={
                                                terrain.prix_nuitee == 0
                                                    ? ""
                                                    : terrain.prix_nuitee
                                            }
                                            onChange={handlePrixNuitee}
                                        />
                                    </div>
                                    <div style={{ color: "red" }}>
                                        30 CHF minimum
                                    </div>
                                    <br />
                                    <h5>
                                        <LuTent
                                            style={{
                                                fontSize: "25px",
                                                color: "red",
                                                marginRight: "10px",
                                            }}
                                        />
                                        Prix d'un adolescent supplémentaire
                                    </h5>
                                    <div>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Entrer un prix pour un ado supp."
                                            value={
                                                terrain.prix_ado_supp == 0
                                                    ? ""
                                                    : terrain.prix_ado_supp
                                            }
                                            onChange={handlePrixAdoSupp}
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <h5>
                                        <LuTent
                                            style={{
                                                fontSize: "25px",
                                                color: "red",
                                                marginRight: "10px",
                                            }}
                                        />
                                        Prix par adulte supplémentaire
                                    </h5>
                                    <div>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Entrer un prix pour un adulte supp."
                                            value={
                                                terrain.prix_adulte_supp == 0
                                                    ? ""
                                                    : terrain.prix_adulte_supp
                                            }
                                            onChange={handlePrixAdulteSupp}
                                        />
                                    </div>
                                    <br />
                                    <br />
                                    <h5>Prix de la taxe de séjour</h5>
                                    <div>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Entrer un prix pour la taxe de séjour"
                                            value={
                                                terrain.prix_taxe_sejour == 0
                                                    ? ""
                                                    : terrain.prix_taxe_sejour
                                            }
                                            onChange={handlePrixTaxeSejour}
                                        />
                                    </div>
                                </div>
                            </div>

                            {lstPrestations.length > 0 && (
                                <div>
                                    <div className="row my-3">
                                        <h2>
                                            Prix des prestations supplémentaires
                                            (ex: repas, visites guidées,
                                            transport, etc.)
                                        </h2>
                                        {lstPrestations.map((presta, cle) => {
                                            return (
                                                <div className="row" key={cle}>
                                                    <div className="col-12 col-sm-12 col-md-6">
                                                        Nom de la prestation
                                                        <div>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                // date-fieldName='nom'
                                                                // data-identifier={'input1-nom'}
                                                                data-identifier={
                                                                    cle
                                                                }
                                                                // onChange={handleNomPrestation}
                                                                // onChange={handleInputChange}
                                                                // onChange={e => handleInputChangeNew(e, cle)}
                                                                onChange={(e) =>
                                                                    handleInputChange2(
                                                                        cle,
                                                                        "nom",
                                                                        e
                                                                    )
                                                                }
                                                                placeholder="Entrer le nom de la prestation"
                                                                value={
                                                                    presta.nom
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-12 col-md-6">
                                                        Prix de la prestation
                                                        <div>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                // data-fieldName='prix'
                                                                // data-identifier={'input1-prix'}
                                                                data-identifier={
                                                                    cle
                                                                }
                                                                // onChange={handlePrixPrestation}
                                                                // onChange={handleInputChange}
                                                                // onChange={e => handleInputChangeNew(e, cle)}
                                                                onChange={(e) =>
                                                                    handleInputChange2(
                                                                        cle,
                                                                        "prix",
                                                                        e
                                                                    )
                                                                }
                                                                placeholder="Entrer le prix de la prestation"
                                                                value={
                                                                    presta.prix
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        Description de la
                                                        prestation
                                                        <div>
                                                            <textarea
                                                                id="desc_prestation"
                                                                className="form-control"
                                                                // data-fieldName='description'
                                                                // data-identifier={'input1-desc'}
                                                                data-identifier={
                                                                    cle
                                                                }
                                                                rows="5"
                                                                // onChange={handleDescPrestation}
                                                                // onChange={handleInputChange}
                                                                // onChange={e => handleInputChangeNew(e, cle)}
                                                                onChange={(e) =>
                                                                    handleInputChange2(
                                                                        cle,
                                                                        "description",
                                                                        e
                                                                    )
                                                                }
                                                                placeholder="Entrer une description pour la prestation"
                                                                value={
                                                                    presta.description
                                                                }
                                                            ></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div
                                        className="row"
                                        id="nouvellesPrestations"
                                    ></div>
                                    <div className="col-12 text-center">
                                        <Link
                                            className="btn mt-2"
                                            to={"#"}
                                            style={{
                                                background: "#25632d",
                                                color: "white",
                                            }}
                                            // onClick={handleAjoutPresta}
                                            onClick={handleAjoutPrestNew}
                                        >
                                            Ajouter une prestation
                                        </Link>
                                    </div>
                                </div>
                            )}

                            <div className="text-center mt-3">
                                <Link
                                    className="btn mt-2"
                                    to={"#"}
                                    style={{
                                        background: "#25632d",
                                        color: "white",
                                    }}
                                    onClick={appelAxios5emeTab}
                                >
                                    Enregistrer
                                </Link>
                            </div>
                        </div>
                    )}
                </Tab>
                <Tab eventKey="sixth" title="Calendrier">
                    {activeTab === "sixth" && (
                        <div>
                            {/* <div>
                        <h1>Calendrier</h1>
                        <Calendar 
                            // style={{ width: '100% !important' }}
                            className={'myCalendar'}
                            onChange={onChangeDebut}
                            // value={valueStart}
                        />
                    </div>
                    <br /><br /> */}
                            <h1>Indisponibilités du terrain</h1>
                            <div className="my-3 text-center">
                                <Link
                                    className="btn my-2"
                                    to={"#"}
                                    style={{
                                        background: "#25632d",
                                        color: "white",
                                    }}
                                    onClick={addRange}
                                >
                                    Ajouter une indisponibilité
                                </Link>
                                {/* <button 
                            className='form-control mt-2'
                            onClick={addRange}
                        >
                            Ajouter une range
                        </button> */}
                                <DateRangePicker
                                    className="myCalendar"
                                    // onChange={item => setState({ ...state, ...item })}
                                    // onChange={item => {
                                    //     let newState = [...state]
                                    //     newState.find(range => range.key === item.selection.key).startDate = item.selection.startDate
                                    //     newState.find(range => range.key === item.selection.key).endDate = item.selection.endDate
                                    //     setState(newState)
                                    // }}
                                    onChange={handleRangeChange}
                                    // ranges={[state.selection1, state.selection2, state.selection3]}
                                    // ranges={[state.selection1]}
                                    ranges={state}
                                    // ranges={ranges}
                                    rangeColors={["#25632d"]}
                                />
                            </div>
                            <div className="text-center">
                                <Link
                                    className="btn mt-2"
                                    to={"#"}
                                    style={{
                                        background: "#25632d",
                                        color: "white",
                                    }}
                                    onClick={appelAxios6emeTab}
                                >
                                    Enregistrer
                                </Link>
                                {/* <Link
                            className='btn mt-2 mx-2'
                            style={{ background:'#25632d',color:'white' }}
                            to={'#'}
                            onClick={()=>{
                                alert('okay')
                                const newRange = {
                                    startDate: null,
                                    endDate: null,
                                    key: `selection${ranges.length+1}`
                                }
                                setRanges(prev => [...prev, newRange])
                            }}
                        >
                            Ajouter une range
                        </Link> */}
                            </div>
                        </div>
                    )}
                </Tab>
            </Tabs>
        </div>
    );
}
