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

// Endpoint to fetch recipes based on user-provided ingredients
app.post('/recipe/search', async (req, res) => {
    const { ingredients } = req.body;
  
    try {
      if (!ingredients || ingredients.length === 0) {
        return res.status(400).json({ error: 'Please provide a list of ingredients.' });
      }
  
      // Query the database for recipes with matching ingredients
      const recipes = await prisma.recipe.findMany({
        where: {
          ingredients: {
            some: {
              name: { in: ingredients } // Checks if any ingredient matches
            }
          }
        },
        include: {
          ingredients: true // Include ingredients data in the response
        }
      });
  
      res.json(recipes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching recipes.' });
    }
  });
  
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
