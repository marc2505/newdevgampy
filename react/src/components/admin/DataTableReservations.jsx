import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import DataTable from 'react-data-table-component';
import { StyleSheetManager } from 'styled-components';
import axiosClient from '../../axios-client';

const isPropValid = (prop) => prop !== 'striped' && prop !== 'fixedHeader' && prop !== 'fixedHeaderScrollHeight' && prop !== 'isRTL' && prop !== 'pointerOnHover' && prop !== 'extendedRowStyle' && prop !== 'highlightOnHover' && prop !== 'renderAsCell' && prop !== 'noPadding' && prop !== 'minWidth' && prop !== 'isDragging' && prop !== 'headCell' && prop !== 'sortDirection' && prop !== 'sortActive';

export default function DataTableReservations() {
    const {setNotification} = useStateContext()
    const [records, setRecords] = useState([])
    const [filterRecords, setFilterRecords] = useState([])
    const [isShown, setIsShown] = useState(false)
    const [idSelected, setIdSelected] = useState(null)
    const [key, setKey] = useState('liste')
    const [selectedRow, setSelectedRow] = useState(null)

    const handleFilter = (ev) => {
        const newData = filterRecords.filter(row => {
            if (ev.target.value.toLowerCase() == 'paid') {
                return row.statut.toLowerCase() == ev.target.value.toLowerCase()
            } else {
                return row.statut.toLowerCase().includes(ev.target.value.toLowerCase())
            }
        })
        setRecords(newData)
    }

    useEffect(()=>{
        fetchData()
    }, [])

    const onEdit = (id) => {
        setIdSelected(id)
        setIsShown(current=>!current)
        setKey('edit')
        window.scrollTo(0,0)
    }

    const onDelete = (id) => {
        if (!window.confirm("Voulez-vous bien supprimer la réservation avec l'id # "+id+" ?")) {
            return
        }

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
            name: 'Terrain #',
            selector: row => row.terrain_id,
            sortable: true,
            width: '120px'
        },
        {
            name: 'Prix',
            selector: row => row.prix + ' CHF',
            sortable: true,
            width: '150px'
        },
        {
            name: 'Début',
            selector: row => row.date_debut,
            sortable: true
        },
        {
            name: 'Fin',
            selector: row => row.date_fin,
            sortable: true,
            width: '120px'
        },
        {
            name: 'Statut',
            selector: row => row.statut,
            sortable: true,
            width: '120px'
        },
        // {
        //     name: 'Image',
        //     // selector: row => row.images,
        //     cell: (row) => (
        //     <>
        //     {/* <Link to={'/admin/users/'+row.id} className='mx-2'>Editer</Link> */}
        //     <div>
        //         <img 
        //             src={`http://localhost:8000/${row.images.split('|')[0]}`} 
        //             // className='img-fluid' 
        //             width={'250px'}
        //             height={'150px'}
        //         />
        //     </div>
        //     </>
        //     ),
        //     width: '550px',
        //     minWidth: '450px',
        // },
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

    const fetchData = async () => {
        axiosClient.get('/admin/reservations')
        .then(({data})=>{
            // console.log(data)
            // return
            setRecords(data)
            setFilterRecords(data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const ExpandedComponent = ({data}) => {
        return (
            <div>
                Row de la réservation ...
            </div>
        )
    }

    const handleClick = (ev) => {
        ev.preventDefault()
        // setIsShown((current)=>{return !current})
        setIsShown(current=>!current)
        setKey('add')
        window.scrollTo(0,0)
    }

    return (
        <StyleSheetManager shouldForwardProp={isPropValid}>
            <div>
                {
                    key == 'liste' ?
                        <div>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                <h3>Liste des réservations</h3>
                                <Link className='btn mt-2' style={{ background:'#25632d',color:'white' }} to={'#'} onClick={handleClick}>Ajouter</Link>
                            </div>
                            <div style={{ display:'flex', justifyContent:'right' }}>
                                <input 
                                    type="text" 
                                    className='form-control my-2'
                                    placeholder='Chercher un statut' 
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
                    <div>
                        <h1>Modification de la réservation n°{idSelected}</h1>
                        <div className="text-center">
                            <Link
                                to={'#'}
                                className='btn'
                                onClick={() => {
                                    setKey('liste')
                                }}
                                style={{ background:'#25632d',color:'white' }}
                            >
                                Retour
                            </Link>
                        </div>
                    </div>
                    :
                    <h1>Création d'une réservation</h1>
                }
            </div>
        </StyleSheetManager>
    )
}
