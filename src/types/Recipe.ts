export default interface Recipe {
  id: number
  image: string
  imageType: string
  likes: number
  missedIngredientCount: number
  missedIngredients: any[]
  unusedIngredients: any[]
  usedIngredientCount: number
  usedIngredients: any[]
  title: string
}
