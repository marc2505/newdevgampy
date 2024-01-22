import Header from "../components/layout/Header";
import ImageHome from "../components/home/ImageHome";
import SearchArea from "../components/home/SearchArea";
import Circuits from "../components/home/Circuits";
import Footer from "../components/layout/Footer";
import CampsFavoris from "../components/home/CampsFavoris";
import ActivitesFavorites from "../components/home/ActivitesFavorites";
import CommentCaMarche from "../components/home/CommentCaMarche";
import BonASavoir from "../components/home/BonASavoir";
import PartenaireGampy from "../components/home/PartenairesGampy";
import InscriptionNewsletter from "../components/home/InscriptionNewsletter";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import CommentCaMarcheCode from "../components/home/CommentCaMarcheCode";

export default function Home() {

  const {user, token} = useStateContext()
  const userLocal = JSON.parse(localStorage.getItem('USER'))
  const [loading, setLoading] = useState(true)
  const [terrains, setTerrains] = useState([])

  useEffect(()=>{
    window.scrollTo(0,0)
    setLoading(true)
    axiosClient.get('/terrains')
    .then(({data}) => {
        setLoading(false)
        setTerrains(data.data)
    })
    .catch((err) => {
        setLoading(false)
        console.log(err)
    })
  },[])

  return (
    <div>
      <div className="container mx-auto">
        {
          user && Object.keys(user).length > 0
          ?
          <Header user={user} />
          :
          <Header user={null} />
        }
      </div>
      <ImageHome />
      <SearchArea />
      <Circuits />
      {!loading && <div className="container-fluid my-3" style={{ paddingTop:'95px', paddingBottom:'95px' }}>
        <CampsFavoris terrains={terrains} />
      </div>}
      <ActivitesFavorites />
      {/* <CommentCaMarche /> */}
      <CommentCaMarcheCode />
      <BonASavoir />
      <PartenaireGampy />
      <InscriptionNewsletter />
      <div className="container">
        <Footer />
      </div>
    </div>
  )
}

