import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import {
  HomePage,
  ArticlesPage,
  ArticleDetailPage,
  TagsPage,
  TagDetailPage,
  AboutPage,
  AdminPage,
  ArticleEditorPage,
  GitHubSettingsPage,
} from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 博客前台 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="post/:slug" element={<ArticleDetailPage />} />
          <Route path="tags" element={<TagsPage />} />
          <Route path="tags/:slug" element={<TagDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          {/* 管理后台（带导航栏） */}
          <Route path="admin" element={<AdminPage />} />
        </Route>
        {/* 编辑器和设置（全屏，不带导航栏） */}
        <Route path="/admin/editor" element={<ArticleEditorPage />} />
        <Route path="/admin/editor/:id" element={<ArticleEditorPage />} />
        <Route path="/admin/github" element={<GitHubSettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
