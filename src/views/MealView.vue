<script setup lang="ts">
  import { ref, type Ref } from 'vue'

  let ingredients: Ref<string[]> = ref([])
  let isIngredientsEmpty: Ref<boolean> = ref(true)
  let newIngredient: Ref<string> = ref('')

  const addIngredient = (ingredient: string) => {
    // check if ingrdient is empty string
    // check if ingredient already exists

    ingredients.value.push(ingredient)
    newIngredient.value = ''
    checkIfIngredientsEmpty()
  }
  
  const removeIngredient: (ingredientIndex: number) => void = (ingredientIndex: number) => {
    ingredients.value.splice(ingredientIndex, 1)
    checkIfIngredientsEmpty()
  }

  const checkIfIngredientsEmpty: () => void = () => {
    ingredients.value.length > 0 ? isIngredientsEmpty.value = false : isIngredientsEmpty.value = true
  }
</script>

<template>
  <form>
    <div class="space-y-12">
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-base font-semibold leading-7 text-gray-900">Recipe</h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">Please click 'Generate' Button to generate a random recipe</p>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <label for="user-ingredients" class="block text-sm font-medium leading-6 text-gray-900">Ingredients</label>
            <div class="mt-2">
              <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <div v-if="!isIngredientsEmpty">
                  <ul>
                    <li v-for="(ingredient, index) in ingredients" :key="index" >
                      <input type="text" name="ingredient-{{ index }}" :value="ingredient" readonly />
                      <button type="button" id="delete-btn-{{ index }}" @click="removeIngredient(index)">-</button>
                    </li>
                  </ul>
                </div>
                <div v-else>Empty</div>
              </div>

              <div class="flex flex-row">
                <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input type="text" v-model="newIngredient" id="new-ingredient" name="new-ingredient" placeholder="e.g. tomato" class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
                </div>
                <button type="button" @click="addIngredient(newIngredient)" class="ml-2 btn">Add</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
    </div>
  </form>
</template>