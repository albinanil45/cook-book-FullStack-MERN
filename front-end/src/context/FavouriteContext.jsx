import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';

const FavouriteContext = createContext();

export const FavouriteProvider = ({ children }) => {
    const { user, getCurrentUser } = useUser();
    const [favourites, setFavourites] = useState([]);

    // Initialize favourites when user is loaded
    useEffect(() => {
        if (!user) getCurrentUser();
        if (user) setFavourites(user.savedRecipes || []);
    }, [user]);

    // Add recipe to favourites
    const addFavourite = async (recipeId) => {
        if (!user) throw new Error('Not authenticated');

        const token = localStorage.getItem('token');
        const res = await fetch(`https://cook-book-fullstack-mern.onrender.com/api/recipes/${recipeId}/save`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to save recipe');

        setFavourites((prev) => [...prev, recipeId]);
    };

    // Remove recipe from favourites
    const removeFavourite = async (recipeId) => {
        if (!user) throw new Error('Not authenticated');

        const token = localStorage.getItem('token');
        const res = await fetch(`https://cook-book-fullstack-mern.onrender.com/api/recipes/${recipeId}/unsave`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to unsave recipe');

        setFavourites((prev) => prev.filter((id) => id !== recipeId));
    };

    // Toggle favourite
    const toggleFavourite = async (recipeId) => {
        return favourites.includes(recipeId)
            ? removeFavourite(recipeId)
            : addFavourite(recipeId);
    };

    return (
        <FavouriteContext.Provider
            value={{ favourites, addFavourite, removeFavourite, toggleFavourite }}
        >
            {children}
        </FavouriteContext.Provider>
    );
};

// Custom hook
export const useFavourites = () => useContext(FavouriteContext);
