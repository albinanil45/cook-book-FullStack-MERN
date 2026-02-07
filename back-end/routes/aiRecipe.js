const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect } = require('../middleware/authMiddleware');
const AiRecipe = require('../models/AiRecipe');

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @route   POST /api/ai/recipe
 * @desc    Generate AI recipe from ingredients
 * @access  Private
 */
router.post('/recipe', protect, async (req, res) => {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({
            message: 'Ingredients array is required',
        });
    }

    const prompt = `
You are a professional chef AI.

Generate exactly ONE recipe using ONLY the ingredients provided below.
You may add basic items like salt, pepper, oil, or water if necessary.

IMPORTANT RULES:
- Output ONLY valid JSON
- DO NOT include markdown
- DO NOT include explanations
- DO NOT include extra text
- Follow the schema EXACTLY

INGREDIENTS USER HAS:
${ingredients.join(', ')}

REQUIRED JSON SCHEMA:
{
  "title": "string",
  "description": "string",
  "ingredients": [
    {
      "name": "string",
      "quantity": "string"
    }
  ],
  "steps": [
    {
      "stepNumber": number,
      "instruction": "string"
    }
  ],
  "cookingTime": number,
  "difficulty": "easy | medium | hard",
  "category": "breakfast | lunch | dinner | snack | dessert | beverage",
  "cuisine": "indian | italian | chinese | mexican | american | thai | other"
}
`;

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-3-flash-preview',
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        let recipeJSON;

        try {
            recipeJSON = JSON.parse(text);
        } catch (err) {
            return res.status(500).json({
                message: 'AI returned invalid JSON',
                raw: text,
            });
        }

        // Basic validation (extra safety)
        if (
            !recipeJSON.title ||
            !recipeJSON.ingredients ||
            !recipeJSON.steps
        ) {
            return res.status(500).json({
                message: 'AI response missing required fields',
                recipeJSON,
            });
        }

        res.json(recipeJSON);
    } catch (error) {
        console.error('AI Recipe Error:', error);
        res.status(500).json({
            message: 'Failed to generate recipe',
        });
    }
});

/**
 * @route   POST /api/ai/recipe/save
 * @desc    Save generated AI recipe
 * @access  Private
 */
router.post('/recipe/save', protect, async (req, res) => {
    try {
        const recipeData = req.body;

        if (!recipeData.title || !recipeData.ingredients || !recipeData.steps) {
            return res.status(400).json({
                message: 'Invalid recipe data',
            });
        }

        const savedRecipe = await AiRecipe.create({
            ...recipeData,
            createdBy: req.user._id,
        });

        res.status(201).json(savedRecipe);
    } catch (error) {
        console.error('Save AI Recipe Error:', error);
        res.status(500).json({
            message: 'Failed to save AI recipe',
        });
    }
});

/**
 * @route   GET /api/ai/recipes
 * @desc    Get all AI-generated recipes of logged-in user
 * @access  Private
 */
router.get('/recipes', protect, async (req, res) => {
    try {
        const recipes = await AiRecipe.find({
            createdBy: req.user._id,
        })
            .sort({ createdAt: -1 });

        res.json(recipes);
    } catch (error) {
        console.error('Get AI Recipes Error:', error);
        res.status(500).json({
            message: 'Failed to fetch AI recipes',
        });
    }
});

/**
 * @route   GET /api/ai/recipes/:id
 * @desc    Get single AI recipe
 * @access  Private
 */
router.get('/recipes/:id', protect, async (req, res) => {
    try {
        const recipe = await AiRecipe.findOne({
            _id: req.params.id,
            createdBy: req.user._id,
        });

        if (!recipe) {
            return res.status(404).json({
                message: 'Recipe not found',
            });
        }

        res.json(recipe);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch recipe',
        });
    }
});

/**
 * @route   DELETE /api/ai/recipe/:id
 * @desc    Delete a saved AI recipe of the logged-in user
 * @access  Private
 */
router.delete('/recipe/:id', protect, async (req, res) => {
    try {
        const recipe = await AiRecipe.findOne({
            _id: req.params.id,
            createdBy: req.user._id,
        });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        await recipe.deleteOne(); // delete the recipe

        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Delete AI Recipe Error:', error);
        res.status(500).json({ message: 'Failed to delete recipe' });
    }
});

module.exports = router;
