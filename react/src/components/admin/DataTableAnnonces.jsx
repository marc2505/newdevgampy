import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import axiosClient from '../../axios-client'
import { Link, Navigate } from 'react-router-dom'
import { useStateContext } from '../../contexts/ContextProvider'
import { StyleSheetManager } from 'styled-components'

const isPropValid = (prop) => prop !== 'striped' && prop !== 'fixedHeader' && prop !== 'fixedHeaderScrollHeight' && prop !== 'isRTL' && prop !== 'pointerOnHover' && prop !== 'extendedRowStyle' && prop !== 'highlightOnHover' && prop !== 'renderAsCell' && prop !== 'noPadding' && prop !== 'minWidth' && prop !== 'isDragging' && prop !== 'headCell' && prop !== 'sortDirection' && prop !== 'sortActive'

export default function DataTableAnnonces() {
    const {setNotification} = useStateContext()
    const [records, setRecords] = useState([])
    const [filterRecords, setFilterRecords] = useState([])
    const [isShown, setIsShown] = useState(false)
    const [idSelected, setIdSelected] = useState(null)
    const [key, setKey] = useState('liste')
    const [selectedRow, setSelectedRow] = useState(null)

    const handleRowClicked = (row) => {
        if (row.id !== selectedRow) {
            setSelectedRow(row.id)    
        } else {
            setSelectedRow(null)
        }
    }

    const onDelete = (id) => {
        if (!window.confirm("Voulez-vous bien supprimer l'annonce avec l'id # "+id+" ?")) {
            return
        }
        alert('implémenter la suppression')
        // axiosClient.delete(`/admin/terrain/${id}`)
        // .then(()=>{
        //     setNotification('L\'annonce n°'+id+' a bien été supprimée !')
        //     fetchData()
        //     window.scrollTo(0,0)
        // })
        // .catch((err)=>{
        //     console.log(err)
        // })
    }

    const onEdit = (id) => {
        setIdSelected(id)
        setIsShown(current=>!current)
        setKey('edit')
        window.scrollTo(0,0)
    }

    const customStyles = {
        headRow: {
            style: {
                background: '#25632d',
                color: 'white',
            },
        },
        headCells: {
            style: {
                fontSize: '16px',
                fontWeight: '600',
                textTransform: 'uppercase',
            },
        },
        cells: {
            style: {
                fontSize: '15px',
            },
        },
    }

    const columns = [
        {
            name: '#',
            width: '60px',
            selector: row => row.id,
            sortable: true
        },
        {
            name: 'Nom',
            selector: row => row.nom,
            sortable: true
        },
        {
            name: 'Surface',
            selector: row => row.surface,
            sortable: true
        },
        {
            name: 'Capacité',
            selector: row => row.capacite_visiteurs,
            sortable: true
        },
        {
            name: 'Created_at',
            selector: row => row.created_at,
            sortable: true,
            width: '200px'
        },
        {
            name: 'Actions',
            cell: (row) => (
            <>
            {/* <Link to={'/admin/users/'+row.id} className='mx-2'>Editer</Link> */}
                <a 
                    className='btn mx-2' 
                    style={{ background:'#25632d',color:'white' }} 
                    href='#' 
                    onClick={()=>onEdit(row.id)}
                >
                    Editer
                </a>
                <a 
                    className='btn btn-danger' 
                    href='#' 
                    onClick={()=>onDelete(row.id)}
                >
                    Supprimer
                </a>
            </>
            ),
            width: '220px',
            minWidth: '220px'
        },
    ]

    const handleFilter = (ev) => {
        const newData = filterRecords.filter(row => row.nom.toLowerCase().includes(ev.target.value.toLowerCase()))
        setRecords(newData)
    }

    useEffect(()=>{
        fetchData()
    }, [])

    const fetchData = async () => {
        axiosClient.get('/admin/terrains')
        .then(({data})=>{
            setRecords(data.data)
            setFilterRecords(data.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const handleClick = (ev) => {
        ev.preventDefault()
        setIsShown(current=>!current)
        setKey('add')
        window.scrollTo(0,0)
    }

    const ExpandedComponent = ({data}) => {
        return (
            <div className="container-fluid text-center">
                <h3>
                    Titre terrain
                    {/* {data.id}. {data.name} {'=>'} {data.role} */}
                </h3>
                <div className="row">
                    <div className="col-md-4">
                        <h5>
                            Surface = {data.surface}
                        </h5>
                    </div>
                    <div className="col-md-4">
                        <h5>
                            Capacité de visiteurs = {data.capacite_visiteurs}
                        </h5>
                    </div>
                    <div className="col-md-4">
                        <h5>
                            Créé le = {data.created_at}
                        </h5>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <StyleSheetManager shouldForwardProp={isPropValid}>
                <div>
                    {key == 'liste' ?
                        <div>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                <h3>Liste des annonces</h3>
                                <Link className='btn mt-2' style={{ background:'#25632d',color:'white' }} to={'#'} onClick={handleClick}>Ajouter</Link>
                            </div>
                            <div style={{ display:'flex', justifyContent:'right' }}>
                                <input 
                                    type="text" 
                                    className='form-control my-2'
                                    placeholder='Chercher un nom' 
                                    style={{ padding:'6px 10px', width:'', background:'white' }}
                                    onChange={handleFilter}
                                />
                            </div>
                            <DataTable
                                columns={columns}
                                data={records}
                                customStyles={customStyles}
                                pagination
                                expandableRows
                                expandOnRowClicked
                                expandableRowsComponent={ExpandedComponent}
                                responsive={'true'}
                                dense={'false'}
                                striped={'false'}
                            >
                            </DataTable>
                        </div>
                        :
                        key == 'edit' ?
                        <Navigate to={'/annonce/'+idSelected+'/admin'} />
                        :
                        <Navigate to={'/annonce/admin'} />
                    }
                </div>
            </StyleSheetManager>
        </div>
    )
}
