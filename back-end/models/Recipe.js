const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema(
    {
        stepNumber: {
            type: Number,
            required: true,
        },
        instruction: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false }
);

const recipeSchema = new mongoose.Schema(
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
                name: {
                    type: String,
                    required: true,
                    trim: true,
                },
                quantity: {
                    type: String,
                    required: true,
                    trim: true,
                },
            },
        ],

        steps: {
            type: [stepSchema],
            required: true,
        },

        image: {
            type: String, // Cloudinary / S3 URL
        },

        cookingTime: {
            type: Number, // minutes
            required: true,
        },

        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'easy',
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
            required: true,
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
            required: true,
        },

        reviews: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                rating: {
                    type: Number,
                    min: 1,
                    max: 5,
                    required: true,
                },
                comment: {
                    type: String,
                    trim: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],


        averageRating: {
            type: Number,
            default: 0,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Automatically calculate average rating
 */
recipeSchema.methods.calculateAverageRating = function () {
    if (this.reviews.length === 0) {
        this.averageRating = 0;
    } else {
        const total = this.reviews.reduce(
            (sum, r) => sum + r.rating,
            0
        );
        this.averageRating = total / this.reviews.length;
    }
};


const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
