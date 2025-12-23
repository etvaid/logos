import React from 'react';

// Blog post type definition
interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  category: 'Technology' | 'Research' | 'Tutorials' | 'Announcements';
}

// Example blog posts
const blogPosts: BlogPost[] = [
  {
    title: "Introducing SEMANTIA: Challenging 150 Years of Lexicography",
    excerpt: "Discover how SEMANTIA is revolutionizing the field with advanced technology and innovative techniques.",
    date: "October 1, 2023",
    readingTime: "5 minutes",
    category: "Technology"
  },
  {
    title: "How AI Found Patterns in Homer No Scholar Had Seen",
    excerpt: "Dive into the fascinating world of AI-driven discoveries in classical texts, uncovering hidden patterns in Homer's works.",
    date: "September 25, 2023",
    readingTime: "7 minutes",
    category: "Research"
  },
  {
    title: "The Ghost Texts: Recovering Lost Works with Machine Learning",
    excerpt: "Learn how machine learning is bringing lost ancient works back to life in the digital age.",
    date: "September 15, 2023",
    readingTime: "6 minutes",
    category: "Research"
  },
  {
    title: "5 Ways LOGOS Changes Classical Research Forever",
    excerpt: "Explore the transformative impact of LOGOS on classical research methodologies and outcomes.",
    date: "September 10, 2023",
    readingTime: "4 minutes",
    category: "Announcements"
  }
];

// Define category color according to design system
const categoryColor = {
  Technology: '#3B82F6', // Blue
  Research: '#F59E0B',   // Gold
  Tutorials: '#7C3AED',  // Purple
  Announcements: '#DC2626' // Red
};

// Blog Card Component
const BlogCard: React.FC<BlogPost> = ({ title, excerpt, date, readingTime, category }) => (
  <div style={{
    backgroundColor: '#1E1E24',
    color: '#F5F4F2',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  }}>
    <h3 style={{ borderBottom: `4px solid ${categoryColor[category]}` }}>{title}</h3>
    <p>{excerpt}</p>
    <div style={{ fontSize: '0.9rem', color: '#C9A227' }}>
      <span>{date} | {readingTime} read | </span>
      <span style={{ color: categoryColor[category] }}>{category}</span>
    </div>
  </div>
);

// Blog Index Page
const BlogIndex: React.FC = () => (
  <div style={{
    backgroundColor: '#0D0D0F',
    minHeight: '100vh',
    padding: '40px',
    fontFamily: 'Arial, sans-serif'
  }}>
    <h1 style={{ color: '#F5F4F2', textAlign: 'center', marginBottom: '40px' }}>LOGOS Blog</h1>
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {blogPosts.map((post, index) => (
        <BlogCard key={index} {...post} />
      ))}
    </div>
  </div>
);

export default BlogIndex;