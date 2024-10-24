const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');

const app = express();
const prisma = new PrismaClient();

// Middleware to parse JSON
app.use(bodyParser.json());

// POST: Create a Recipe with Ingredients
app.post('/recipe', async (req, res) => {
    const { name, instructions, ingredients } = req.body;

    try {
        const recipe = await prisma.recipe.create({
            data: {
                name,
                instructions,
                ingredients: {
                    create: ingredients.map((ingredient) => ({
                        name: ingredient.name
                    }))
                }
            },
            include: { ingredients: true }
        });
        res.json(recipe);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET: Get All Recipes with Ingredients
app.get('/recipe', async (req, res) => {
    try {
        const recipes = await prisma.recipe.findMany({
            include: {
                ingredients: true
            }
        });
        res.json(recipes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST: Create Ingredient
app.post('/ingredient', async (req, res) => {
    const { name, recipeId } = req.body;

    try {
        const ingredient = await prisma.ingredient.create({
            data: {
                name,
                recipeId
            }
        });
        res.json(ingredient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST: Create Type (for your Type model)
app.post('/type', async (req, res) => {
    const { name, age } = req.body;

    try {
        const type = await prisma.type.create({
            data: {
                name,
                age
            }
        });
        res.json(type);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET: Get All Types
app.get('/types', async (req, res) => {
    try {
        const types = await prisma.type.findMany();
        res.json(types);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});