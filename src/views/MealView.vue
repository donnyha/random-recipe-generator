<script setup lang="ts">
  import { ref, type Ref, isProxy, toRaw } from 'vue'
  import axios, { type AxiosRequestConfig } from 'axios'
  import type Recipe from '../types/Recipe';
  import { CheckCircleIcon, MinusCircleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline';

  let ingredients: Ref<string[]> = ref([]);
  let isIngredientsEmpty: Ref<boolean> = ref(true);
  let newIngredientInput: Ref<string> = ref('');
  let isRecipesEmpty: Ref<boolean> = ref(true);
  let beingUsedIngredients: Ref<string> = ref('');
  let recipes: Ref<any[]> = ref([]);
  let selectedRecipe: Ref<Recipe | any> = ref({});
  let selectedRecipeInstructions: Ref<object[] | any[]> = ref([]);

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

        <!-- Ingredients Section -->
        <div id="ingredients-section" class="flex flex-col items-center justify-center h-full m-10">
          
          <!-- New Ingredient Section -->
          <div class="flex flex-row sm:col-span-4 mt-2">
            <div id="new-ingredients-section" class="flex flex-row">
              <div class="rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md max-h-8">
                <input 
                  type="text" 
                  v-model="newIngredientInput"
                  @keypress.enter="addIngredient(newIngredientInput)" 
                  id="new-ingredient" 
                  name="new-ingredient" 
                  placeholder="e.g. tomato" 
                  class="block border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 w-32 h-8 overflow-hidden" 
                />
              </div>
              <button type="button" @click="addIngredient(newIngredientInput)" class="max-h-8 ml-5 btn rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add</button>
            </div>
          </div>

          <!-- Ingredients List -->
          <div id="ingredients-list-section">
            <!-- <label for="user-ingredients" class="block text-sm font-medium leading-6 text-gray-900">Ingredients</label> -->
            <div v-if="!isIngredientsEmpty" class="flex sm:max-w-md">
              <ul class="mt-10">
                <li v-for="(ingredient, index) in ingredients" :key="index" class="flex items-center mb-3">
                  <input type="text" name="ingredient-{{ index }}" :value="ingredient" class="p-0 mr-2 w-full border-none cursor-default pointer-events-none" readonly />
                  <button type="button" id="delete-btn-{{ index }}" @click="removeIngredient(index)" class="border-none">
                    <MinusCircleIcon class="h-6 w-auto stroke-red-400" />
                  </button>
                </li>
              </ul>
            </div>
          </div>

        </div>

        <!-- Generate Recipes Button -->
        <div class="flex items-center justify-center h-full mb-10">
          <button id="generate-button" type="button" @click="generateRecipes()" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Generate
          </button>
        </div>

        <!-- @TODO Refactor to separate component  -->
        <!-- Recipes -->
        <div id="recipes-section" v-if="!isRecipesEmpty" class="flex flex-row mx-40">
          <!-- Recipe List -->
          <div id="recipe-list" class="mr-10 w-1/3">
            <h2 class="text-base font-bold leading-7 text-gray-900 mb-5">
              Recipes<span v-if="beingUsedIngredients.length > 0"> with {{ beingUsedIngredients }}</span> 
            </h2>
            <ul v-for="(recipe, index) in recipes" :key="index">
              <li v-if="selectedRecipe.title === recipe.title" class="mb-3">
                <button type="button" @click="showRecipeInformation(recipe)" class="text-left font-bold text-indigo-500">
                  {{ recipe.title }}
                </button>
              </li>
              <li v-else class="mb-3">
                <button 
                  type="button" 
                  @click="showRecipeInformation(recipe)" 
                  class="
                    text-left 
                    transition ease-in-out 
                    delay-150 
                    hover:-translate-y-1 
                    hover:scale-110 
                    hover:text-indigo-500 
                    duration-300
                  "
                >
                  {{ recipe.title }}
                </button>
              </li>
            </ul>
          </div>

          <!-- Selected Recipe Information -->
          <div id="recipe-info" v-if="Object.keys(selectedRecipe).length > 0" class="w-2/3">
            <h2 class="font-bold mb-5">Recipe Information</h2>
            <div>
              <h3 class="mb-5">Name: {{ selectedRecipe.title }}</h3>

              <!-- Existing Ingredients-->
              <div id="selected-recipe-ingredients" class="mb-5">
                
                <h4>Ingredients</h4>

                <div v-if="Object.keys(selectedRecipe.usedIngredients).length > 0">
                  <ul v-for="(requiredIngredients, index) in selectedRecipe.usedIngredients" :key="index" class="list-disc">
                    <li class="ml-5">
                      <span class="flex flex-row">
                        <span>{{ requiredIngredients.original }}</span> 
                        <CheckCircleIcon class="h-6 w-auto stroke-green-400" />
                      </span>
                    </li>
                  </ul>
                </div>

                <!-- Missing Ingredients -->
                <div v-if="Object.keys(selectedRecipe.missedIngredients).length > 0" class="mb-2">
                  <ul v-for="(missedIngredient, index) in selectedRecipe.missedIngredients" :key="index" class="list-disc">
                    <li class="ml-5">
                      <span class="flex flex-row">
                        <span class="text-gray-400">{{ missedIngredient.original }}</span> 
                        <ExclamationCircleIcon class="h-6 w-auto stroke-yellow-400" />
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

            <!-- Instructions -->
            <div v-if="selectedRecipeInstructions.length > 0">
              <h4>Instructions</h4>
              <ul class="list-decimal">
                <li v-for="(instruction, index) in selectedRecipeInstructions" :key="index" class="ml-8 mb-2">
                  {{ instruction.step }}
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  </form>
</template>