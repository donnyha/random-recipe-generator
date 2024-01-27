<script setup lang="ts">
  import { ref, type Ref, isProxy, toRaw } from 'vue'
  import axios, { type AxiosRequestConfig } from 'axios'
  import type Recipe from '../types/Recipe';
  import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline';

  let ingredients: Ref<string[]> = ref([])
  let isIngredientsEmpty: Ref<boolean> = ref(true)
  let newIngredientInput: Ref<string> = ref('')
  let isRecipesEmpty: Ref<boolean> = ref(true)
  let beingUsedIngredients: Ref<string> = ref('')
  let recipes: Ref<any[]> = ref([])
  let selectedRecipe: Ref<Recipe | any> = ref({})
  let selectedRecipeInstructions: Ref<object[] | any[]> = ref([])


  const addIngredient: (ingredient: string) => void = (ingredient: string) => {
    const doesIngredientAlreadyExist = checkIfIngredientAlreadyExist(ingredient);

    if (ingredient.length !== 0 && !doesIngredientAlreadyExist) {
      ingredients.value.push(ingredient)
      newIngredientInput.value = ''
      checkIfIngredientsEmpty()
    }
  }

  const checkIfIngredientAlreadyExist: (newIngredient: string) => boolean = (newIngredient: string) => {
    let doesExist: boolean = false;

    if (ingredients.value.includes(newIngredient)) {
      doesExist = true;
    }

    return doesExist
  }
  
  const removeIngredient: (ingredientIndex: number) => void = (ingredientIndex: number) => {
    ingredients.value.splice(ingredientIndex, 1)
    checkIfIngredientsEmpty()
  }

  const checkIfIngredientsEmpty: () => void = () => {
    ingredients.value.length > 0 ? isIngredientsEmpty.value = false : isIngredientsEmpty.value = true
  }

  const checkIfRecipesEmpty: () => void = () => {
    recipes.value.length > 0 ? isRecipesEmpty.value = false : isRecipesEmpty.value = true
  }

  const generateRecipes: () => void = async () => {
    recipes.value = await getRecipesBasedOnIngredients(ingredients.value)
    checkIfRecipesEmpty()
  }

  // @TODO refactor to different component
  const getRecipesBasedOnIngredients: (ingredientsToSend: string[]) => Promise<object[] | any[]> = async (ingredientsToSend: string[]) => {
    let recipes: any[] = []
    const rawIngredients: any = checkForProxyAndReturnRaw(ingredientsToSend);
    const url: string = 'https://api.spoonacular.com/recipes/findByIngredients'

    await axios.get(url, {
      params: {
        apiKey: 'c9f2fb75c57145fd9ad43da15f293379',
        ingredients: rawIngredients.join(',')
      }
    })
    .then((response: AxiosRequestConfig) => {
      recipes = response.data
    })
    .catch((error: Error) => {
      console.log(error)
    })
    .finally(() => {
      beingUsedIngredients.value = rawIngredients.join(',') 
      resetSelectedRecipe()
    })

    return recipes
  }

  // @TODO refactor to different component
  const getRecipeInstructionsWithRecipeId: (selectedRecipeId: number) => Promise<object[] | any[]> = async (selectedRecipeId: number) => {
    const url: string = `https://api.spoonacular.com/recipes/${selectedRecipeId}/analyzedInstructions`
    let instructions: string[] = []
    
    await axios.get(url, {
      params: {
        apiKey: 'c9f2fb75c57145fd9ad43da15f293379'
      }
    })
    .then((response: AxiosRequestConfig) => {
      console.log(response.data)
      instructions = response.data[0].steps
    })
    .catch((error: Error) => {
      console.log(error)
    })

    return instructions
  }

  const resetSelectedRecipe: () => void = () => {
    selectedRecipe.value = {}
    selectedRecipeInstructions.value = []
  }

  const checkForProxyAndReturnRaw:(itemToCheck: any) => any = (itemToCheck: any) => {
    let raw = itemToCheck

    if (isProxy(itemToCheck)) {
      raw = toRaw(itemToCheck)  
    }

    return raw
  }

  const showRecipeInformation: (recipe: Recipe) => void = async (recipe: Recipe) => {
    const selectedRecipeId = recipe.id
    selectedRecipe.value = recipe
    selectedRecipeInstructions.value = await getRecipeInstructionsWithRecipeId(selectedRecipeId)
  }
