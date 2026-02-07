const express = require('express');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/recipes
 * @desc    Create a new recipe
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
    try {
        const recipe = await Recipe.create({
            ...req.body,
            createdBy: req.user._id,
        });

        res.status(201).json(recipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @route   GET /api/recipes
 * @desc    Get all recipes
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate('createdBy', 'username image')
            .sort({ createdAt: -1 });

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


/**
 * @route   GET /api/recipes/:id
 * @desc    Get single recipe
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('createdBy', 'username image')
            .populate('reviews.user', 'username image');

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


/**
 * @route   PUT /api/recipes/:id
 * @desc    Update recipe (owner only)
 * @access  Private
 */
router.put('/:id', protect, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if (recipe.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        Object.assign(recipe, req.body);
        const updatedRecipe = await recipe.save();

        res.json(updatedRecipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @route   DELETE /api/recipes/:id
 * @desc    Delete recipe (owner only)
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if (recipe.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await recipe.deleteOne();
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   POST /api/recipes/:id/rate
 * @desc    Add or update star rating
 * @access  Private
 */
router.post('/:id/rate', protect, async (req, res) => {
    const { value } = req.body;

    if (!value || value < 1 || value > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const existingRating = recipe.ratings.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (existingRating) {
            existingRating.value = value;
        } else {
            recipe.ratings.push({ user: req.user._id, value });
        }

        recipe.calculateAverageRating();
        await recipe.save();

        res.json({
            message: 'Rating submitted successfully',
            averageRating: recipe.averageRating,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
/**
 * @route   GET /api/recipes/user/:userId
 * @desc    Get recipes by user
 * @access  Public
 */
router.get('/user/:userId', async (req, res) => {
    try {
        const recipes = await Recipe.find({
            createdBy: req.params.userId,
        })
            .populate('createdBy', 'username image')
            .sort({ createdAt: -1 });

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   POST /api/recipes/:id/save
 * @desc    Save a recipe for the logged-in user
 * @access  Private
 */
router.post('/:id/save', protect, async (req, res) => {
    try {
        const user = req.user; // Already populated by `protect` middleware
        const recipeId = req.params.id;

        // Check if recipe is already saved
        if (user.savedRecipes.includes(recipeId)) {
            return res.status(400).json({ message: 'Recipe already saved' });
        }

        // Add recipe to user's savedRecipes
        user.savedRecipes.push(recipeId);
        await user.save();

        res.json({ message: 'Recipe saved successfully', savedRecipes: user.savedRecipes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   POST /api/recipes/:id/unsave
 * @desc    Remove a recipe from user's saved recipes
 * @access  Private
 */
router.post('/:id/unsave', protect, async (req, res) => {
    try {
        const user = req.user;
        const recipeId = req.params.id;

        // Remove recipe if exists
        user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeId);
        await user.save();

        res.json({ message: 'Recipe removed from saved recipes', savedRecipes: user.savedRecipes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   GET /api/recipes/saved
 * @desc    Get all saved recipes of logged-in user
 * @access  Private
 */
router.get('/saved', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('savedRecipes');
        res.json(user.savedRecipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   POST /api/recipes/:id/review
 * @desc    Add or update review (rating + comment)
 * @access  Private
 */
router.post('/:id/review', protect, async (req, res) => {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res
            .status(400)
            .json({ message: 'Rating must be between 1 and 5' });
    }

    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const existingReview = recipe.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (existingReview) {
            existingReview.rating = rating;
            existingReview.comment = comment;
        } else {
            recipe.reviews.push({
                user: req.user._id,
                rating,
                comment,
            });
        }

        recipe.calculateAverageRating();
        await recipe.save();

        res.json({
            message: 'Review submitted successfully',
            averageRating: recipe.averageRating,
            reviewsCount: recipe.reviews.length,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   GET /api/recipes/:id/reviews
 * @desc    Get all reviews of a recipe
 * @access  Public
 */
router.get('/:id/reviews', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('reviews.user', 'username image');

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(recipe.reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route   DELETE /api/recipes/:id/review
 * @desc    Delete logged-in user's review
 * @access  Private
 */
router.delete('/:id/review', protect, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        recipe.reviews = recipe.reviews.filter(
            (r) => r.user.toString() !== req.user._id.toString()
        );

        recipe.calculateAverageRating();
        await recipe.save();

        res.json({
            message: 'Review deleted successfully',
            averageRating: recipe.averageRating,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
