import { useState } from "react"
import { useEffect, type ChangeEvent, type Dispatch, type SubmitEvent } from "react"
import { v4 as uuidv4 } from "uuid"

import type { Activity } from "../types"
import { categories } from "../data/categories"
import type { ActivityActions, ActivityState } from "../reducers/activity-reducer"
import { useActivity } from "../hooks/useActivity"

const initialState : Activity = { // State principal del formulario
    id: uuidv4(),
    category: 1,
    name: '',
    calories: 0
}

export default function Form() {

    const {state, dispatch} = useActivity()

    const [activity, setActivity] = useState<Activity>(initialState)

    useEffect(() => {
        if(state.activeId) {
            const selectedActivity = state.activities.filter( stateActivity => stateActivity.id === state.activeId)[0]

            setActivity(selectedActivity)
        }
    }, [state.activeId])

    const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => { // Funcion usada detectar cambios (con onChange) y actualizar el estado
        const inNumberField = ['category', 'calories'].includes(e.target.id)

        setActivity({...activity, [e.target.id]: inNumberField ? +e.target.value : e.target.value})
    }

    const isValidActivity = () => { // Cuando se rellenan los campos necesarios el boton de submit se podra usar
        const {name, calories} = activity
        return name.trim() !== '' && calories > 0
    }

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        dispatch({type: 'save-activity', payload: {newActivity: activity}})

        setActivity({
            ...initialState, id: uuidv4()
        })

        console.log(state)
    }

    return (
        <form className="space-y-5 bg-white shadow p-10 rounded-lg" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="category" className="font-bold">Categoría:</label>
                <select 
                    id="category" 
                    value={activity.category} 
                    onChange={handleChange}
                    className="border border-slate-300 p-2 rounded-lg w-full bg-white"
                >
                    {categories.map(category => (
                    <option key={category.id} value={category.id}>
                    {category.name}
                    </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="name" className="font-bold">Actividad:</label>
                <input 
                    id="name"
                    type="text"
                    className="border border-slate-300 p-2 rounded-lg"
                    placeholder="Ej. Comida, Zumo de Naranja, Ensalada, Bicicleta"
                    value={activity.name}
                    onChange={handleChange}
                />
            </div>

            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="calories" className="font-bold">Calorias:</label>
                <input 
                    id="calories"
                    type="number"
                    className="border border-slate-300 p-2 rounded-lg"
                    placeholder="Calorias, ej. 400, 600"
                    value={activity.calories}
                    onChange={handleChange}
                />
            </div>

            <input 
                type="submit" 
                className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}
                disabled={!isValidActivity()}
            />
        </form>
    )
}
