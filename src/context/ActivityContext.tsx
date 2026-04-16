import { createContext, useReducer, type ReactNode, type ActionDispatch, useMemo } from "react";
import { activityReducer, initialState, type ActivityActions, type ActivityState } from "../reducers/activity-reducer";
import { categories } from "../data/categories";
import type { Activity } from "../types";

type ActivityProviderProps = {
    children: ReactNode
}

type ActivityContextProps = {
    state: ActivityState
    dispatch: ActionDispatch<[action: ActivityActions]>
    caloriesConsumed: number
    caloriesBurned: number
    totalCalories: number
    categoryName: (category: number) => string[]
    isEmptyActivities: boolean
}

export const ActivityContext = createContext<ActivityContextProps>(null!)

export const ActivityProvider = ({children} : ActivityProviderProps) => {

    const [state, dispatch] = useReducer(activityReducer, initialState)

    //Contadores
    const caloriesConsumed = useMemo(() => state.activities.reduce((total, activity) => activity.category === 1 ? total + activity.calories : total, 0), [state.activities])
    const caloriesBurned = useMemo(() => state.activities.reduce((total, activity) => activity.category === 2 ? total + activity.calories : total, 0), [state.activities])
    const totalCalories = useMemo(() => caloriesConsumed - caloriesBurned, [state.activities])

    const categoryName = useMemo(() => (category: Activity['category']) => categories.map(cat => cat.id === category ? cat.name : ''), [state.activities])
    const isEmptyActivities = useMemo(() => state.activities.length === 0, [state.activities])

    return (
        <ActivityContext.Provider value={{
            state,
            dispatch,
            caloriesConsumed,
            caloriesBurned,
            totalCalories,
            categoryName,
            isEmptyActivities
        }}>

            {children}
        </ActivityContext.Provider>
    )
}