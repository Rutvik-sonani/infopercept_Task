import { useEffect } from "react";
import { useWorkoutContext } from "../hooks/useWorkoutContext";

//components
import WorkoutComponent from '../components/workouts'; 
import WorkoutForm from '../components/workoutForm';

const Home = () => {
    const { workouts, dispatch } = useWorkoutContext();

    // fired this function when this Home component is rendered
    useEffect(() => {
        const fetchWorkout = async () => {
            const response = await fetch('/API/TODO/'); 
            const json = await response.json();
            if (response.ok) {
                dispatch({ type: 'SET_WORKOUTS', payload: json });
            }
        };

        fetchWorkout();
    }, [dispatch]); 

    return (
        <div className="home">
            <div className="workouts">
                {workouts && workouts.map((workout) => (
                    <WorkoutComponent key={workout._id} workout={workout} />
                ))}
            </div>
            <WorkoutForm />
        </div>
    );
}

export default Home;