</script>

<template>
  <form>
    <div class="space-y-12">
      <div class="flex flex-col">

        <div id="page-title" class="flex items-center justify-center h-full">
          <h1 class="text-xl font-bold tracking-tight text-gray-900 sm:text-5xl">Meal</h1>
        </div>

        <!-- Ingredients -->
        <div id="ingredients-section" class="flex items-center justify-center h-full m-10">
          <div class="flex flex-row sm:col-span-4 mt-2 parent">

            <!-- Ingredients List -->
            <div id="ingredients-list-section child">
              <label for="user-ingredients" class="block text-sm font-medium leading-6 text-gray-900">Ingredients</label>
              <div v-if="!isIngredientsEmpty" class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <ul>
                  <li v-for="(ingredient, index) in ingredients" :key="index" >
                    <input type="text" name="ingredient-{{ index }}" :value="ingredient" readonly />
                    <button type="button" id="delete-btn-{{ index }}" @click="removeIngredient(index)">-</button>
                  </li>
                </ul>
              </div>
              <div v-else>No Ingredients</div>
            </div>
            
            <!-- New Ingredient Input -->
            <div id="new-ingredients-section" class="flex flex-row">
              <div class="rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md max-h-8">
                <input type="text" v-model="newIngredientInput" id="new-ingredient" name="new-ingredient" placeholder="e.g. tomato" class="block border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 w-32 h-8 overflow-hidden" />
              </div>
              <button type="button" @click="addIngredient(newIngredientInput)" class="max-h-8 ml-2 btn">Add</button>
            </div>

          </div>
        </div>

        <!-- @TODO Refactor to separate component  -->
        <!-- Recipes -->
        <div id="recipes-section" v-if="!isRecipesEmpty" class="flex flex-row mx-40">
          <!-- Recipe List -->
          <div id="recipe-list" class="mr-10 w-1/3">
            <h2 class="text-base font-semibold leading-7 text-gray-900">
              Recipes<span v-if="beingUsedIngredients.length > 0"> with {{ beingUsedIngredients }}</span> 
            </h2>
            <ul v-for="(recipe, index) in recipes" :key="index">
              <li class="mb-3">
                <button type="button" @click="showRecipeInformation(recipe)" class="text-left">
                  {{ recipe.title }}
                </button>
              </li>
            </ul>
          </div>

          <!-- Selected Recipe Information -->
          <div id="recipe-info" v-if="Object.keys(selectedRecipe).length > 0" class="w-2/3">
            <h2>Information</h2>
            <div>
              <h3 class="mb-2">Name: {{ selectedRecipe.title }}</h3>
              <p>Ingredients</p>

              <!-- Existing Ingredients-->
              <div v-if="Object.keys(selectedRecipe.usedIngredients).length > 0">
                <ul v-for="(requiredIngredients, index) in selectedRecipe.usedIngredients" :key="index">
                  <li class="flex flex-row">{{ requiredIngredients.original }} <CheckCircleIcon class="h-6 w-auto stroke-green-400" /></li>
                </ul>
              </div>

              <!-- Missing Ingredients -->
              <div v-if="Object.keys(selectedRecipe.missedIngredients).length > 0" class="mb-2">
                <ul v-for="(missedIngredient, index) in selectedRecipe.missedIngredients" :key="index">
                  <li class="flex flex-row">
                    <p class="text-gray-400 line-through">{{ missedIngredient.original }}</p> <XCircleIcon class="h-6 w-auto stroke-red-400" /></li>
                </ul>
              </div>
            </div>

            <!-- Instructions -->
            <div v-if="selectedRecipeInstructions.length > 0">
              <h3>Instructions</h3>
              <ul>
                <li v-for="(instruction, index) in selectedRecipeInstructions" :key="index">
                  {{ instruction.number }}. {{ instruction.step }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Generate Button -->
        <div class="flex items-center justify-center h-full">
          <button id="generate-button" type="button" @click="generateRecipes()" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Generate</button>
        </div>

      </div>
    </div>
  </form>
</template>