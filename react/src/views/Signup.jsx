import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Signup() {
    const [errors, setErrors] = useState(null);
    const { setUser, setToken } = useStateContext();

    const nomRef = useRef();
    const prenomRef = useRef();
    const pseudoRef = useRef();
    const emailRef = useRef();
    const mdpRef = useRef();
    const mdpConfirmeRef = useRef();
    const [isConditionsGeneralOK, setIsConditionsGeneralOK] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        });
    }, []);

    const handleSubmit = (ev) => {
        ev.preventDefault();
        const payload = {
            nom: nomRef.current.value,
            prenom: prenomRef.current.value,
            pseudo: pseudoRef.current.value,
            email: emailRef.current.value,
            password: mdpRef.current.value,
            password_confirmation: mdpConfirmeRef.current.value,
            role: "user",
        };
        axiosClient
            .post("/signup", payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status == 422) {
                    console.log(response.data.errors);
                    setErrors(response.data.errors);
                }
            });
    };

    const effacerErreurs = () => {
        setErrors([]);
    };

    return (
        <div>
            <div
                className="container"
                style={{ marginTop: "50px", height: "" }}
            >
                <div className="col-sm-12 col-md-8 col-lg-6 col-xl-6 mx-auto">
                    <h1 className="text-center mb-5">Inscription</h1>
                    {errors && (
                        <div style={{ color: "red" }}>
                            {Object.keys(errors).map((key) => (
                                <div key={key}>{errors[key][0]}</div>
                            ))}
                        </div>
                    )}
                    <Container>
                        <Form onSubmit={handleSubmit}>
                            <Container>
                                <Row className="mb-3 mb-md-0 mb-lg-0 mb-xl-0 d-flex align-items-stretch">
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>Nom</Form.Label>
                                            <Form.Control
                                                ref={nomRef}
                                                className={`${
                                                    errors?.nom
                                                        ? "border-danger"
                                                        : ""
                                                }`}
                                                type="text"
                                                placeholder="Entrer votre nom"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group>
                                            <Form.Label>Prénom</Form.Label>
                                            <Form.Control
                                                ref={prenomRef}
                                                className={`${
                                                    errors?.prenom
                                                        ? "border-danger"
                                                        : ""
                                                }`}
                                                type="text"
                                                placeholder="Entrer votre prénom"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3 mb-md-0 mb-lg-0 mb-xl-0 d-flex align-items-stretch">
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>Pseudo</Form.Label>
                                            <Form.Control
                                                ref={pseudoRef}
                                                className={`${
                                                    errors?.pseudo
                                                        ? "border-danger"
                                                        : ""
                                                }`}
                                                type="text"
                                                placeholder="Entrer votre pseudonyme"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                ref={emailRef}
                                                className={`${
                                                    errors?.email
                                                        ? "border-danger"
                                                        : ""
                                                }`}
                                                type="email"
                                                placeholder="Entrer votre adresse email"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-3 mb-md-0 mb-lg-0 mb-xl-0 d-flex align-items-stretch">
                                    <Col xs={12} md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>
                                                Mot de passe
                                            </Form.Label>
                                            <Form.Control
                                                ref={mdpRef}
                                                className={`${
                                                    errors?.password
                                                        ? "border-danger"
                                                        : ""
                                                }`}
                                                type="password"
                                                placeholder="Entrer votre mot de passe"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group>
                                            <Form.Label>
                                                Confirmation mot de passe
                                            </Form.Label>
                                            <Form.Control
                                                ref={mdpConfirmeRef}
                                                className={`${
                                                    errors?.password_confirmation
                                                        ? "border-danger"
                                                        : ""
                                                }`}
                                                type="password"
                                                placeholder="Entrer à nouveau votre mot de passe"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formGridCheckbox"
                                >
                                    <Form.Check
                                        type="checkbox"
                                        label="En cochant cette case, vous acceptez les conditions générales d'utilisation de la plateforme Gampy"
                                        onChange={(e) =>
                                            setIsConditionsGeneralOK(
                                                e.target.checked
                                            )
                                        }
                                    />
                                </Form.Group>
                                <div className="text-center">
                                    <Button
                                        // variant="primary"
                                        style={{
                                            backgroundColor: "#25632d",
                                            color: "white",
                                            outline: "none",
                                            border: "none",
                                        }}
                                        className="me-3"
                                        onClick={effacerErreurs}
                                    >
                                        Effacer
                                    </Button>
                                    <Button
                                        // variant="primary"
                                        style={{
                                            backgroundColor: "#25632d",
                                            color: "white",
                                            outline: "none",
                                            border: "none",
                                        }}
                                        type="submit"
                                        disabled={!isConditionsGeneralOK}
                                    >
                                        S'inscrire
                                    </Button>
                                </div>
                                <div className="text-left mt-3">
                                    <p>
                                        Déjà Inscrit ?{" "}
                                        <Link to={"/login"}>
                                            Cliquez ici pour vous connecter.
                                        </Link>
                                    </p>
                                </div>
                            </Container>
                        </Form>
                    </Container>
                </div>
            </div>
        </div>
    );
}
