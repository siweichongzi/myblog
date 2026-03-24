import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, Check, ExternalLink, AlertCircle, Database } from 'lucide-react';
import {
  loadGitHubConfig,
  saveGitHubConfig,
  clearGitHubConfig,
  type GitHubConfig,
} from '../data/store';

export function GitHubSettingsPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<GitHubConfig>({
    owner: '',
    repo: '',
    branch: 'main',
    token: '',
  });
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  // 加载已有配置
  useEffect(() => {
    const existing = loadGitHubConfig();
    if (existing) {
      setConfig(existing);
    }
  }, []);

  const handleChange = (field: keyof GitHubConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value.trim() }));
    setSaved(false);
    setTestResult(null);
  };

  const handleSave = () => {
    if (!config.owner || !config.repo || !config.token) {
      alert('请填写完整信息（owner、repo、token 必填）');
      return;
    }
    saveGitHubConfig(config);
    setSaved(true);
    // 清除缓存，下次加载会从 GitHub 拉取
    localStorage.removeItem('blog_articles');
  };

  const handleClear = () => {
    if (confirm('确定清除 GitHub 配置？清除后文章将无法保存到云端。')) {
      clearGitHubConfig();
      setConfig({ owner: '', repo: '', branch: 'main', token: '' });
      setSaved(false);
      setTestResult(null);
    }
  };

  const handleTest = async () => {
    if (!config.owner || !config.repo || !config.token) {
      setTestResult({ ok: false, message: '请先填写完整信息' });
      return;
    }
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}`,
        { headers: { Authorization: `token ${config.token}`, Accept: 'application/vnd.github.v3+json' } }
      );
      if (res.ok) {
        const data = await res.json();
        setTestResult({ ok: true, message: `✅ 连接成功！仓库: ${data.full_name}` });
      } else if (res.status === 404) {
        setTestResult({ ok: false, message: '❌ 仓库不存在或 Token 权限不足' });
      } else if (res.status === 401) {
        setTestResult({ ok: false, message: '❌ Token 无效，请检查是否正确' });
      } else {
        setTestResult({ ok: false, message: `❌ 连接失败 (${res.status})` });
      }
    } catch (e) {
      setTestResult({ ok: false, message: '❌ 网络错误，请检查网络连接' });
    }

    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-surface border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate('/admin')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <Github size={16} />
          GitHub 云同步设置
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* 说明 */}
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
          <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
            <Database size={16} className="text-primary" />
            为什么需要配置 GitHub？
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            文章数据将存储在你指定的 GitHub 私有仓库中（以 <code className="bg-white px-1 rounded">articles.json</code> 文件保存）。
            这样部署到线上的博客也能读取到文章，换设备也不会丢失数据。
          </p>
        </div>

        {/* 表单 */}
        <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
          <h2 className="font-semibold text-gray-800 mb-4">GitHub 仓库配置</h2>

          {/* Owner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub 用户名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={config.owner}
              onChange={(e) => handleChange('owner', e.target.value)}
              placeholder="siweichongzi"
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">你的 GitHub 登录名</p>
          </div>

          {/* Repo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              仓库名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={config.repo}
              onChange={(e) => handleChange('repo', e.target.value)}
              placeholder="myblog-data"
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">
              用于存放文章数据的仓库，建议创建新的空私有仓库（如 myblog-data）
            </p>
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分支名
            </label>
            <input
              type="text"
              value={config.branch}
              onChange={(e) => handleChange('branch', e.target.value)}
              placeholder="main"
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Token */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Personal Access Token <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={config.token}
              onChange={(e) => handleChange('token', e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">
              需要勾选 <code className="bg-gray-100 px-1 rounded">repo</code> 权限
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              <Check size={14} />
              保存配置
            </button>
            <button
              onClick={handleTest}
              disabled={testing}
              className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-60"
            >
              {testing ? '测试中...' : '测试连接'}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 text-red-500 text-sm hover:underline"
            >
              清除配置
            </button>
          </div>

          {/* 结果提示 */}
          {testResult && (
            <div className={`text-sm px-4 py-3 rounded-lg ${
              testResult.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
            }`}>
              {testResult.message}
            </div>
          )}

          {saved && !testResult && (
            <div className="text-sm px-4 py-3 rounded-lg bg-green-50 text-green-700 flex items-center gap-2">
              <Check size={14} />
              配置已保存！
            </div>
          )}
        </div>

        {/* 创建仓库步骤 */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="font-semibold text-gray-800 mb-4">创建数据仓库步骤</h2>
          <ol className="text-sm text-gray-600 space-y-3">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
              <span>打开 <a href="https://github.com/new" target="_blank" rel="noopener" className="text-primary underline inline-flex items-center gap-1">github.com/new <ExternalLink size={10} /></a> 创建新仓库</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
              <span>仓库名填写 <code className="bg-gray-100 px-1 rounded">myblog-data</code>，选择 <strong>Private</strong>（私有），不要勾选 README</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
              <span>创建 Token：<a href="https://github.com/settings/tokens/new?scopes=repo" target="_blank" rel="noopener" className="text-primary underline inline-flex items-center gap-1">github.com/settings/tokens/new <ExternalLink size={10} /></a></span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">4</span>
              <span>勾选 <code className="bg-gray-100 px-1 rounded">repo</code> 完全控制，Expiration 选择 <strong>No expiration</strong>，点击 Generate</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">5</span>
              <span>复制 Token，填入上方表单，点击「保存配置」</span>
            </li>
          </ol>
        </div>

        {/* 提示 */}
        <div className="flex items-start gap-2 text-xs text-gray-400">
          <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
          <span>Token 仅保存在你本浏览器的 localStorage 中，不会上传到任何第三方服务器。建议使用私有仓库存放文章数据。</span>
        </div>
      </div>
    </div>
  );
}
