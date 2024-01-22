import { Link, useNavigate } from "react-router-dom"

export default function Users() {
    const navigate = useNavigate()
    return (
      <div>
        <h1>Users</h1>
        <Link to='#' onClick={()=>{
          navigate(-1)
        }}>Retour au dashboard ...</Link>
      </div>
    )
  }