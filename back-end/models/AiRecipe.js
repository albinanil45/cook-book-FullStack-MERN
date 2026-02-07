const mongoose = require('mongoose');

const aiRecipeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        ingredients: [
            {
                name: String,
                quantity: String,
            },
        ],

        steps: [
            {
                stepNumber: Number,
                instruction: String,
            },
        ],

        cookingTime: Number,

        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
        },

        category: {
            type: String,
            enum: [
                'breakfast',
                'lunch',
                'dinner',
                'snack',
                'dessert',
                'beverage',
            ],
        },

        cuisine: {
            type: String,
            enum: [
                'indian',
                'italian',
                'chinese',
                'mexican',
                'american',
                'thai',
                'other',
            ],
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        source: {
            type: String,
            default: 'ai',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('AiRecipe', aiRecipeSchema);
