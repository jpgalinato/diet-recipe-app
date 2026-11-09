import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Calendar, 
  ShoppingBag, 
  BookOpen, 
  Plus, 
  Trash2, 
  Check, 
  ChefHat, 
  Flame, 
  HeartPulse, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  Circle
} from 'lucide-react';

// Common ingredient nutritional database (Calories per 100g or standard unit)
const INGREDIENT_DATABASE = {
  'chicken breast': { calsPerUnit: 1.65, defaultUnit: 'grams' },
  'chicken thigh': { calsPerUnit: 2.09, defaultUnit: 'grams' },
  'tilapia': { calsPerUnit: 1.28, defaultUnit: 'grams' },
  'bangus': { calsPerUnit: 1.48, defaultUnit: 'grams' },
  'tofu': { calsPerUnit: 0.76, defaultUnit: 'grams' },
  'egg': { calsPerUnit: 72, defaultUnit: 'pieces' },
  'brown rice': { calsPerUnit: 216, defaultUnit: 'cups' },
  'white rice': { calsPerUnit: 204, defaultUnit: 'cups' },
  'monggo': { calsPerUnit: 212, defaultUnit: 'cups' },
  'kangkong': { calsPerUnit: 19, defaultUnit: 'grams' },
  'malunggay': { calsPerUnit: 64, defaultUnit: 'grams' },
  'saba banana': { calsPerUnit: 81, defaultUnit: 'pieces' },
  'olive oil': { calsPerUnit: 119, defaultUnit: 'tbsp' },
  'garlic': { calsPerUnit: 4.5, defaultUnit: 'pieces' },
  'onion': { calsPerUnit: 44, defaultUnit: 'pieces' },
  'tomatoes': { calsPerUnit: 22, defaultUnit: 'pieces' },
  'oats': { calsPerUnit: 154, defaultUnit: 'cups' }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dailyGoal] = useState(1900);
  
  // Wiped clean state
  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem('jp_meals');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem('jp_recipes');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [groceryList, setGroceryList] = useState(() => {
    const saved = localStorage.getItem('jp_grocery');
    return saved ? JSON.parse(saved) : [];
  });

  // Calendar State
  const [calendarView, setCalendarView] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Recipe Builder Form State
  const [recipeName, setRecipeName] = useState('');
  const [servings, setServings] = useState(2);
  const [ingredients, setIngredients] = useState([]);
  const [ingName, setIngName] = useState('');
  const [ingQty, setIngQty] = useState('');
  const [ingUnit, setIngUnit] = useState('grams');
  const [ingCategory, setIngCategory] = useState('Produce');

  useEffect(() => {
    localStorage.setItem('jp_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('jp_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('jp_grocery', JSON.stringify(groceryList));
  }, [groceryList]);

  // Auto Calorie Engine
  const calculateCalories = (name, qty, unit) => {
    const cleanName = name.trim().toLowerCase();
    const amount = parseFloat(qty) || 0;
    if (!amount) return 0;

    if (INGREDIENT_DATABASE[cleanName]) {
      const dbItem = INGREDIENT_DATABASE[cleanName];
      return Math.round(dbItem.calsPerUnit * amount);
    }

    // Fallback Density Calculator
    const unitMultipliers = {
      grams: 1.5,
      cups: 180,
      tbsp: 45,
      tsp: 15,
      pieces: 60,
      oz: 42
    };
    const multiplier = unitMultipliers[unit] || 1;
    return Math.round(amount * multiplier);
  };

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (!ingName || !ingQty) return;

    const estimatedCals = calculateCalories(ingName, ingQty, ingUnit);

    const newIng = {
      id: Date.now(),
      name: ingName,
      qty: parseFloat(ingQty),
      unit: ingUnit,
      calories: estimatedCals,
      category: ingCategory
    };

    setIngredients([...ingredients, newIng]);
    setIngName('');
    setIngQty('');
  };

  const handleRemoveIngredient = (id) => {
    setIngredients(ingredients.filter(item => item.id !== id));
  };

  const totalRecipeCalories = ingredients.reduce((sum, item) => sum + item.calories, 0);
  const caloriesPerServing = servings > 0 ? Math.round(totalRecipeCalories / servings) : 0;
  const dietPercentage = Math.round((caloriesPerServing / dailyGoal) * 100);

  const handleSaveRecipe = () => {
    if (!recipeName || ingredients.length === 0) return;

    const newRecipe = {
      id: Date.now(),
      name: recipeName,
      servings: parseInt(servings),
      ingredients,
      totalCalories: totalRecipeCalories,
      caloriesPerServing,
      dietPercentage
    };

    setRecipes([...recipes, newRecipe]);
    setRecipeName('');
    setIngredients([]);
    setServings(2);
    setActiveTab('recipes');
  };

  const handlePushToGrocery = (recipe) => {
    const newItems = recipe.ingredients.map(ing => ({
      id: Date.now() + Math.random(),
      name: `${ing.name} (${ing.qty} ${ing.unit})`,
      category: ing.category,
      checked: false
    }));
    setGroceryList([...groceryList, ...newItems]);
    setActiveTab('grocery');
  };

  const handleLogMeal = (mealData) => {
    const newMeal = {
      id: Date.now(),
      date: selectedDate,
      timeSlot: mealData.timeSlot || 'Lunch',
      name: mealData.name,
      calories: mealData.calories,
      status: mealData.status || 'Eaten'
    };
    setMeals([...meals, newMeal]);
  };

  const handleToggleMealStatus = (id) => {
    setMeals(meals.map(m => m.id === id ? { ...m, status: m.status === 'Eaten' ? 'Planned' : 'Eaten' } : m));
  };

  const handleRemoveMeal = (id) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  const handleToggleGrocery = (id) => {
    setGroceryList(groceryList.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleClearGrocery = () => {
    setGroceryList(groceryList.filter(item => !item.checked));
  };

  // Daily totals
  const todayMeals = meals.filter(m => m.date === selectedDate);
  const todayEatenCals = todayMeals.filter(m => m.status === 'Eaten').reduce((sum, m) => sum + m.calories, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-emerald-700 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <ChefHat className="h-8 w-8 text-emerald-200" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">Jp's Meal Planner</h1>
              <p className="text-xs text-emerald-100">Low-Sodium DASH Diet & Calorie Manager</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-600">
            <HeartPulse className="h-4 w-4 text-emerald-300" />
            <span className="text-xs font-medium">Daily Target: <strong>1,900 kcal</strong></span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 flex justify-around sm:justify-start sm:space-x-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Utensils },
            { id: 'calendar', label: 'Meal Calendar', icon: Calendar },
            { id: 'builder', label: 'Recipe Builder', icon: Flame },
            { id: 'recipes', label: 'My Recipes', icon: BookOpen },
            { id: 'grocery', label: 'Grocery List', icon: ShoppingBag }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Flame className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Today's Consumed</p>
                  <p className="text-2xl font-bold text-slate-800">{todayEatenCals} kcal</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Daily Goal</p>
                  <p className="text-2xl font-bold text-slate-800">{dailyGoal} kcal</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${dailyGoal - todayEatenCals >= 0 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                  <Utensils className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Remaining Budget</p>
                  <p className={`text-2xl font-bold ${dailyGoal - todayEatenCals >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
                    {dailyGoal - todayEatenCals} kcal
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-800">Log Quick Meal Today</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  id="quickMealName"
                  placeholder="Meal Name (e.g. Steamed Bangus & Brown Rice)"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <input
                  type="number"
                  id="quickMealCals"
                  placeholder="Calories (kcal)"
                  className="w-full sm:w-40 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button
                  onClick={() => {
                    const name = document.getElementById('quickMealName').value;
                    const cals = parseInt(document.getElementById('quickMealCals').value);
                    if (name && cals) {
                      handleLogMeal({ name, calories: cals, timeSlot: 'Lunch', status: 'Eaten' });
                      document.getElementById('quickMealName').value = '';
                      document.getElementById('quickMealCals').value = '';
                    }
                  }}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition"
                >
                  Log Meal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg font-medium text-slate-700 outline-none"
                />
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {['daily', 'weekly', 'monthly'].map(view => (
                  <button
                    key={view}
                    onClick={() => setCalendarView(view)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-md capitalize transition ${
                      calendarView === view ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    {view} View
                  </button>
                ))}
              </div>
            </div>

            {/* DAILY VIEW */}
            {calendarView === 'daily' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(slot => {
                  const slotMeals = todayMeals.filter(m => m.timeSlot === slot);
                  return (
                    <div key={slot} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="font-bold text-slate-700">{slot}</h3>
                        <span className="text-xs font-semibold text-emerald-600">
                          {slotMeals.reduce((s, m) => s + m.calories, 0)} kcal
                        </span>
                      </div>
                      {slotMeals.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-2">No meals logged for {slot.toLowerCase()}</p>
                      ) : (
                        <div className="space-y-2">
                          {slotMeals.map(meal => (
                            <div key={meal.id} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg text-sm">
                              <div className="flex items-center space-x-2">
                                <button onClick={() => handleToggleMealStatus(meal.id)}>
                                  {meal.status === 'Eaten' ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                  ) : (
                                    <Circle className="h-4 w-4 text-slate-400" />
                                  )}
                                </button>
                                <span className={meal.status === 'Eaten' ? 'line-through text-slate-400' : 'font-medium'}>
                                  {meal.name}
                                </span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="font-semibold text-xs">{meal.calories} kcal</span>
                                <button onClick={() => handleRemoveMeal(meal.id)} className="text-slate-400 hover:text-rose-500">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* WEEKLY VIEW */}
            {calendarView === 'weekly' && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800">Weekly Calorie Summary</h3>
                <div className="space-y-3">
                  {meals.length === 0 ? (
                    <p className="text-slate-400 text-sm italic">No entries for this week.</p>
                  ) : (
                    meals.map(m => (
                      <div key={m.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-sm">{m.name}</p>
                          <p className="text-xs text-slate-400">{m.date} • {m.timeSlot}</p>
                        </div>
                        <span className="text-emerald-700 font-bold">{m.calories} kcal</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* MONTHLY VIEW */}
            {calendarView === 'monthly' && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800">Monthly Tracker</h3>
                <p className="text-sm text-slate-500">Total logged entries: {meals.length}</p>
              </div>
            )}
          </div>
        )}

        {/* RECIPE BUILDER TAB */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-800">Create Custom Recipe</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Recipe Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Low-Sodium Monggo Soup"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Servings Yield</label>
                  <input
                    type="number"
                    min="1"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Add Ingredient Form */}
              <form onSubmit={handleAddIngredient} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Add Ingredient (Auto-Calorie Engine)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Ingredient Name (e.g. Tilapia)"
                    value={ingName}
                    onChange={(e) => setIngName(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={ingQty}
                    onChange={(e) => setIngQty(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
                  />
                  <select
                    value={ingUnit}
                    onChange={(e) => setIngUnit(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none bg-white"
                  >
                    <option value="grams">grams</option>
                    <option value="cups">cups</option>
                    <option value="tbsp">tbsp</option>
                    <option value="tsp">tsp</option>
                    <option value="pieces">pieces</option>
                  </select>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <select
                    value={ingCategory}
                    onChange={(e) => setIngCategory(e.target.value)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none bg-white"
                  >
                    <option value="Produce">Fresh Produce</option>
                    <option value="Proteins">Lean Proteins</option>
                    <option value="Pantry">Pantry & Grains</option>
                    <option value="Spices">Low-Sodium Spices</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 hover:bg-emerald-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Item</span>
                  </button>
                </div>
              </form>

              {/* Ingredient List */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase">Recipe Ingredients</h3>
                {ingredients.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No ingredients added yet.</p>
                ) : (
                  ingredients.map((ing) => (
                    <div key={ing.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg text-sm">
                      <div>
                        <span className="font-semibold text-slate-700">{ing.name}</span>
                        <span className="text-xs text-slate-400 ml-2">({ing.qty} {ing.unit})</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-emerald-600">{ing.calories} kcal</span>
                        <button onClick={() => handleRemoveIngredient(ing.id)} className="text-slate-400 hover:text-rose-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recipe Summary Side Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 h-fit">
              <h3 className="font-bold text-slate-800 border-b pb-2">Nutritional Breakdown</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Total Recipe Calories</p>
                  <p className="text-3xl font-extrabold text-slate-800">{totalRecipeCalories} kcal</p>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <p className="text-xs text-emerald-800 font-medium">Calories Per Serving ({servings} servings)</p>
                  <p className="text-2xl font-bold text-emerald-700">{caloriesPerServing} kcal</p>
                  <p className="text-xs text-emerald-600 font-semibold">
                    {dietPercentage}% of your 1,900 kcal daily diet
                  </p>
                </div>
              </div>

              <button
                onClick={handleSaveRecipe}
                disabled={!recipeName || ingredients.length === 0}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition disabled:opacity-50"
              >
                Save Recipe
              </button>
            </div>
          </div>
        )}

        {/* MY RECIPES TAB */}
        {activeTab === 'recipes' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">My Cookbook</h2>
            {recipes.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
                <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No recipes saved yet. Build one in the Recipe Builder!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recipes.map(recipe => (
                  <div key={recipe.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-start border-b pb-3">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{recipe.name}</h3>
                        <p className="text-xs text-slate-500">{recipe.servings} servings yield</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                        {recipe.caloriesPerServing} kcal / serving
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      {recipe.ingredients.map((ing, idx) => (
                        <p key={idx}>• {ing.name} ({ing.qty} {ing.unit}) - {ing.calories} kcal</p>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2 border-t">
                      <button
                        onClick={() => handleLogMeal({ name: recipe.name, calories: recipe.caloriesPerServing, timeSlot: 'Lunch' })}
                        className="flex-1 bg-emerald-50 text-emerald-700 py-2 rounded-lg text-xs font-bold hover:bg-emerald-100"
                      >
                        Log as Meal
                      </button>
                      <button
                        onClick={() => handlePushToGrocery(recipe)}
                        className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg text-xs font-bold hover:bg-slate-200"
                      >
                        Send to Grocery
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GROCERY LIST TAB */}
        {activeTab === 'grocery' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Categorized Grocery List</h2>
              {groceryList.some(i => i.checked) && (
                <button
                  onClick={handleClearGrocery}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700"
                >
                  Clear Completed
                </button>
              )}
            </div>

            {groceryList.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
                <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Your grocery list is empty. Push items from saved recipes!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['Produce', 'Proteins', 'Pantry', 'Spices'].map(cat => {
                  const catItems = groceryList.filter(item => item.category === cat);
                  if (catItems.length === 0) return null;
                  return (
                    <div key={cat} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                      <h3 className="font-bold text-slate-700 border-b pb-2 text-sm">{cat}</h3>
                      <div className="space-y-2">
                        {catItems.map(item => (
                          <div
                            key={item.id}
                            onClick={() => handleToggleGrocery(item.id)}
                            className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50"
                          >
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => {}}
                              className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className={`text-sm ${item.checked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                              {item.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
