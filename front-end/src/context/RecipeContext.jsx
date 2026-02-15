import React, { createContext, useContext, useState } from 'react';

const RecipeContext = createContext(null);

const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_URL;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

export function RecipeProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState([]);

    const uploadImageToCloudinary = async (file) => {
        if (!file) return '';

        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        data.append('folder', 'recipes');

        const res = await fetch(CLOUDINARY_UPLOAD_URL, {
            method: 'POST',
            body: data,
        });

        const result = await res.json();
        return result.secure_url;
    };

    const addRecipe = async (recipeData, imageFile) => {
        try {
            setLoading(true);

            const imageUrl = await uploadImageToCloudinary(imageFile);

            const payload = {
                ...recipeData,
                image: imageUrl,
            };

            const res = await fetch('https://cook-book-fullstack-mern.onrender.com/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error('Failed to create recipe');
            }

            const data = await res.json();
            setRecipes((prev) => [data, ...prev]); // optional: update local list
            return data;
        } finally {
            setLoading(false);
        }
    };

    // 🔹 GET ALL RECIPES
    const getRecipes = async () => {
        try {
            setLoading(true);

            const res = await fetch('https://cook-book-fullstack-mern.onrender.com/api/recipes', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!res.ok) {
                throw new Error('Failed to fetch recipes');
            }

            const data = await res.json();
            setRecipes(data);
            return data;
        } finally {
            setLoading(false);
        }
    };

    return (
        <RecipeContext.Provider
            value={{
                addRecipe,
                getRecipes,
                recipes,
                loading,
            }}
        >
            {children}
        </RecipeContext.Provider>
    );
}

export function useRecipe() {
    const context = useContext(RecipeContext);
    if (!context) {
        throw new Error('useRecipe must be used inside RecipeProvider');
    }
    return context;
}
