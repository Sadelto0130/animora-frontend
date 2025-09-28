import { Link, useParams } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/ui/Loader";
import BlogInteraction from "../components/blog/blog-interaction.component";
import BlogPostCard from "../components/blog/blog-post.component";
import BlogContent from "../components/blog/blog-content.component";
import { getFullDate } from "../libs/utils";

const BlogPage = () => {
  const { getPostByIdSlug, getCommentsPost, updateReadCount, getAllPostByTag } =
    useBlog();
  const { user } = useAuth();
  const { post_slug } = useParams();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(false);
  const [similarPost, setSimilarPost] = useState([]);
  let page = 1;

  let { title, banner, content, blog_images, comments, users, created_at, tags } = post;

  const moreComments = async () => {
    page += 1;
    const comments = await getCommentsPost(post.post_id, page);
    setPost({
      ...post,
      comments: [...post.comments, ...comments],
    });
  };

  const getSimilarPost = async (tags, currentPostId) => {
    if (!Array.isArray(tags) || tags.length === 0) return;

    try {
      const results = await Promise.all(
        tags?.map((tag) => getAllPostByTag(tag))
      );

      const mergedTag = results.flat();

      // filtrar duplicados y excluye post actual
      const uniquePosts = mergedTag.filter(
        (p, index, arr) =>
          p.post_id !== currentPostId && // excluye
          arr.findIndex((x) => x.post_id === p.post_id) === index // filtra
      );

      // Mezclar aleatoriamente
      const shuffled = uniquePosts.sort(() => Math.random() - 0.5);

      // Tomar los 3 primeros
      setSimilarPost(shuffled.slice(0, 3));
    } catch (error) {
      console.error("Error obteniendo post similastes:", error);
      return <h1>Error al obtener post similares</h1>;
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const data = await getPostByIdSlug(post_slug);

      if (!data) {
        setPost(null);
        setLoading(false);
        return;
      }

      const comments = await getCommentsPost(data.post_id, page);
      data.comments = comments || [];

      setPost(data);
      setLoading(false);

      if (user?.id === post.user_id) return;
      updateReadCount(data.post_id, user?.id);
    };
    fetchPost();
  }, [post_slug]);

  useEffect(() => {
    if (post?.tags && post?.post_id) {
      getSimilarPost(post.tags, post.post_id);
    }
  }, [post, post_slug]);

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-[900px] center py-9 max-lg:px-[5vw]">
          <img src={banner ? banner : ""} className="aspect-video" />

          <div className="mt-12">
            <h2>{title}</h2>

            <div className="flex max-sm:flex-col justify-between my-8">
              <div className="flex gap-5 items-start">
                <img
                  src={
                    users?.avatar_url ? users?.avatar_url.replace(/;/g, "") : ""
                  }
                  className="w-12 h-12 rounded-full"
                />

                <p className="capitalize">
                  {users?.name} {users?.last_name} <br />@
                  <Link
                    to={`/user_profile/${users?.user_name}`}
                    className="underline"
                  >
                    {users?.user_name}
                  </Link>
                </p>
              </div>
              <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                Publicado el {getFullDate(created_at)}
              </p>
            </div>
          </div>

          {post?.post_id && <BlogInteraction post={post} />}

          <div className="my-12 font-gelasio blog-page-content">
            {
              content?.map((block, i) => {
                return <div className="my-4 md:my-8" key={i}>
                  <BlogContent block={block} />
                </div>
              })
            }
          </div>

          {post?.post_id && <BlogInteraction post={post} />}

          {similarPost !== null && similarPost.length > 1 ? (
            <>
              <h1 className="text-2xl mt-14 mb-10 font-medium">
                Post Sugeridos
              </h1>
              {similarPost.map((post, i) => {
                let { users } = post;

                return (
                  <AnimationWrapper
                    key={i}
                    transition={{ duration: 1, delay: i * 0.08 }}
                  >
                    <BlogPostCard contenido={post} autor={post.users} />
                  </AnimationWrapper>
                );
              })}
            </>
          ) : (
            ""
          )}
        </div>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;
