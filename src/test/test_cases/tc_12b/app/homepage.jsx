'use client'

export default function HomePage({ recentPosts }) {
    return (
        <div>
            {recentPosts.map((post) => (
                <div key={post.id}>{post.title}</div>
            ))}
        </div>
    );
}