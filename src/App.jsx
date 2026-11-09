import React, { useState, useEffect } from 'react';
import { 
  Home, 
  ShoppingCart, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Activity,
  Utensils,
  Target,
  Flame,
  ChefHat
} from 'lucide-react';

const DASHBOARD = 'dashboard';
const GROCERY = 'grocery';
const RECIPES = 'recipes';

// Filipino DASH Diet Placeholders
const initialMeals = [
  { id: 1, name: 'Oatmeal with Fresh Mango', calories: 250, type: 'Breakfast' },
  { id: 2, name: 'Grilled Bangus & Steamed Kangkong', calories: 450, type: 'Lunch' },
  { id: 3, name: 'Boiled Saba Banana', calories: 120, type: 'Snack' },
  { id: 4, name: 'Low-sodium Chicken Tinola (Malunggay & Sayote)', calories: 380, type: 'Dinner' }
];

const initialGrocery = [
  { id: 1, name: 'Rolled Oats', checked: false },
  { id: 2, name: 'Ripe Mangoes', checked: true },
  { id: 3, name: 'Bangus (Milkfish)', checked: false },
  { id: 4, name: 'Kangkong (Water Spinach)', checked: false },
  { id: 5, name: 'Chicken Breast', checked: false },
  { id: 6, name: 'Malunggay Leaves', checked: false },
  { id: 7, name: 'Sayote (Chayote)', checked: true },
  { id: 8, name: 'Ginger', checked: false },
  { id: 9, name: 'Brown Rice', checked: false },
  { id: 10, name: 'Saba Bananas', checked: false }
];

