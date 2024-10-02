import { Routes, Route } from "react-router-dom";
import Home from "./pages/Quiz/Home";
import Quiz from "./pages/Quiz/Quiz";
import DefaultLayout from "./layout/DefaultLayout";
import Topic from "./pages/Quiz/Topic";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import AnsResult from "./pages/Quiz/AnsResult";
import PostText from "./pages/Quiz/PostText";
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
import Edit from "./pages/Quiz/Edit";
import ResultTopic from "./pages/Quiz/ResultTopic";
import NewPostTool from "./pages/Admin/NewPostTool";
import SubjectOutline from "./pages/Quiz/SubjectOutline";
import ProfileUID from "./pages/User/ProfileUID";
import ChatRoom from "./pages/User/ChatRoom";
import ChatLayout from "./layout/ChatLayout";
import PostLayout from "./layout/PostLayout";
import PostGUI from "./pages/Quiz/PostGUI";
import UserUseTool from "./pages/Admin/UserUseTool";
import HistoryTool from "./pages/Admin/HistoryTool";
import ChangePassword from "./pages/Auth/ChangePassword";
function App() {
    return (
        <Routes>
            <Route path="/" element={<DefaultLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/quiz/:id" element={<Quiz />} />
                <Route path="/chude" element={<Topic />} />
                <Route path="/chude/:id" element={<ResultTopic />} />
                <Route path="/decuong/:id" element={<Refer />} />
                <Route path="/post" element={<PostLayout />} />
                <Route path="/post/gui" element={<PostGUI />} />
                <Route path="/post/text" element={<PostText />} />
                <Route path="/tailieu" element={<SubjectOutline />} />
                <Route path="/edit/:id" element={<Edit />} />
                <Route path="/lichsu" element={<Historyy />} />
                <Route path="/answer/:id" element={<AnsResult />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/test" element={<Test />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:uid" element={<ProfileUID />} />
                <Route path="/forget" element={<Forget />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/chat" element={<ChatLayout />}>
                    <Route path="/chat/room/:id" element={<ChatRoom />} />
                </Route>
                <Route path="*" element={<PageNotFound />} />
            </Route>
            <Route path="/whatheo" element={<AdminLayout />}>
                <Route path="/whatheo" element={<Admin />} />
                <Route path="/whatheo/users" element={<Users />} />
                <Route path="/whatheo/topic" element={<TopicManager />} />
                <Route path="/whatheo/history" element={<History />} />
                <Route path="/whatheo/tool" element={<NewPostTool />} />
                <Route path="/whatheo/user-use-tool" element={<UserUseTool />} />
                <Route path="/whatheo/history-tool" element={<HistoryTool />} />
            </Route>
        </Routes>
    );
}

export default App;
