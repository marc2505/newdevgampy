import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import axiosClient from '../../axios-client'
import { Link } from 'react-router-dom'
import UserFormUpdate from './UserFormUpdate'
import UserFormCreate from './UserFormCreate'
import { useStateContext } from '../../contexts/ContextProvider'
import { StyleSheetManager } from 'styled-components';

const isPropValid = (prop) => prop !== 'striped' && prop !== 'fixedHeader' && prop !== 'fixedHeaderScrollHeight' && prop !== 'isRTL' && prop !== 'pointerOnHover' && prop !== 'extendedRowStyle' && prop !== 'highlightOnHover' && prop !== 'renderAsCell' && prop !== 'noPadding' && prop !== 'minWidth' && prop !== 'isDragging' && prop !== 'headCell' && prop !== 'sortDirection' && prop !== 'sortActive';

export default function DataTableUsers() {
    const {setNotification} = useStateContext()
    const [records, setRecords] = useState([])
    const [filterRecords, setFilterRecords] = useState([])
    const [isShown, setIsShown] = useState(false)
    const [idSelected, setIdSelected] = useState(null)
    const [key, setKey] = useState('liste')
    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClicked = (row) => {
        // console.log('ROW =')
        // console.log(row)
        if (row.id !== selectedRow) {
            setSelectedRow(row.id)    
        } else {
            setSelectedRow(null)
        }
    }

    const onDelete = (id) => {
        if (!window.confirm("Voulez-vous bien supprimer l'utilisateur avec l'id # "+id+" ?")) {
            return
        }
        axiosClient.delete(`/users/${id}`)
        .then(()=>{
            setNotification('L\'utilisateur n°'+id+' a bien été supprimé !')
            fetchData()
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const onEdit = (id) => {
        // alert('Modifier l\'utilisateur n°'+id)
        setIdSelected(id)
        setIsShown(current=>!current)
        setKey('edit')
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
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            minWidth: '200px'
        },
        {
            name: 'Pseudo',
            selector: row => row.pseudo,
            sortable: true
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
            minWidth: '250px'
        },
        {
            name: 'Created_at',
            selector: row => row.created_at,
            sortable: true
        },
        {
            name: 'Role',
            selector: row => row.role,
            sortable: true,
            width: '100px'
        },
        {
            name: 'Actions',
            cell: (row) => (
            <>
            {/* <Link to={'/admin/users/'+row.id} className='mx-2'>Editer</Link> */}
            <a className='btn mx-2' style={{ background:'#25632d',color:'white' }} href='#' onClick={()=>onEdit(row.id)}>Editer</a>
            <a className='btn btn-danger' href='#' onClick={()=>onDelete(row.id)}>Supprimer</a>
            </>
            ),
            width: '220px',
            minWidth: '220px'
        },
    ]

    const handleFilter = (ev) => {
        const newData = filterRecords.filter(row => (
            row.name.toLowerCase().includes(ev.target.value.toLowerCase()) ||
            row.pseudo.toLowerCase().includes(ev.target.value.toLowerCase()) ||
            row.email.toLowerCase().includes(ev.target.value.toLowerCase()) ||
            row.role.toLowerCase().includes(ev.target.value.toLowerCase()) 
        ))
        setRecords(newData)
    }

    useEffect(()=>{
        fetchData()
    }, [])

    const fetchData = async () => {
        axiosClient.get('/users')
        .then(({data})=>{
            setRecords(data.data)
            setFilterRecords(data.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const ExpandedComponent = ({data}) => {
        return (
            <div className="container-fluid text-center">
                <h3>
                    {data.id}. {data.name} {'=>'} {data.role}
                </h3>
                <div className="row">
                    <div className="col-md-4">
                        <h5>
                            Email = {data.email}
                        </h5>
                    </div>
                    <div className="col-md-4">
                        <h5>
                            Pseudo = {data.pseudo}
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

    const handleClick = (ev) => {
        ev.preventDefault()
        // setIsShown((current)=>{return !current})
        setIsShown(current=>!current)
        setKey('add')
    }

    return (
        <StyleSheetManager shouldForwardProp={isPropValid}>
        <div>
                {/* !isShown ? */}
                {/* <div style={{ background:'gray' }}> */}
                    {/* <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        {
                            !isShown ?
                            <h3>Liste des utilisateurs</h3>
                            :
                            <h3>Modifier un utilisateur</h3>
                        }
                        
                        <h3>{key}</h3>
                        

                        <Link to={'#'} onClick={handleClick}>
                        {
                            !isShown ?
                            'Ajouter'
                            :
                            'Retour'
                        }
                        </Link>
                    </div> */}
                    {key == 'liste' ?
                    <div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <h3>Liste des utilisateurs</h3>
                        <Link className='btn mt-2' style={{ background:'#25632d',color:'white' }} to={'#'} onClick={handleClick}>Ajouter</Link>
                    </div>
                    
                    <div style={{ display:'flex', justifyContent:'right' }}>
                        <input 
                            type="text" 
                            className='form-control my-2'
                            placeholder='Search a name, a pseudo, an email or a role ...' 
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
                        // striped={'false'}
                    >
                    </DataTable>
                    </div>
                    :
                    key == 'edit' ?
                    <UserFormUpdate id={idSelected} />
                    :
                    <UserFormCreate />
                    }
                {/* </div> */}
            </div>
            </StyleSheetManager>
    )
}