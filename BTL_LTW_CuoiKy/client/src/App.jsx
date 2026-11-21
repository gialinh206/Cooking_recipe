import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AdminRoute from './routes/AdminRoute.jsx';
import Home from './pages/Home.jsx';
import RecipeList from './pages/RecipeList.jsx';
import RecipeDetail from './pages/RecipeDetail.jsx';
import RecipeForm from './pages/RecipeForm.jsx';
import MyRecipes from './pages/MyRecipes.jsx';
import Favorites from './pages/Favorites.jsx';
import MealPlanner from './pages/MealPlanner.jsx';
import ShoppingList from './pages/ShoppingList.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import PendingRecipes from './pages/admin/PendingRecipes.jsx';
import ReviewModeration from './pages/admin/ReviewModeration.jsx';
import CategoryManager from './pages/admin/CategoryManager.jsx';

const App = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="recipes" element={<RecipeList />} />
      <Route path="recipes/:id" element={<RecipeDetail />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="recipes/new" element={<RecipeForm />} />
        <Route path="recipes/:id/edit" element={<RecipeForm />} />
        <Route path="my-recipes" element={<MyRecipes />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="meal-plan" element={<MealPlanner />} />
        <Route path="shopping-list" element={<ShoppingList />} />
      </Route>
    </Route>

    <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
      <Route index element={<AdminDashboard />} />
      <Route path="pending" element={<PendingRecipes />} />
      <Route path="reviews" element={<ReviewModeration />} />
      <Route path="categories" element={<CategoryManager />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);
export default App;
