import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import axiosClient from '../../axios-client'
import { Link } from 'react-router-dom'
// import UserFormUpdate from './UserFormUpdate'
// import UserFormCreate from './UserFormCreate'
import { useStateContext } from '../../contexts/ContextProvider'
import { StyleSheetManager } from 'styled-components'
import EquipementFormUpdate from './EquipementFormUpdate'
import EquipementFormCreate from './EquipementFormCreate'

const isPropValid = (prop) => prop !== 'striped' && prop !== 'fixedHeader' && prop !== 'fixedHeaderScrollHeight' && prop !== 'isRTL' && prop !== 'pointerOnHover' && prop !== 'extendedRowStyle' && prop !== 'highlightOnHover' && prop !== 'renderAsCell' && prop !== 'noPadding' && prop !== 'minWidth' && prop !== 'isDragging' && prop !== 'headCell' && prop !== 'sortDirection' && prop !== 'sortActive'


export default function DataTableEquipements() {
    const {setNotification} = useStateContext()
    const [records, setRecords] = useState([])
    const [filterRecords, setFilterRecords] = useState([])
    const [isShown, setIsShown] = useState(false)
    const [idSelected, setIdSelected] = useState(null)
    const [key, setKey] = useState('liste')
    const [selectedRow, setSelectedRow] = useState(null)

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
        if (!window.confirm("Voulez-vous bien supprimer l'équipement avec l'id # "+id+" ?")) {
            return
        }
        axiosClient.delete(`/admin/equipements/${id}`)
        .then(()=>{
            setNotification('L\'équipement n°'+id+' a bien été supprimé !')
            fetchData()
            window.scrollTo(0,0)
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
            sortable: true,
            // width: '150px'
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

    const handleFilter = (ev) => {
        const newData = filterRecords.filter(row => row.nom.toLowerCase().includes(ev.target.value.toLowerCase()))
        setRecords(newData)
    }

    useEffect(()=>{
        fetchData()
        // setLoading(false)
    }, [])

    const fetchData = async () => {
        axiosClient.get('/admin/equipements')
        .then(({data})=>{
            // console.log(data)
            setRecords(data.data)
            setFilterRecords(data.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const ExpandedComponent = ({data}) => {
        let imagesTab = []
        let length = 0
        // console.log(data.images)
        if (data.images) {
            imagesTab = data.images.split('|')
            length = imagesTab.length
        }
        // console.log('LENGTH =')
        // console.log(length)
        // console.log('IMAGESTAB =')
        // console.log(imagesTab)
        return (
            <div className="container-fluid">
                {/* <h3>
                    {data.id}. {data.name} {'=>'} {data.role}
                </h3> */}
                <div className="row">
                    <h5>
                        Équipement : {data.nom}
                    </h5>
                    <div className="col-md-12 text-center">
                        {
                            imagesTab.length > 0 && imagesTab.map(img_url => {
                                return <img 
                                    src={`http://localhost:8000/${img_url}`} 
                                    width={'250px'} 
                                    height={'150px'}
                                    key={img_url}
                                />
                            })
                        }
                        {
                            imagesTab.length == 0 && <>
                            <div 
                                className='d-flex justify-content-center align-items-center'
                                style={{ height: '150px',border:'1px solid #25632d' }}
                            >
                                Pas de photo ...
                            </div>
                            </>
                        }
                    </div>
                    <h5>
                        Créé le = {data.created_at}
                    </h5>
                </div>
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
                {key == 'liste' ?
                    <div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <h3>Liste des équipements</h3>
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
                    <EquipementFormUpdate id={idSelected} />
                    :
                    <EquipementFormCreate />
                }
            </div>
        </StyleSheetManager>
    )
}
