import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import axiosClient from "../axios-client";

export default function Profile() {
    const [id, setId] = useState(null);
    const inputRef = useRef();
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(true);
    const userLocal =
        localStorage.getItem("USER") != null
            ? JSON.parse(localStorage.getItem("USER"))
            : "vide";
    const { user, token, setUser, setToken, notification, setNotification } =
        useStateContext();
    const [selectedFile, setSelectedFile] = useState(null);
    const [nom, setNom] = useState(userLocal?.name.split(" ")[1]);
    const [prenom, setPrenom] = useState(userLocal?.name.split(" ")[0]);
    const [userVille, setUserVille] = useState("");
    const [userNpa, setUserNpa] = useState("");
    const [userRue, setUserRue] = useState("");
    const [userPays, setUserPays] = useState("");

    const [newUser, setNewUser] = useState({
        id: "",
        nom: "",
        prenom: "",
        pseudo: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone_number: "",
        date_of_birth: "",
        address: "",
        role: "",
        biographie: "",
        image: "",
    });

    const { isLoaded, loadError } = useJsApiLoader({
        // id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_CLE_MAPS_API_2,
        libraries: ["places"],
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
        // types: ["establishment"]
    };

    useEffect(() => {
        setLoading(true);
        axiosClient
            .get(`/users/${userLocal.id}`)
            .then(({ data }) => {
                setLoading(false);
                // console.log('DATA =')
                // console.log(data)
                setNewUser((prevState) => ({
                    id: data.id || prevState.id,
                    nom:
                        data.name.split(" ")[0] || prevState.name.split(" ")[0],
                    prenom:
                        data.name.split(" ")[1] || prevState.name.split(" ")[1],
                    pseudo: data.pseudo || prevState.pseudo,
                    email: data.email || prevState.email,
                    password: data.password || prevState.password,
                    password_confirmation:
                        data.password_confirmation ||
                        prevState.password_confirmation,
                    phone_number: data.phone_number || prevState.phone_number,
                    date_of_birth:
                        data.date_of_birth || prevState.date_of_birth,
                    address: data.address || prevState.address,
                    role: data.role || prevState.role,
                    biographie: data.biographie || prevState.biographie,
                    image: data.image || prevState.image,
                }));
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    }, []);

    useEffect(() => {
        // console.log('USER =')
        // console.log(user)
        // console.log('USERLOCAL =')
        // console.log(userLocal)
        // console.log('NEWUSER =')
        // console.log(newUser)
        if (!isLoaded) {
            return;
        }
        const autoComplete = new window.google.maps.places.Autocomplete(
            inputRef.current,
            options
        );
        autoComplete.addListener("place_changed", () => {
            const place = autoComplete.getPlace();
            // console.log('PLACE =')
            // console.log(place)
            const formattedAddressArray = place.formatted_address.split(",");
            const rue = formattedAddressArray[0];
            const ville = formattedAddressArray[1].trim().split(" ")[1];
            const npa = formattedAddressArray[1].trim().split(" ")[0];
            const pays = formattedAddressArray[2];
            document.getElementById("address").value =
                rue + " " + npa + " " + ville + " " + pays;
            // document.getElementById('ville').value = ville
            // document.getElementById('npa').value = npa
            // document.getElementById('pays').value = pays
            // setNewUser({...newUser, ville: ville})
            // setNewUser({...newUser, npa: npa})
            // setNewUser({...newUser, pays: pays})
            setNewUser((prev) => ({
                ...prev,
                address: rue + " " + npa + " " + ville + " " + pays,
            }));
        });
    }, [isLoaded]);

    useEffect(() => {
        // console.log('USEEFFECT [NEWUSER] :')
        // console.log('NEWUSER =')
        // console.log(newUser)
    }, [newUser]);

    const handleChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setSelectedFile(file);
        // console.log('NEWUSER ONCHANGE BEFORE = ')
        // console.log(newUser)
        setNewUser({ ...newUser, image: file });
        // console.log('NEWUSER ONCHANGE AFTER = ')
        // console.log(newUser)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // alert('ouvrir console ...')

        // console.log('NEWUSER = ')
        // console.log(newUser)
        // console.log('USERLOCAL = ')
        // console.log(userLocal)
        const formData = new FormData();
        formData.append("id", newUser.id);
        formData.append("name", userLocal.name);
        formData.append("nom", newUser.nom);
        formData.append("prenom", newUser.prenom);
        formData.append("pseudo", newUser.pseudo);
        formData.append("email", newUser.email);
        formData.append("password", newUser.password);
        formData.append("password_confirmation", newUser.password_confirmation);
        formData.append("phone_number", newUser.phone_number);
        formData.append("date_of_birth", newUser.date_of_birth);
        formData.append("address", newUser.address);
        formData.append("biographie", newUser.biographie);
        formData.append("image", newUser.image);
        formData.append("role", newUser.role);
        let date = new Date();
        let current_date =
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate();
        let current_time =
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        let date_time = current_date + " " + current_time;
        formData.append("updated_at", date_time);

        // console.log('FORMDATA =')
        // console.log(formData)
        // console.log(formData.get('id'))
        // const obj = {}

        // formData.forEach((value, key)=>{
        //     obj[key] = value
        // })

        // const json = JSON.stringify(obj)

        // console.log('JSON =')
        // console.log(json)
        submitRequest(formData);
    };

    const submitRequest = (fd) => {
        axiosClient
            .post(`/users/${newUser.id}/update`, fd)
            .then(({ data }) => {
                // console.log('DATA =')
                // console.log(data)
                // setIsShown(current=>!current)
                setNotification("User was successfully updated !");
                window.scrollTo(0, 0);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    // setErrors(response.data.errors)
                    console.log(response.data.errors);
                }
            });
    };

    return (
        <div className="container">
            {notification && (
                <div
                    style={{
                        textAlign: "center",
                        background: "green",
                        color: "white",
                        fontWeight: "bold",
                        padding: "15px 10px",
                    }}
                >
                    {notification}
                </div>
            )}
            <h1 className="text-center">
                Bonjour {userLocal && userLocal.name}
            </h1>
            <h3>Photo de profile</h3>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div
                        className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto"
                        style={{ border: "1px solid black", height: "100%" }}
                    >
                        <div className="row h-100 bg-dark">
                            <div
                                className="d-flex align-items-center justify-content-center col-12 col-sm-12 col-md-5 col-lg-4"
                                style={{ height: "100%" }}
                            >
                                {/* <img src="https://placehold.co/600x400/25632d/FFF?text=Photo+de+profil" className="card-img-top img-fluid" style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto' }} /> */}
                                {selectedFile ? (
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        className="img-fluid rounded-circle"
                                    />
                                ) : userLocal && userLocal.image != null ? (
                                    // <img src={'http://localhost:8000/'+userLocal.image} className='img-fluid rounded-circle' />
                                    <img
                                        src={
                                            "http://apidev.gampy.ch/" +
                                            userLocal.image
                                        }
                                        className="img-fluid rounded-circle"
                                    />
                                ) : (
                                    <img
                                        src={"profile-icon.png"}
                                        className="img-fluid rounded-circle"
                                        style={{ background: "white" }}
                                    />
                                )}
                                {/* {
                            userLocal && userLocal.image != null && (
                                <img src={'http://localhost:8000/'+userLocal.image} className='img-fluid rounded-circle' />
                            )
                        }
                        {
                            userLocal && userLocal.image == null && (
                                <img src={'profile-icon.png'} className='img-fluid' />
                            )
                        } */}
                            </div>
                            <div
                                className="d-flex align-items-center justify-content-center col-12 col-sm-12 col-md-7 col-lg-8"
                                style={{ height: "" }}
                            >
                                <div className="d-flex align-items-center justify-content-center">
                                    <input
                                        type="file"
                                        name="file"
                                        tabIndex="1"
                                        className="form-control d-flex align-items-center justify-content-center"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <h3 className="mt-3">Informations personnelles</h3>
                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <div className="mb-3">
                            <label htmlFor="nom" className="form-label">
                                Nom
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="nom"
                                tabIndex="2"
                                value={newUser.nom}
                                // value={newUser?.name.split(' ')[1].charAt(0).toUpperCase() + newUser?.name.split(' ')[1].slice(1)}
                                onChange={(e) =>
                                    setNewUser((prev) => ({
                                        ...prev,
                                        nom: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="pseudo" className="form-label">
                                Pseudo
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="pseudo"
                                tabIndex="4"
                                value={newUser.pseudo}
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        pseudo: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">
                                Adresse
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                ref={inputRef}
                                tabIndex="8"
                                value={
                                    newUser.address !== null
                                        ? newUser.address
                                        : ""
                                }
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        address: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <div className="mb-3">
                            <label htmlFor="prenom" className="form-label">
                                Prénom
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="prenom"
                                tabIndex="3"
                                value={newUser.prenom}
                                onChange={(e) =>
                                    setNewUser((prev) => ({
                                        ...prev,
                                        prenom: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                tabIndex="5"
                                value={newUser.email}
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="phone_number"
                                className="form-label"
                            >
                                Numéro de téléphone
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="phone_number"
                                tabIndex="9"
                                value={newUser.phone_number}
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        phone_number: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="mb-3">
                            <label htmlFor="biographie" className="form-label">
                                Biographie
                            </label>
                            <textarea
                                id="biographie"
                                rows="5"
                                className="form-control"
                                tabIndex="10"
                                value={
                                    newUser.biographie !== null
                                        ? newUser.biographie
                                        : ""
                                }
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        biographie: e.target.value,
                                    })
                                }
                            ></textarea>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <h3>Modifier mon mot de passe</h3>
                    <div className="col-sm-12 col-md-6">
                        <div className="mb-3">
                            <label htmlFor="mdp" className="form-label">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="mdp"
                                tabIndex="6"
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        password: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <div className="mb-3">
                            <label htmlFor="mdpConfirme" className="form-label">
                                Mot de passe confirmé
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="mdpConfirme"
                                tabIndex="7"
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        password_confirmation: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col-3 mx-auto">
                        <button
                            type="submit"
                            className="btn"
                            style={{ background: "#25632d", color: "white" }}
                            tabIndex="11"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
