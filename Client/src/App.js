
import './App.css';
import Post from "./Posts";
import Header from "./Headers"; 
import Layout from "./Layout";
import {Routes,Route} from "react-router-dom";
import IndexPage from "./Pages/IndexPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage"
import { UserContextProvider } from './UserContext';
import CreatePost from './Pages/CreatePost';
import PostPage from './Pages/PostPage';
import EditPost from './Pages/EditPost';

function App() {
  return (
    <UserContextProvider>
    <Routes>
    <Route path="/" element = {<Layout />}>
       
      <Route index element={<IndexPage />} /> 

      <Route path="/login" element={<LoginPage />}>
      </Route>
      
      <Route path="/register" element={<RegisterPage />}></Route>
      <Route path="/create" element={<CreatePost />}></Route>
      <Route path="/post/:id" element={<PostPage />}></Route>
      <Route path='/edit/:id' element={<EditPost />}></Route>
    </Route>
   </Routes>
   </UserContextProvider>
  );
}

export default App;
