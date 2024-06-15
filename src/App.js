import { Routes, Route } from "react-router-dom";
import Home from "./pages/Quiz/Home";
import Quiz from "./pages/Quiz/Quiz";
import DefaultLayout from "./layout/DefaultLayout";
import Topic from "./pages/Quiz/Topic";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import AnsResult from "./pages/Quiz/AnsResult";
import Post from "./pages/Quiz/Post";
import Tool from "./pages/Quiz/Tool";
import Refer from "./pages/Quiz/Refer";
import AdminLayout from "./layout/AdminLayout";
import Admin from "./pages/Admin/Admin";
import Users from "./pages/Admin/Users";
import TopicManager from "./pages/Admin/TopicManager";
import History from "./pages/Admin/History";
import Historyy from "./pages/Quiz/History";
import Test from "./pages/Quiz/Test";
import Profile from "./pages/User/Profile";
import Forget from "./pages/Auth/Forget";
import PageNotFound from "./layout/PageNotFound";

function App() {
    return (
        <Routes>
            <Route path="/" element={<DefaultLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/quiz/:id" element={<Quiz />} />
                <Route path="/topic" element={<Topic />} />
                <Route path="/tool" element={<Tool />} />
                <Route path="/tool/:id" element={<Refer />} />
                <Route path="/post" element={<Post />} />
                <Route path="/history" element={<Historyy />} />
                <Route path="/answer/:id" element={<AnsResult />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/test" element={<Test />} />
                <Route path="/profile/:uid" element={<Profile />} />
                <Route path="/forget" element={<Forget />} />
                <Route path="*" element={<PageNotFound />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/topic" element={<TopicManager />} />
                <Route path="/admin/history" element={<History />} />
            </Route>
        </Routes>
    );
}

export default App;