export default function App() {
  const [activeTab, setActiveTab] = useState(DASHBOARD);
  
  // Dashboard State
  const [meals, setMeals] = useState(initialMeals);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', type: 'Breakfast' });
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(calorieGoal);

  // Grocery State
  const [groceryItems, setGroceryItems] = useState(initialGrocery);
  const [newItemName, setNewItemName] = useState('');

  // Recipe Builder State
  const [recipeName, setRecipeName] = useState('Low-Sodium Chicken Adobo');
  const [servings, setServings] = useState(4);
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Chicken Breast (500g)', calories: 825 },
    { id: 2, name: 'Low-sodium Soy Sauce (3 tbsp)', calories: 25 },
    { id: 3, name: 'Vinegar, Garlic, Peppercorn', calories: 15 }
  ]);
  const [newIngredient, setNewIngredient] = useState({ name: '', calories: '' });

  // Derived Stats
  const totalCalories = meals.reduce((sum, meal) => sum + parseInt(meal.calories || 0), 0);
  const progressPercentage = Math.min((totalCalories / calorieGoal) * 100, 100);

  const recipeTotalCalories = ingredients.reduce((sum, item) => sum + parseInt(item.calories || 0), 0);
  const caloriesPerServing = servings > 0 ? Math.round(recipeTotalCalories / servings) : 0;

  // Handlers for Dashboard
  const handleAddMeal = (e) => {
    e.preventDefault();
    if (!newMeal.name || !newMeal.calories) return;
    
    setMeals([
      ...meals,
      { 
        id: Date.now(), 
        name: newMeal.name, 
        calories: parseInt(newMeal.calories), 
        type: newMeal.type 
      }
    ]);
    setNewMeal({ name: '', calories: '', type: 'Breakfast' });
  };

  const handleDeleteMeal = (id) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const handleSaveGoal = () => {
    setCalorieGoal(tempGoal);
    setIsEditingGoal(false);
  };

  // Handlers for Grocery
  const handleAddGrocery = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    
    setGroceryItems([
      ...groceryItems,
      { id: Date.now(), name: newItemName, checked: false }
    ]);
    setNewItemName('');
  };

  const toggleGroceryItem = (id) => {
    setGroceryItems(groceryItems.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleDeleteGroceryItem = (id) => {
    setGroceryItems(groceryItems.filter(item => item.id !== id));
  };

  const generateListFromMeals = () => {
    // In a real app, this would extract ingredients using an API or NLP.
    // For this mockup, we'll just add a placeholder alert-like behavior.
    const dummyIngredients = ['Garlic', 'Onion', 'Tomatoes'];
    const newItems = dummyIngredients.map(ing => ({
      id: Date.now() + Math.random(),
      name: ing,
      checked: false
    }));
    setGroceryItems([...newItems, ...groceryItems]);
  };

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (!newIngredient.name || !newIngredient.calories) return;
    setIngredients([...ingredients, { id: Date.now(), name: newIngredient.name, calories: parseInt(newIngredient.calories) }]);
    setNewIngredient({ name: '', calories: '' });
  };

  const handleRemoveIngredient = (id) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-600">
            <Activity className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight">NutriPlanner DASH</h1>
          </div>
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab(DASHBOARD)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === DASHBOARD ? 'bg-white shadow-sm text-teal-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab(GROCERY)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === GROCERY ? 'bg-white shadow-sm text-teal-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Grocery List
            </button>
            <button 
              onClick={() => setActiveTab(RECIPES)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === RECIPES ? 'bg-white shadow-sm text-teal-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Recipe Builder
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === DASHBOARD && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <h3 className="font-medium">Daily Goal</h3>
                </div>
                {isEditingGoal ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input 
                      type="number" 
                      value={tempGoal}
                      onChange={(e) => setTempGoal(Number(e.target.value))}
                      className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg font-bold"
                    />
                    <button onClick={handleSaveGoal} className="text-sm bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600">Save</button>
                  </div>
                ) : (
                  <div className="flex items-end justify-between mt-2">
                    <p className="text-3xl font-bold text-slate-800">{calorieGoal} <span className="text-sm font-normal text-slate-500">kcal</span></p>
                    <button onClick={() => setIsEditingGoal(true)} className="text-sm text-blue-500 hover:underline">Edit</button>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Utensils className="w-5 h-5 text-orange-500" />
                  <h3 className="font-medium">Consumed</h3>
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-slate-800">{totalCalories} <span className="text-sm font-normal text-slate-500">kcal</span></p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <Flame className={`w-5 h-5 ${totalCalories > calorieGoal ? 'text-red-500' : 'text-teal-500'}`} />
                  <h3 className="font-medium">Remaining</h3>
                </div>
                <div className="mt-2">
                  <p className={`text-3xl font-bold ${totalCalories > calorieGoal ? 'text-red-500' : 'text-teal-600'}`}>
                    {Math.abs(calorieGoal - totalCalories)} 
                    <span className="text-sm font-normal text-slate-500 ml-1">
                      {totalCalories > calorieGoal ? 'over' : 'kcal'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-slate-700">Calorie Progress</h3>
                <span className="text-sm font-medium text-slate-500">{Math.round((totalCalories / calorieGoal) * 100)}%</span>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${totalCalories > calorieGoal ? 'bg-red-500' : 'bg-teal-500'}`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add Meal Form */}
              <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
                <h3 className="font-semibold text-lg mb-4 text-slate-800">Log a Meal</h3>
                <form onSubmit={handleAddMeal} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Meal Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Pinakbet"
                      value={newMeal.name}
                      onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Calories</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      placeholder="e.g. 350"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select 
                      value={newMeal.type}
                      onChange={(e) => setNewMeal({...newMeal, type: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Snack">Snack</option>
                    </select>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Add Meal
                  </button>
                </form>
              </div>

              {/* Meals List */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-semibold text-lg mb-4 text-slate-800">Today's Meals</h3>
                {meals.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">
                    <Utensils className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No meals logged yet today.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {meals.map((meal) => (
                      <div key={meal.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-teal-100 transition-colors group">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">{meal.name}</span>
                          <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full w-fit mt-1">
                            {meal.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-slate-700">{meal.calories} <span className="text-sm font-normal text-slate-500">kcal</span></span>
                          <button 
                            onClick={() => handleDeleteMeal(meal.id)}
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            aria-label="Delete meal"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === GROCERY && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Grocery List</h2>
                  <p className="text-slate-500 text-sm mt-1">Heart-healthy, Filipino DASH diet essentials.</p>
                </div>
                <button 
                  onClick={generateListFromMeals}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  + Add Common Staples
                </button>
              </div>

              {/* Add Grocery Item */}
              <form onSubmit={handleAddGrocery} className="flex gap-2 mb-8">
                <input 
                  type="text" 
                  placeholder="Add a new item (e.g. Garlic, Papaya)..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button 
                  type="submit"
                  disabled={!newItemName.trim()}
                  className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white p-3 rounded-xl transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </form>

              {/* Grocery List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {groceryItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between p-3 rounded-lg group transition-colors ${item.checked ? 'bg-slate-50 opacity-60' : 'hover:bg-slate-50'}`}
                  >
                    <div 
                      className="flex items-center gap-3 cursor-pointer flex-1"
                      onClick={() => toggleGroceryItem(item.id)}
                    >
                      {item.checked ? (
                        <CheckCircle2 className="w-6 h-6 text-teal-500 shrink-0" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300 shrink-0" />
                      )}
                      <span className={`font-medium ${item.checked ? 'line-through text-slate-500' : 'text-slate-700'}`}>
                        {item.name}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDeleteGroceryItem(item.id)}
                      className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {groceryItems.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>Your grocery list is empty.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === RECIPES && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Recipe Builder</h2>
                <p className="text-slate-500 text-sm mt-1">Calculate exact calories per serving for your home-cooked meals.</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Details & Input */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Recipe Name</label>
                      <input 
                        type="text" 
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Servings</label>
                      <input 
                        type="number" 
                        min="1"
                        value={servings}
                        onChange={(e) => setServings(Number(e.target.value))}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                    <h3 className="font-semibold text-slate-800 mb-3">Add Ingredient</h3>
                    <form onSubmit={handleAddIngredient} className="space-y-3">
                      <div>
                        <input 
                          type="text" 
                          placeholder="Ingredient Name (e.g. Pork Giniling)"
                          value={newIngredient.name}
                          onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          min="0"
                          placeholder="Calories (kcal)"
                          value={newIngredient.calories}
                          onChange={(e) => setNewIngredient({...newIngredient, calories: e.target.value})}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm flex-1 bg-white"
                        />
                        <button 
                          type="submit"
                          className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shrink-0 flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Right Column: List & Summary */}
                <div className="flex flex-col h-full">
                  <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 p-4 mb-4 overflow-y-auto max-h-72">
                    <h3 className="font-semibold text-slate-800 mb-3 text-xs uppercase tracking-wider">Ingredients List</h3>
                    {ingredients.length === 0 ? (
                      <p className="text-slate-500 text-sm">No ingredients added yet. Add items to see total calories.</p>
                    ) : (
                      <ul className="space-y-2">
                        {ingredients.map((ing) => (
                          <li key={ing.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                            <span className="text-sm font-medium text-slate-700">{ing.name}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-semibold text-slate-600">{ing.calories} <span className="font-normal text-slate-400 text-xs">kcal</span></span>
                              <button onClick={() => handleRemoveIngredient(ing.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-md mt-auto">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-teal-50 font-medium">Total Calories</span>
                      <span className="text-2xl font-bold">{recipeTotalCalories}</span>
                    </div>
                    <div className="flex justify-between items-end border-t border-teal-400/50 pt-3">
                      <span className="text-teal-50 font-medium">Per Serving</span>
                      <span className="text-4xl font-bold tracking-tight">
                        {caloriesPerServing} <span className="text-lg font-normal text-teal-100">kcal</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around p-3 pb-safe z-20">
        <button 
          onClick={() => setActiveTab(DASHBOARD)}
          className={`flex flex-col items-center p-2 rounded-lg ${activeTab === DASHBOARD ? 'text-teal-600' : 'text-slate-400'}`}
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveTab(GROCERY)}
          className={`flex flex-col items-center p-2 rounded-lg ${activeTab === GROCERY ? 'text-teal-600' : 'text-slate-400'}`}
        >
          <ShoppingCart className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Grocery</span>
        </button>
        <button 
          onClick={() => setActiveTab(RECIPES)}
          className={`flex flex-col items-center p-2 rounded-lg ${activeTab === RECIPES ? 'text-teal-600' : 'text-slate-400'}`}
        >
          <ChefHat className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Recipes</span>
        </button>
      </nav>
    </div>
  );
}
