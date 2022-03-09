import AppLayout from "../components/AppLayout";
import {useSelector} from "react-redux";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

const Home = () => {
    const {isLoggedIn} = useSelector((state) => state.user);
    const {mainPosts} = useSelector((state) => state.post);
    return (
        <AppLayout>
            {isLoggedIn && <PostForm/>}
            {/*map을 쓰면 key가 무조건 들어가야한다.*/}
            {mainPosts.map((post) => <PostCard key={post.id} post={post}/>)}
        </AppLayout>
    );
}

export default Home;