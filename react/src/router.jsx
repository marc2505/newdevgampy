import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "./views/Login";
import Signup from "./views/Signup";
import Users from "./views/Users";
import NotFound from "./views/NotFound";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Dashboard from "./views/Dashboard";
import Home from "./views/Home";
import AdminLayout from "./components/AdminLayout";
import LoginAdmin from "./components/admin/LoginAdmin";
import HomeAdmin from "./components/admin/HomeAdmin";
import DevenirHote from "./views/DevenirHote";
import Faq from "./views/Faq";
import Contact from "./views/Contact";
import UserForm from "./components/admin/UserFormUpdate";
import Annonce from "./views/Annonce";
import Profile from "./views/Profile";
import Terrains from "./views/Terrains";
import Terrain from "./views/Terrain";
import GestionAnnonces from "./views/GestionAnnonces";
import Success from "./views/Success";
import Cancel from "./views/Cancel";
import AnnonceNew from "./views/AnnonceNew";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/home",
        element: <Home />,
    },
    {
        path: "/admin",
        element: <LoginAdmin />,
    },
    {
        path: "/admin/login",
        element: <LoginAdmin />,
    },
    {
        path: "/devenirHote",
        element: <DevenirHote />,
    },
    {
        path: "/terrains",
        element: <Terrains />,
    },
    {
        path: "/terrain/:id/:from?",
        element: <Terrain />,
    },
    {
        path: "/faq",
        element: <Faq />,
    },
    {
        path: "/contact",
        element: <Contact />,
    },
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
            {
                path: "/success",
                element: <Success />,
            },
            {
                path: "/cancel",
                element: <Cancel />,
            },
            {
                path: "/users",
                element: <Users />,
            },
            {
                path: "/annonce/:from?",
                element: <Annonce />,
            },
            {
                path: "/annonceNew/:from?",
                element: <AnnonceNew />,
            },
            {
                path: "/annonce/:terrainId/:from?",
                element: <Annonce />,
            },
            {
                path: "/annonceNew/:terrainId/:from?",
                element: <AnnonceNew />,
            },
            {
                path: "/gestionAnnonce/:idUser",
                element: <GestionAnnonces />,
            },
            {
                path: "/profile",
                element: <Profile />,
            },
        ],
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login/:from?",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
        ],
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                path: "/admin",
                element: <Navigate to={"/admin/home"} />,
            },
            {
                path: "/admin/home",
                element: <HomeAdmin />,
            },
            {
                path: "/admin/users/new",
                element: <UserForm key={"userCreate"} />,
            },
            {
                path: "/admin/users/:id",
                element: <UserForm key={"userUpdate"} />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
