import React, { useEffect, useState } from 'react'

export default function AProximite(props) {
    const t = props.terrain

    // const checkboxChecked2 = []
    const [checkboxChecked2, setCheckboxChecked2] = useState([])
    let newCId = null;
    const [newCIdd, setNewCIdd] = useState(null)

    const handleCheckboxChange2 = (e) => {
        const isChecked = e.target.checked
        const cId = e.target.id
        const num = cId.split('-')[1]
        newCId = num
        setNewCIdd(num)
        if (isChecked) {
            // checkboxChecked2.push(cId)
            // console.log(checkboxChecked2)
            // console.log(newCId)
            // console.log(num)
            setCheckboxChecked2(prev => [...prev, cId])
        } else {
            // const i = checkboxChecked2.indexOf(cId)
            // if (i > -1) {
            //     checkboxChecked2.splice(i, 1)
            // }
            // console.log(newCId)
            // console.log(num)
            // console.log(checkboxChecked2)
            setCheckboxChecked2(prev => prev.filter(id => id !== cId))
        }
        // checkboxChecked2.map(c => {
        //     console.log('c = ')
        //     console.log(c)
        // })

        // console.log(checkboxChecked2.join('/'))
    }

    useEffect(()=>{
        // console.log(checkboxChecked2.join('|'))
        const newT = {...t, a_proximite: checkboxChecked2.join('|')}
        props.updateTerrain(newT)
    }, [checkboxChecked2])

    useEffect(()=>{
        if (t.id) {
            // console.log(t.a_proximite)
            setCheckboxChecked2(t.a_proximite.split('|'))
        } else {

        }
    }, [])

    return (
        <div>
            <h3>
                À proximité
            </h3>  
            <div className="row text-center">
                <div className="col-12 col-sm-6 col-md-4">
                    <ul className="list-group mb-3">
                        <li className="list-group-item firstItem">
                            <input 
                                className="form-check-input me-1" 
                                type="checkbox" 
                                // value="1" 
                                id="aproximite-1"
                                checked={checkboxChecked2.includes('aproximite-1')}
                                onChange={handleCheckboxChange2} 
                            />
                            <label 
                                className="form-check-label stretched-link" 
                                htmlFor="aproximite-1"
                            >
                                Bar
                            </label>
                        </li>
                        <li className="list-group-item lastItem">
                            <input 
                                className="form-check-input me-1" 
                                type="checkbox" 
                                // value="4" 
                                id="aproximite-2"
                                checked={checkboxChecked2.includes('aproximite-2')}
                                onChange={handleCheckboxChange2} 
                            />
                            <label 
                                className="form-check-label stretched-link" 
                                htmlFor="aproximite-2"
                            >
                                Commerce
                            </label>
                        </li>
                    </ul>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                    <ul className="list-group mb-3">
                        <li className="list-group-item firstItem">
                            <input 
                                className="form-check-input me-1" 
                                type="checkbox" 
                                // value="2" 
                                id="aproximite-3" 
                                checked={checkboxChecked2.includes('aproximite-3')}
                                onChange={handleCheckboxChange2}
                            />
                            <label 
                                className="form-check-label stretched-link" 
                                htmlFor="aproximite-3"
                            >
                                Transport en commun
                            </label>
                        </li>
                        <li className="list-group-item lastItem">
                            <input 
                                className="form-check-input me-1" 
                                type="checkbox" 
                                // value="5" 
                                id="aproximite-4" 
                                checked={checkboxChecked2.includes('aproximite-4')}
                                onChange={handleCheckboxChange2}
                            />
                            <label 
                                className="form-check-label stretched-link" 
                                htmlFor="aproximite-4"
                            >
                                Hôpital
                            </label>
                        </li>
                    </ul>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                    <ul className="list-group">
                        <li className="list-group-item firstItem">
                            <input 
                                className="form-check-input me-1" 
                                type="checkbox" 
                                // value="3" 
                                id="aproximite-5" 
                                checked={checkboxChecked2.includes('aproximite-5')}
                                onChange={handleCheckboxChange2}
                            />
                            <label 
                                className="form-check-label stretched-link" 
                                htmlFor="aproximite-5"
                            >
                                Gare
                            </label>
                        </li>
                        <li className="list-group-item lastItem">
                            <input 
                                className="form-check-input me-1" 
                                type="checkbox" 
                                // value="6" 
                                id="aproximite-6"
                                checked={checkboxChecked2.includes('aproximite-6')}
                                onChange={handleCheckboxChange2} 
                            />
                            <label 
                                className="form-check-label stretched-link" 
                                htmlFor="aproximite-6"
                            >
                                Parc
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
